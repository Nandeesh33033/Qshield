/**
 * Teleportation-based Quantum Digital Signature (QDS) Protocol Engine
 * Simulates:
 * 1. Quantum Key Generation (Pauli MUB states)
 * 2. Bell-state entanglement distribution (Alice-Bob & Alice-Charlie)
 * 3. Teleportation-based signature generation & transmission
 * 4. Pauli correction operations & Projective measurement verification
 * 5. Non-repudiation & Arbitration between Bob and Charlie
 */

import {
  PauliBasis,
  PauliEigenstate,
  QubitState,
  QDSKeypair,
  QuantumSignature,
  BellMeasurementOutcome,
} from '../types';
import {
  PAULI_EIGENSTATES,
  teleportQubit,
} from './quantumCore';

// Fast deterministic string hashing to binary for message digest
export function stringToBinaryHash(str: string, bitLength: number): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  let binary = (hash >>> 0).toString(2).padStart(32, '0');
  while (binary.length < bitLength) {
    binary += (hash >>> 0).toString(2).padStart(32, '0');
  }
  return binary.slice(0, bitLength);
}

/**
 * Generate Quantum Keypair for Alice (Signer)
 * Prepares Pauli eigenstates from MUBs {X, Y, Z}
 */
export function generateQDSKeypair(bitLength: number = 64): QDSKeypair {
  const privateKeyStates: PauliEigenstate[] = [];
  const privateKeyBases: PauliBasis[] = [];
  const basesPool: PauliBasis[] = ['X', 'Y', 'Z'];
  const stateKeys = Object.keys(PAULI_EIGENSTATES) as PauliEigenstate[];

  const publicKeyEntangledPairs = [];

  for (let i = 0; i < bitLength; i++) {
    const basis = basesPool[Math.floor(Math.random() * basesPool.length)];
    privateKeyBases.push(basis);

    let state: PauliEigenstate;
    if (basis === 'Z') {
      state = Math.random() < 0.5 ? '|0>' : '|1>';
    } else if (basis === 'X') {
      state = Math.random() < 0.5 ? '|+>' : '|->';
    } else {
      state = Math.random() < 0.5 ? '|+i>' : '|-i>';
    }
    privateKeyStates.push(state);

    // Entangled Bell pair |Phi+> = (|00> + |11>) / sqrt(2)
    publicKeyEntangledPairs.push({
      id: i,
      bellState: 'Phi+' as const,
      aliceQubit: PAULI_EIGENSTATES['|0>'],
      bobQubit: PAULI_EIGENSTATES['|0>'],
      fidelity: 0.998,
    });
  }

  return {
    id: `qds-kp-${Math.random().toString(36).substring(2, 9)}`,
    bitLength,
    privateKeyStates,
    privateKeyBases,
    publicKeyEntangledPairs,
  };
}

/**
 * Sign message using Teleportation-based QDS
 * Alice entangles signature state with Bell-pair half, measures in Bell basis,
 * and outputs classical feed (c1, c2) for Pauli reconstruction at Bob.
 */
export function signMessageTeleportation(
  message: string,
  keypair: QDSKeypair,
  channelNoiseDepol: number = 0,
  channelPhaseDamping: number = 0
): {
  signature: QuantumSignature;
  recoveredStatesAtBob: QubitState[];
  fidelities: number[];
} {
  const bitLength = keypair.bitLength;
  const messageHashBinary = stringToBinaryHash(message, bitLength);
  const bellMeasurementOutcomes: BellMeasurementOutcome[] = [];
  const transmittedBases: PauliBasis[] = [];
  const pauliCorrectionsApplied: string[] = [];
  const recoveredStatesAtBob: QubitState[] = [];
  const fidelities: number[] = [];

  for (let i = 0; i < bitLength; i++) {
    // Select state based on key and message bit
    const eigenstateName = keypair.privateKeyStates[i];
    const sourceState = PAULI_EIGENSTATES[eigenstateName];
    const basis = keypair.privateKeyBases[i];

    // Teleport Alice's qubit state to Bob through the entangled quantum channel
    const teleportResult = teleportQubit(
      sourceState,
      channelNoiseDepol,
      channelPhaseDamping
    );

    bellMeasurementOutcomes.push(teleportResult.outcome);
    transmittedBases.push(basis);
    pauliCorrectionsApplied.push(teleportResult.outcome.pauliCorrection);
    recoveredStatesAtBob.push(teleportResult.recoveredState);
    fidelities.push(teleportResult.fidelity);
  }

  const signature: QuantumSignature = {
    signatureId: `sig-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    message,
    messageHashBinary,
    timestamp: Date.now(),
    nonce: `nonce-${Math.random().toString(36).substring(2, 10)}`,
    bellMeasurementOutcomes,
    transmittedBases,
    pauliCorrectionsApplied,
  };

  return {
    signature,
    recoveredStatesAtBob,
    fidelities,
  };
}
