/**
 * Protocol Simulator Component
 * Teleportation-based Quantum Digital Signature Pipeline
 * Alice (Signer) -> Bell Teleportation Channel -> Bob (Verifier) -> Charlie (Arbiter)
 */

import React, { useState } from 'react';
import { 
  QDSKeypair, 
  QuantumSignature, 
  VerificationResult, 
  QubitState,
  PauliEigenstate
} from '../types';
import { getBlochCoordinates } from '../quantum/quantumCore';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Share2, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ProtocolSimulatorProps {
  keypair: QDSKeypair;
  signature: QuantumSignature | null;
  verificationResult: VerificationResult | null;
  recoveredStates: QubitState[];
  messageInput: string;
  setMessageInput: (msg: string) => void;
  bitLength: number;
  setBitLength: (len: number) => void;
  onSignAndVerify: () => void;
  isSimulating: boolean;
}

export const ProtocolSimulator: React.FC<ProtocolSimulatorProps> = ({
  keypair,
  signature,
  verificationResult,
  recoveredStates,
  messageInput,
  setMessageInput,
  bitLength,
  setBitLength,
  onSignAndVerify,
  isSimulating,
}) => {
  const [selectedQubitIdx, setSelectedQubitIdx] = useState<number>(0);

  const sampleMessages = [
    'AUTH_TRANSFER: 2,500,000 Q-Credits to Recipient Bob [ESCROW-492]',
    'GRID_COMMAND: Execute SCADA Interlock Bypass Substation-Delta',
    'DIPLOMATIC_CABLE: Ratification of PQC Non-Proliferation Treaty',
  ];

  const selectedStateName = keypair.privateKeyStates[selectedQubitIdx] || '|0>';
  const selectedBasis = keypair.privateKeyBases[selectedQubitIdx] || 'Z';
  const selectedRecovered = recoveredStates[selectedQubitIdx] || keypair.publicKeyEntangledPairs[0]?.aliceQubit;
  const blochCoords = selectedRecovered ? getBlochCoordinates(selectedRecovered) : { x: 0, y: 0, z: 1, theta: 0, phi: 0 };
  const outcome = signature?.bellMeasurementOutcomes[selectedQubitIdx];

  return (
    <div className="space-y-6">
      {/* Simulation Control & Message Inputs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Teleportation-Based QDS Protocol Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Alice signs a message by teleporting secret Pauli eigenstates (|0&rang;, |1&rang;, |+&rang;, |-&rang;, |+i&rang;, |-i&rang;) using Bell pairs. Bob applies Pauli corrections to verify authenticity.
            </p>
          </div>

          {/* Key Length Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
              Security Parameter (N Qubits):
            </label>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
              {[32, 64, 128].map((len) => (
                <button
                  key={len}
                  onClick={() => setBitLength(len)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                    bitLength === len
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input & Quick Samples */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Message Payload to Sign:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="message-input"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Enter digital document or payload..."
                className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <button
                id="sign-teleport-button"
                onClick={onSignAndVerify}
                disabled={isSimulating || !messageInput.trim()}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Teleport & Sign</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Presets:</span>
            {sampleMessages.map((msg, i) => (
              <button
                key={i}
                onClick={() => setMessageInput(msg)}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors truncate max-w-xs cursor-pointer"
              >
                {msg.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Architecture: 3-Party Stages (Alice -> Channel -> Bob -> Charlie) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alice Card (Signer) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alice (Signer)</h3>
                <span className="text-[10px] text-slate-500">MUB Key & BSM Source</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {bitLength} Qubits
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Key Bases:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                X (Hadamard), Y, Z (Comp)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Bell State:</span>
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                |&Phi;<sup>+</sup>&rang; = (|00&rang;+|11&rang;)/&radic;2
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">BSM Output:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                2 Classical Bits (c<sub>1</sub>, c<sub>2</sub>)
              </span>
            </div>
          </div>
        </div>

        {/* Bob Card (Verifier) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                B
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bob (Verifier 1)</h3>
                <span className="text-[10px] text-slate-500">Pauli Correction & Projection</span>
              </div>
            </div>

            {verificationResult && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                verificationResult.isAuthentic
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {verificationResult.isAuthentic ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-rose-500" />
                )}
                {verificationResult.isAuthentic ? 'ACCEPTED' : 'REJECTED'}
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Pauli Op:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                &sigma;<sub>x</sub><sup>c1</sup> &sigma;<sub>z</sub><sup>c2</sup>
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Measured QBER:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {verificationResult ? `${(verificationResult.measuredQBER * 100).toFixed(1)}%` : '0.0%'} (Limit: 11%)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Mean Fidelity:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {verificationResult ? `${(verificationResult.quantumFidelity * 100).toFixed(1)}%` : '99.8%'}
              </span>
            </div>
          </div>
        </div>

        {/* Charlie Card (Arbiter / Non-Repudiation) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                C
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Charlie (Arbiter)</h3>
                <span className="text-[10px] text-slate-500">Non-Repudiation Symmetrization</span>
              </div>
            </div>

            {verificationResult && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                verificationResult.arbitrationTransferable
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {verificationResult.arbitrationTransferable ? 'TRANSFERABLE' : 'UNTRANSFERABLE'}
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Arbitration Gap:</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                &Delta;S = S<sub>a</sub> - S<sub>v</sub> = 4.0%
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Non-Repudiation:</span>
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                Guaranteed (P &gt; 1 - 10<sup>-9</sup>)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Repudiation Risk:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                &epsilon;<sub>rep</sub> &le; 2<sup>-64</sup>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Signature Qubit Grid & Bloch State Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Qubit Array Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Teleported Signature Qubits Stream ({bitLength} QuKeys)
              </h3>
              <p className="text-xs text-slate-500">
                Click any qubit to inspect its Pauli eigenstate, Bell measurement result, and recovered state.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Z
              </span>
              <span className="flex items-center gap-1 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> X
              </span>
              <span className="flex items-center gap-1 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Y
              </span>
            </div>
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-2 max-h-72 overflow-y-auto p-1">
            {keypair.privateKeyStates.map((state, idx) => {
              const basis = keypair.privateKeyBases[idx];
              const isSelected = selectedQubitIdx === idx;
              const outcomeForQubit = signature?.bellMeasurementOutcomes[idx];
              
              let basisColor = 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300';
              if (basis === 'X') {
                basisColor = 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300';
              } else if (basis === 'Y') {
                basisColor = 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedQubitIdx(idx)}
                  className={`p-1.5 rounded-lg text-center font-mono text-[11px] border transition-all cursor-pointer ${basisColor} ${
                    isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 font-bold shadow-xs' : 'hover:scale-102'
                  }`}
                  title={`Qubit #${idx}: ${state} in basis ${basis}`}
                >
                  <div className="text-[9px] text-slate-400">#{idx}</div>
                  <div className="font-bold leading-none my-0.5">{state}</div>
                  <div className="text-[9px] opacity-75">{basis}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Qubit Detailed Inspector & Bloch Sphere Representation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Qubit #{selectedQubitIdx} Telemetry
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded">
                Basis {selectedBasis}
              </span>
            </div>

            {/* Pauli State & Teleportation Correction */}
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 mb-1">Alice's Secret Eigenstate:</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{selectedStateName}</span>
                  <span className="text-xs font-normal text-slate-500">
                    &alpha;|0&rang; + &beta;|1&rang;
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 mb-1">Bell Measurement & Pauli Fix:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-400">c1, c2: </span>
                    <span className="font-bold">{outcome ? `${outcome.classicalBits[0]}, ${outcome.classicalBits[1]}` : '0, 0'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Pauli Op: </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {outcome?.pauliCorrection || 'I'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloch Sphere Coordinates Calculation */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono">
                <div className="text-[11px] text-slate-500 mb-1">Bloch Vector (r = 1.0):</div>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <div>x: {blochCoords.x.toFixed(2)}</div>
                  <div>y: {blochCoords.y.toFixed(2)}</div>
                  <div>z: {blochCoords.z.toFixed(2)}</div>
                </div>
                <div className="mt-1 text-[10px] text-slate-400">
                  &theta; = {(blochCoords.theta * (180 / Math.PI)).toFixed(1)}&deg;, &phi; = {(blochCoords.phi * (180 / Math.PI)).toFixed(1)}&deg;
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Quantum Fidelity F:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">99.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
