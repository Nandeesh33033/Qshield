/**
 * Main Application Entry Point
 * Quantum-Inspired Cyber Threat Detection for Digital Signature Security
 * (Teleportation-Based Quantum Digital Signatures)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  QDSKeypair, 
  QuantumSignature, 
  VerificationResult, 
  AttackConfig, 
  QubitState 
} from './types';
import { generateQDSKeypair, signMessageTeleportation } from './quantum/qdsProtocol';
import { verifyAndDetectThreats, DEFAULT_QBER_THRESHOLD } from './quantum/threatDetector';
import { Header } from './components/Header';
import { ProtocolSimulator } from './components/ProtocolSimulator';
import { AttackLab } from './components/AttackLab';
import { DeliveryTable } from './components/DeliveryTable';
import { CircuitVisualizer } from './components/CircuitVisualizer';
import { SecurityAnalysis } from './components/SecurityAnalysis';
import { PerformanceMetrics } from './components/PerformanceMetrics';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');
  const [bitLength, setBitLength] = useState<number>(64);
  const [messageInput, setMessageInput] = useState<string>(
    'AUTH_TRANSFER: 2,500,000 Q-Credits to Recipient Bob [ESCROW-492]'
  );

  const [keypair, setKeypair] = useState<QDSKeypair>(() => generateQDSKeypair(64));
  const [signature, setSignature] = useState<QuantumSignature | null>(null);
  const [recoveredStates, setRecoveredStates] = useState<QubitState[]>([]);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [attackConfig, setAttackConfig] = useState<AttackConfig>({
    type: 'NONE',
    name: 'Honest Quantum Channel',
    description: 'Noise-free teleportation channel with high Bell-state fidelity.',
    noiseLevel: 0.02,
    phaseDamping: 0.01,
    interceptProbability: 0,
  });

  // Execute protocol generation and verification
  const executeProtocol = useCallback(
    (currentBitLength = bitLength, currentAttack = attackConfig, msg = messageInput) => {
      setIsSimulating(true);

      // 1. Generate fresh or reuse keypair
      const currentKey =
        keypair.bitLength === currentBitLength ? keypair : generateQDSKeypair(currentBitLength);
      if (keypair.bitLength !== currentBitLength) {
        setKeypair(currentKey);
      }

      // 2. Sign via teleportation
      const depolNoise = currentAttack.type === 'CHANNEL_MANIPULATION' ? currentAttack.noiseLevel : 0.01;
      const phaseDamping = currentAttack.type === 'CHANNEL_MANIPULATION' ? currentAttack.phaseDamping : 0.01;

      const { signature: sig, recoveredStatesAtBob } = signMessageTeleportation(
        msg,
        currentKey,
        depolNoise,
        phaseDamping
      );

      // 3. Verify and detect cyber threats strictly using quantum mechanics
      const result = verifyAndDetectThreats(
        sig,
        currentKey,
        recoveredStatesAtBob,
        currentAttack,
        DEFAULT_QBER_THRESHOLD
      );

      setSignature(sig);
      setRecoveredStates(recoveredStatesAtBob);
      setVerificationResult(result);
      setIsSimulating(false);
    },
    [bitLength, attackConfig, messageInput, keypair]
  );

  // Initialize on mount
  useEffect(() => {
    executeProtocol(64, {
      type: 'NONE',
      name: 'Honest Quantum Channel',
      description: 'Noise-free teleportation channel with high Bell-state fidelity.',
      noiseLevel: 0.02,
      phaseDamping: 0.01,
      interceptProbability: 0,
    });
  }, []);

  // Update when key length changes
  const handleBitLengthChange = (newLength: number) => {
    setBitLength(newLength);
    const newKey = generateQDSKeypair(newLength);
    setKeypair(newKey);
    executeProtocol(newLength, attackConfig, messageInput);
  };

  const handleLaunchAttack = () => {
    executeProtocol(bitLength, attackConfig, messageInput);
  };

  const handleDisarmAttack = () => {
    const disarmed: AttackConfig = {
      type: 'NONE',
      name: 'Honest Quantum Channel',
      description: 'Clean EPR Bell-state distribution channel.',
      noiseLevel: 0.01,
      phaseDamping: 0.01,
      interceptProbability: 0,
    };
    setAttackConfig(disarmed);
    executeProtocol(bitLength, disarmed, messageInput);
  };

  const handleReset = () => {
    const freshKey = generateQDSKeypair(bitLength);
    setKeypair(freshKey);
    const honest: AttackConfig = {
      type: 'NONE',
      name: 'Honest Quantum Channel',
      description: 'Clean EPR Bell-state distribution channel.',
      noiseLevel: 0.01,
      phaseDamping: 0.01,
      interceptProbability: 0,
    };
    setAttackConfig(honest);
    executeProtocol(bitLength, honest, messageInput);
  };

  const currentFidelity = verificationResult ? verificationResult.quantumFidelity : 0.995;
  const currentBellCHSH = verificationResult ? verificationResult.bellInequalityScore : 2.82;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header with Telemetry & Tab Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fidelity={currentFidelity}
        bellCHSH={currentBellCHSH}
        isSimulating={isSimulating}
        onRunSimulation={() => executeProtocol()}
        onReset={handleReset}
        activeThreat={attackConfig.type}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && (
          <ProtocolSimulator
            keypair={keypair}
            signature={signature}
            verificationResult={verificationResult}
            recoveredStates={recoveredStates}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            bitLength={bitLength}
            setBitLength={handleBitLengthChange}
            onSignAndVerify={() => executeProtocol()}
            isSimulating={isSimulating}
          />
        )}

        {activeTab === 'attacks' && (
          <AttackLab
            attackConfig={attackConfig}
            setAttackConfig={setAttackConfig}
            verificationResult={verificationResult}
            onLaunchAttack={handleLaunchAttack}
            onDisarmAttack={handleDisarmAttack}
            isSimulating={isSimulating}
          />
        )}

        {activeTab === 'deliverables' && <DeliveryTable />}

        {activeTab === 'circuit' && <CircuitVisualizer />}

        {activeTab === 'security' && <SecurityAnalysis />}

        {activeTab === 'metrics' && <PerformanceMetrics />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Q-SHIELD Architecture:</span>
            <span>Teleportation-Based Quantum Digital Signatures with Non-AI Threat Detection</span>
          </div>
          <div className="font-mono text-[11px]">
            ISO/IEC Post-Quantum Information-Theoretic Security Standard (ITS)
          </div>
        </div>
      </footer>
    </div>
  );
}
