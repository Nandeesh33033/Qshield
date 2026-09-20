/**
 * Quantum-Inspired Cyber Threat Detection Framework for QDS
 * Type Definitions and Data Models
 */

export type PauliBasis = 'X' | 'Y' | 'Z';

export type PauliEigenstate = '|0>' | '|1>' | '|+>' | '|->' | '|+i>' | '|-i>';

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface QubitState {
  alpha: ComplexNumber;
  beta: ComplexNumber;
  label?: string;
  basis?: PauliBasis;
}

export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
  theta: number;
  phi: number;
}

export type BellState = 'Phi+' | 'Phi-' | 'Psi+' | 'Psi-';

export interface BellMeasurementOutcome {
  outcomeIndex: number; // 0: Phi+, 1: Phi-, 2: Psi+, 3: Psi-
  classicalBits: [number, number]; // [c1, c2]
  pauliCorrection: 'I' | 'X' | 'Z' | 'ZX';
}

export interface QDSKeypair {
  id: string;
  bitLength: number;
  privateKeyStates: PauliEigenstate[];
  privateKeyBases: PauliBasis[];
  publicKeyEntangledPairs: {
    id: number;
    bellState: BellState;
    aliceQubit: QubitState;
    bobQubit: QubitState;
    fidelity: number;
  }[];
}

export interface QuantumSignature {
  signatureId: string;
  message: string;
  messageHashBinary: string;
  timestamp: number;
  nonce: string;
  bellMeasurementOutcomes: BellMeasurementOutcome[];
  transmittedBases: PauliBasis[];
  pauliCorrectionsApplied: string[];
}

export type AttackType = 
  | 'NONE'
  | 'EXISTENTIAL_FORGERY'
  | 'IMPERSONATION_MITM'
  | 'REPLAY_DECOHERENCE'
  | 'CHANNEL_MANIPULATION'
  | 'UNAUTHORIZED_VERIFICATION';

export interface AttackConfig {
  type: AttackType;
  name: string;
  description: string;
  noiseLevel: number; // 0 to 1
  phaseDamping: number; // 0 to 1
  interceptProbability: number; // 0 to 1
  tamperedMessage?: string;
  replayTimeDelayMs?: number;
}

export interface VerificationResult {
  signatureId: string;
  message: string;
  isAuthentic: boolean;
  threatDetected: boolean;
  detectedThreatType: AttackType;
  threatConfidence: number; // 0 to 1
  totalBitsChecked: number;
  matchingMeasurements: number;
  measuredQBER: number; // Quantum Bit Error Rate
  qberThreshold: number; // S_v
  quantumFidelity: number;
  bellInequalityScore: number; // CHSH S-parameter (<=2 classical, >2 quantum)
  statisticalPValue: number;
  forgeryProbability: number;
  verificationLatencyMs: number;
  arbitrationTransferable: boolean; // Bob to Charlie transferability
  stepLogs: string[];
}

export interface SecurityMetricRecord {
  keyLength: number;
  qber: number;
  forgeryProbTheoretical: number;
  forgeryProbSimulated: number;
  helstromBound: number;
  chernoffBound: number;
  fidelity: number;
  falseAlarmRate: number;
  detectionRate: number;
}

export interface ExpectedDeliverable {
  id: string;
  deliverableName: string;
  specification: string;
  quantumFoundation: string;
  threatMitigated: string;
  benchmarkMetric: string;
  status: 'COMPLIANT' | 'VERIFIED' | 'OPTIMIZED';
}
