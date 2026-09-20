/**
 * Quantum Mechanics Core Engine
 * Mathematical foundations: Pauli eigenstates, Projective measurements,
 * Bell teleportation, Kraus noise channels, and statistical bounds.
 * (Zero AI/ML - 100% information-theoretic quantum physics)
 */

import {
  ComplexNumber,
  QubitState,
  BlochCoordinates,
  PauliBasis,
  PauliEigenstate,
  BellState,
  BellMeasurementOutcome,
} from '../types';

// Complex number utilities
export const c_add = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const c_sub = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => ({
  re: a.re - b.re,
  im: a.im - b.im,
});

export const c_mul = (a: ComplexNumber, b: ComplexNumber): ComplexNumber => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const c_conj = (a: ComplexNumber): ComplexNumber => ({
  re: a.re,
  im: -a.im,
});

export const c_absSq = (a: ComplexNumber): number => a.re * a.re + a.im * a.im;

export const c_abs = (a: ComplexNumber): number => Math.sqrt(c_absSq(a));

export const c_scale = (a: ComplexNumber, s: number): ComplexNumber => ({
  re: a.re * s,
  im: a.im * s,
});

const INV_SQRT_2 = 1 / Math.SQRT2;

// Standard Pauli Eigenstates
export const PAULI_EIGENSTATES: Record<PauliEigenstate, QubitState> = {
  '|0>': {
    alpha: { re: 1, im: 0 },
    beta: { re: 0, im: 0 },
    label: '|0>',
    basis: 'Z',
  },
  '|1>': {
    alpha: { re: 0, im: 0 },
    beta: { re: 1, im: 0 },
    label: '|1>',
    basis: 'Z',
  },
  '|+>': {
    alpha: { re: INV_SQRT_2, im: 0 },
    beta: { re: INV_SQRT_2, im: 0 },
    label: '|+>',
    basis: 'X',
  },
  '|->': {
    alpha: { re: INV_SQRT_2, im: 0 },
    beta: { re: -INV_SQRT_2, im: 0 },
    label: '|->>',
    basis: 'X',
  },
  '|+i>': {
    alpha: { re: INV_SQRT_2, im: 0 },
    beta: { re: 0, im: INV_SQRT_2 },
    label: '|+i>',
    basis: 'Y',
  },
  '|-i>': {
    alpha: { re: INV_SQRT_2, im: 0 },
    beta: { re: 0, im: -INV_SQRT_2 },
    label: '|-i>',
    basis: 'Y',
  },
};

/**
 * Convert QubitState to Bloch Sphere coordinates (x, y, z, theta, phi)
 */
export function getBlochCoordinates(state: QubitState): BlochCoordinates {
  // Density matrix elements:
  // rho_00 = |alpha|^2
  // rho_11 = |beta|^2
  // rho_01 = alpha * conj(beta)
  // rho_10 = beta * conj(alpha)
  const a = state.alpha;
  const b = state.beta;
  const ab_conj = c_mul(a, c_conj(b));

  const x = 2 * ab_conj.re;
  const y = 2 * ab_conj.im;
  const z = c_absSq(a) - c_absSq(b);

  const r = Math.sqrt(x * x + y * y + z * z);
  const safeZ = Math.max(-1, Math.min(1, r === 0 ? 0 : z / r));
  const theta = Math.acos(safeZ);
  const phi = Math.atan2(y, x);

  return { x, y, z, theta, phi };
}

/**
 * Inner product <psi1 | psi2>
 */
export function innerProduct(s1: QubitState, s2: QubitState): ComplexNumber {
  const term1 = c_mul(c_conj(s1.alpha), s2.alpha);
  const term2 = c_mul(c_conj(s1.beta), s2.beta);
  return c_add(term1, term2);
}

/**
 * Quantum State Fidelity F(|psi1>, |psi2>) = |<psi1|psi2>|^2
 */
export function quantumFidelity(s1: QubitState, s2: QubitState): number {
  const ip = innerProduct(s1, s2);
  const f = c_absSq(ip);
  return Math.min(1.0, Math.max(0.0, f));
}

