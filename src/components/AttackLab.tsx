/**
 * Attack Simulation Laboratory & Threat Detection Component
 * Simulates 5 critical cyber threat vectors on Teleportation-based QDS
 * and detects them deterministically via quantum observables (strictly NO AI/ML).
 */

import React, { useState } from 'react';
import { 
  AttackConfig, 
  AttackType, 
  VerificationResult 
} from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Activity, 
  Radio, 
  Zap, 
  RefreshCw,
  Lock,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface AttackLabProps {
  attackConfig: AttackConfig;
  setAttackConfig: React.Dispatch<React.SetStateAction<AttackConfig>>;
  verificationResult: VerificationResult | null;
  onLaunchAttack: () => void;
  onDisarmAttack: () => void;
  isSimulating: boolean;
}

export const AttackLab: React.FC<AttackLabProps> = ({
  attackConfig,
  setAttackConfig,
  verificationResult,
  onLaunchAttack,
  onDisarmAttack,
  isSimulating,
}) => {
  const [selectedThreat, setSelectedThreat] = useState<AttackType>(attackConfig.type);

  const attackPresets: {
    type: AttackType;
    title: string;
    description: string;
    quantumPrinciple: string;
    threatMechanism: string;
    detectionRule: string;
  }[] = [
    {
      type: 'EXISTENTIAL_FORGERY',
      title: '1. Existential Forgery Attack',
      description: 'Adversary Eve fabricates a signature without Alice\'s secret Pauli key basis.',
      quantumPrinciple: 'Quantum No-Cloning Theorem & Mutually Unbiased Bases (MUBs)',
      threatMechanism: 'Eve guesses random bases (X, Y, Z) to construct signature states. Induces mandatory 33.3% projective measurement error rate.',
      detectionRule: 'Projective measurement error count exceeds threshold: QBER > S_v (11.0%).',
    },
    {
      type: 'IMPERSONATION_MITM',
      title: '2. Impersonator Man-In-The-Middle',
      description: 'Adversary intercepts Bell pairs between Alice and Bob, impersonating signer/verifier.',
      quantumPrinciple: 'CHSH Bell Inequality & Entanglement Monogamy',
      threatMechanism: 'Eve intercepts and measures EPR pairs, collapsing entangled state |Phi+> into separable classical state rho_AB.',
      detectionRule: 'Bell witness drops below classical local-realistic bound: S_CHSH <= 2.0 (Quantum ideal: 2.828).',
    },
    {
      type: 'REPLAY_DECOHERENCE',
      title: '3. Replay Attack & Memory Decoherence',
      description: 'Adversary replays historical classical BSM telemetry with delayed or captured states.',
      quantumPrinciple: 'Quantum Phase Damping (T2) & State Purity Loss',
      threatMechanism: 'Stored quantum states suffer thermal dephasing exp(-t/T2). Timestamp-nonce freshness desynchronizes.',
      detectionRule: 'Timestamp latency exceeds coherence window (5000ms) or state purity Tr(rho^2) collapses.',
    },
    {
      type: 'CHANNEL_MANIPULATION',
      title: '4. Quantum Channel Manipulation',
      description: 'Adversary injects active depolarizing noise and phase-damping perturbations into fiber.',
      quantumPrinciple: 'Kraus Channel Operator Representation E(rho)',
      threatMechanism: 'Active tampering destroys state fidelity across all 3 Pauli bases uniformly: E(rho) = (1-p)rho + (p/3)sum(sigma_i rho sigma_i).',
      detectionRule: 'Mean Quantum Fidelity F drops below security bound F_crit = 0.85.',
    },
    {
      type: 'UNAUTHORIZED_VERIFICATION',
      title: '5. Unauthorized Verification Repudiation',
      description: 'Malicious verifier Bob modifies signed document and attempts false arbitration with Charlie.',
      quantumPrinciple: 'Dual-Threshold Arbitration Symmetrization',
      threatMechanism: 'Bob accepts Alice\'s valid signature, alters message body, and forwards forged payload to Charlie.',
      detectionRule: 'Message payload hash divergence; violates arbitration gap Delta_S = S_a - S_v.',
    },
  ];

  const handleSelectThreat = (type: AttackType) => {
    setSelectedThreat(type);
    if (type === 'NONE') {
      onDisarmAttack();
      return;
    }
    const preset = attackPresets.find((p) => p.type === type);
    setAttackConfig({
      type,
      name: preset?.title || type,
      description: preset?.description || '',
      noiseLevel: type === 'CHANNEL_MANIPULATION' ? 0.35 : 0.05,
      phaseDamping: type === 'CHANNEL_MANIPULATION' ? 0.30 : 0.05,
      interceptProbability: type === 'EXISTENTIAL_FORGERY' ? 0.90 : 0.50,
      replayTimeDelayMs: type === 'REPLAY_DECOHERENCE' ? 12000 : 0,
      tamperedMessage: type === 'UNAUTHORIZED_VERIFICATION' ? 'FRAUDULENT_TX: Divert 10,000,000 Credits to Eve\'s Account' : undefined,
    });
  };

  const activePreset = attackPresets.find((p) => p.type === selectedThreat);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded border border-rose-300 dark:border-rose-800">
                Threat Testbed
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Zero AI / Zero ML - Pure Quantum Physics
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Cyber Threat Detection & Attack Simulation Laboratory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Inject active adversarial attacks into the quantum digital signature protocol. The framework identifies threats deterministically using Pauli eigenstates, Bell entanglement witnesses, and statistical decision bounds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="disarm-attack-button"
              onClick={() => handleSelectThreat('NONE')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                attackConfig.type === 'NONE'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Honest Channel (Disarm)
            </button>

            <button
              id="launch-attack-button"
              onClick={onLaunchAttack}
              disabled={isSimulating || attackConfig.type === 'NONE'}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Simulate Attack</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Attack Vectors Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {attackPresets.map((preset) => {
          const isSelected = selectedThreat === preset.type;
          return (
            <button
              key={preset.type}
              onClick={() => handleSelectThreat(preset.type)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500 shadow-xs ring-1 ring-rose-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    Vector
                  </span>
                  {isSelected && <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {preset.title.split('. ')[1]}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Attack Parameter Controls & Live Quantum Detection Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Attack Parameters Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Adversary Parameters: {activePreset?.title || 'Honest Channel'}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Target: Teleportation Channel
            </span>
          </div>

          {selectedThreat === 'NONE' ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Honest channel selected. Quantum states transmit over standard EPR pairs with minimal environmental noise.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Sliders tailored to the chosen attack */}
              {selectedThreat === 'EXISTENTIAL_FORGERY' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Eve Intercept Rate:</span>
                    <span className="font-mono font-bold text-rose-600">
                      {((attackConfig.interceptProbability || 0.85) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={attackConfig.interceptProbability || 0.85}
                    onChange={(e) =>
                      setAttackConfig((prev) => ({ ...prev, interceptProbability: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-rose-600"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Quantum mechanics induces a 33.3% theoretical error for intercepted qubits in 3 MUBs.
                  </div>
                </div>
              )}

              {selectedThreat === 'CHANNEL_MANIPULATION' && (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Depolarizing Noise (p):</span>
                      <span className="font-mono font-bold text-rose-600">
                        {((attackConfig.noiseLevel || 0.3) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={attackConfig.noiseLevel || 0.3}
                      onChange={(e) =>
                        setAttackConfig((prev) => ({ ...prev, noiseLevel: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Phase Damping Rate (&lambda;):</span>
                      <span className="font-mono font-bold text-rose-600">
                        {((attackConfig.phaseDamping || 0.25) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={attackConfig.phaseDamping || 0.25}
                      onChange={(e) =>
                        setAttackConfig((prev) => ({ ...prev, phaseDamping: parseFloat(e.target.value) }))
                      }
                      className="w-full accent-rose-600"
                    />
                  </div>
                </>
              )}

              {selectedThreat === 'REPLAY_DECOHERENCE' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Simulated Replay Delay:</span>
                    <span className="font-mono font-bold text-rose-600">
                      {attackConfig.replayTimeDelayMs || 12000} ms
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="30000"
                    step="1000"
                    value={attackConfig.replayTimeDelayMs || 12000}
                    onChange={(e) =>
                      setAttackConfig((prev) => ({ ...prev, replayTimeDelayMs: parseInt(e.target.value) }))
                    }
                    className="w-full accent-rose-600"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Quantum memory coherence window threshold is set to 5000 ms.
                  </div>
                </div>
              )}

              {selectedThreat === 'UNAUTHORIZED_VERIFICATION' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tampered Message Payload Injected by Malicious Bob:
                  </label>
                  <input
                    type="text"
                    value={attackConfig.tamperedMessage || ''}
                    onChange={(e) =>
                      setAttackConfig((prev) => ({ ...prev, tamperedMessage: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {/* Scientific Theory Callout */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mt-3 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  Quantum Physical Observable:
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  {activePreset?.quantumPrinciple}
                </div>
                <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-bold">Threat Trigger:</span> {activePreset?.detectionRule}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quantum Detection Decision Engine (Live Output) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Deterministic Threat Detection Result
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Non-AI Hypothesis Test
              </span>
            </div>

            {verificationResult ? (
              <div className="space-y-3">
                {/* Decision Alert Banner */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  verificationResult.threatDetected
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                }`}>
                  {verificationResult.threatDetected ? (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm">
                      {verificationResult.threatDetected
                        ? `THREAT DETECTED: ${verificationResult.detectedThreatType}`
                        : 'SIGNATURE AUTHENTIC - ZERO MALICIOUS INTERFERENCE'}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {verificationResult.threatDetected
                        ? `Threat confidence: ${(verificationResult.threatConfidence * 100).toFixed(1)}% | Signature was deterministically rejected.`
                        : 'Information-theoretic security conditions satisfied. Teleportation fidelity confirmed.'}
                    </div>
                  </div>
                </div>

                {/* 4 Quantitative Observables */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Measured QBER</span>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 flex items-center justify-between">
                      <span>{(verificationResult.measuredQBER * 100).toFixed(1)}%</span>
                      <span className="text-[10px] font-normal text-slate-500">Limit: 11%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Bell CHSH S-Score</span>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 flex items-center justify-between">
                      <span className={verificationResult.bellInequalityScore >= 2.2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}>
                        {verificationResult.bellInequalityScore.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-normal text-slate-500">Min: 2.20</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Quantum Fidelity F</span>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 flex items-center justify-between">
                      <span>{(verificationResult.quantumFidelity * 100).toFixed(1)}%</span>
                      <span className="text-[10px] font-normal text-slate-500">Min: 85%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Statistical Forgery P</span>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                      {verificationResult.forgeryProbability < 1e-6
                        ? `< 10⁻⁶`
                        : verificationResult.forgeryProbability.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Audit Logs */}
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] max-h-36 overflow-y-auto space-y-1">
                  {verificationResult.stepLogs.map((log, i) => (
                    <div key={i} className="leading-tight">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No verification executed yet. Click &quot;Simulate Attack&quot; or execute the protocol from the top bar.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Deterministic Runtime:</span>
            <span className="font-bold font-mono text-slate-700 dark:text-slate-300">
              {verificationResult?.verificationLatencyMs || 1.8} ms (&Omicron;(N))
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