/**
 * Apply Pauli Gate to QubitState
 */
export function applyPauliGate(state: QubitState, gate: 'I' | 'X' | 'Y' | 'Z' | 'ZX'): QubitState {
  const a = state.alpha;
  const b = state.beta;

  switch (gate) {
    case 'I':
      return { alpha: { ...a }, beta: { ...b } };
    case 'X':
      // [0 1; 1 0]
      return { alpha: { ...b }, beta: { ...a } };
    case 'Z':
      // [1 0; 0 -1]
      return { alpha: { ...a }, beta: { re: -b.re, im: -b.im } };
    case 'Y':
      // [0 -i; i 0]
      return {
        alpha: { re: b.im, im: -b.re },
        beta: { re: -a.im, im: a.re },
      };
    case 'ZX': {
      // Z * X: first X then Z
      return { alpha: { ...b }, beta: { re: -a.re, im: -a.im } };
    }
  }
}

/**
 * Simulate Projective Measurement along basis (X, Y, or Z)
 * Returns the detected eigenvalue (+1 or -1) and corresponding projected state
 */
export function projectiveMeasurement(
  state: QubitState,
  basis: PauliBasis
): { outcome: 1 | -1; projectedState: QubitState; probabilityPlus: number } {
  let pPlus = 0.5;

  if (basis === 'Z') {
    pPlus = c_absSq(state.alpha);
  } else if (basis === 'X') {
    const plusState = PAULI_EIGENSTATES['|+>'];
    pPlus = quantumFidelity(state, plusState);
  } else if (basis === 'Y') {
    const plusIState = PAULI_EIGENSTATES['|+i>'];
    pPlus = quantumFidelity(state, plusIState);
  }

  // Clip probability
  pPlus = Math.max(0, Math.min(1, pPlus));
  const rand = Math.random();
  const outcome: 1 | -1 = rand < pPlus ? 1 : -1;

  let projectedState: QubitState;
  if (basis === 'Z') {
    projectedState = outcome === 1 ? PAULI_EIGENSTATES['|0>'] : PAULI_EIGENSTATES['|1>'];
  } else if (basis === 'X') {
    projectedState = outcome === 1 ? PAULI_EIGENSTATES['|+>'] : PAULI_EIGENSTATES['|->'];
  } else {
    projectedState = outcome === 1 ? PAULI_EIGENSTATES['|+i>'] : PAULI_EIGENSTATES['|-i>'];
  }

  return { outcome, projectedState, probabilityPlus: pPlus };
}

/**
 * Simulate Quantum Teleportation:
 * 1. Alice has message/signature qubit |psi>
 * 2. Alice and Bob share Bell pair |Phi+>_AB = (|00> + |11>) / sqrt(2)
 * 3. Alice performs Bell State Measurement (BSM) on (|psi> and A)
 * 4. Measurement yields 2 classical bits (c1, c2) corresponding to 4 Bell states:
 *    - |Phi+>: c1=0, c2=0 -> Bob applies I
 *    - |Psi+>: c1=1, c2=0 -> Bob applies X
 *    - |Phi->: c1=0, c2=1 -> Bob applies Z
 *    - |Psi->: c1=1, c2=1 -> Bob applies Z * X
 * 5. Bob applies correction to recover identical |psi>
 */
export function teleportQubit(
  sourceState: QubitState,
  channelNoiseDepolarizing: number = 0,
  channelPhaseDamping: number = 0
): {
  outcome: BellMeasurementOutcome;
  recoveredState: QubitState;
  fidelity: number;
} {
  // Bell measurement outcome uniformly random 1/4 each for maximally entangled channel
  const randIdx = Math.floor(Math.random() * 4);
  const outcomes: BellMeasurementOutcome[] = [
    { outcomeIndex: 0, classicalBits: [0, 0], pauliCorrection: 'I' },
    { outcomeIndex: 1, classicalBits: [1, 0], pauliCorrection: 'X' },
    { outcomeIndex: 2, classicalBits: [0, 1], pauliCorrection: 'Z' },
    { outcomeIndex: 3, classicalBits: [1, 1], pauliCorrection: 'ZX' },
  ];

  const outcome = outcomes[randIdx];

  // Bob's raw state before correction is sigma_z^c2 * sigma_x^c1 applied to |psi>
  let rawStateAtBob = { ...sourceState };
  if (outcome.pauliCorrection === 'X') {
    rawStateAtBob = applyPauliGate(sourceState, 'X');
  } else if (outcome.pauliCorrection === 'Z') {
    rawStateAtBob = applyPauliGate(sourceState, 'Z');
  } else if (outcome.pauliCorrection === 'ZX') {
    rawStateAtBob = applyPauliGate(sourceState, 'ZX');
  }

  // Channel perturbation / physical noise during transit
  if (channelNoiseDepolarizing > 0) {
    if (Math.random() < channelNoiseDepolarizing) {
      const errorGates: ('X' | 'Y' | 'Z')[] = ['X', 'Y', 'Z'];
      const chosenError = errorGates[Math.floor(Math.random() * 3)];
      rawStateAtBob = applyPauliGate(rawStateAtBob, chosenError);
    }
  }

  if (channelPhaseDamping > 0) {
    if (Math.random() < channelPhaseDamping) {
      rawStateAtBob = applyPauliGate(rawStateAtBob, 'Z');
    }
  }

  // Bob applies the inverse correction:
  // Since Pauli operators are Hermitian and unitary (X^2 = I, Z^2 = I),
  // Bob applies the same operation:
  const recoveredState = applyPauliGate(rawStateAtBob, outcome.pauliCorrection);
  const fidelity = quantumFidelity(sourceState, recoveredState);

  return { outcome, recoveredState, fidelity };
}

/**
 * CHSH Bell-state parameter evaluation
 * Quantum prediction: S = 2 * sqrt(2) ≈ 2.828
 * Classical limit (Local Hidden Variables): S <= 2
 * Eve's intercept-resend or separable state breaks entanglement: S <= 2
 */
export function calculateCHSHScore(fidelity: number, eavesdroppingLevel: number): number {
  // S = 2 * sqrt(2) * (1 - eavesdroppingLevel * 0.7) * (0.8 + 0.2 * fidelity)
  const maxQuantumS = 2 * Math.SQRT2; // 2.8284
  const degradedS = maxQuantumS * Math.max(0.4, (1 - 0.75 * eavesdroppingLevel) * fidelity);
  // Add slight experimental fluctuation
  const jitter = (Math.random() - 0.5) * 0.04;
  return Math.max(0.8, Math.min(2.83, Number((degradedS + jitter).toFixed(3))));
}

/**
 * Information-Theoretic Security & Mathematical Bounds:
 * Helstrom Bound: Optimum minimum error probability for distinguishing two non-orthogonal quantum states
 * P_e = 0.5 * (1 - 0.5 * ||rho_0 - rho_1||_1)
 */
export function calculateHelstromBound(stateA: QubitState, stateB: QubitState): number {
  const fid = quantumFidelity(stateA, stateB);
  // For pure states, ||rho_0 - rho_1||_1 = 2 * sqrt(1 - |<psi0|psi1>|^2)
  const traceDist = Math.sqrt(Math.max(0, 1 - fid));
  return 0.5 * (1 - traceDist);
}

/**
 * Hoeffding's Inequality Forgery Probability Bound:
 * P_forge <= exp(-2 * N * (Threshold - QBER_honest)^2)
 */
export function calculateHoeffdingForgeryBound(
  bitLength: number,
  verificationThreshold: number,
  qberEve: number = 0.25
): number {
  const margin = Math.max(0.001, qberEve - verificationThreshold);
  const exponent = -2 * bitLength * margin * margin;
  return Math.exp(Math.max(-100, exponent));
}

/**
 * Chernoff Information Bound for Multi-Qubit Hypothesis Testing
 */
export function calculateChernoffBound(bitLength: number, delta: number): number {
  return Math.exp(-bitLength * (delta * delta) / 2);
}
