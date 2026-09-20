/**
 * Quantum Teleportation Circuit Visualizer
 * Step-by-step interactive quantum gate circuit for teleportation-based QDS:
 * Wires: Alice (|psi_sig>), Alice (Bell Pair A), Bob (Bell Pair B)
 * Gates: Hadamard, CNOT, Bell-State Measurement, Classical Feed, Pauli X/Z correction, Projective Measurement
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  HelpCircle,
  Binary,
  Layers
} from 'lucide-react';

export const CircuitVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(3);

  const steps = [
    {
      step: 0,
      name: 'Initial State Preparation',
      description: 'Alice prepares signature qubit |psi_sig> = alpha|0> + beta|1> from Pauli MUB keys. Entangled pair source prepares |0>_A and |0>_B.',
      stateFormula: '|Psi_0> = (alpha|0> + beta|1>)_sig (x) |0>_A |0>_B',
      blochBob: { x: 0, y: 0, z: 1 },
      activeWires: ['sig', 'A', 'B'],
    },
    {
      step: 1,
      name: 'Bell Pair Entanglement (EPR Source)',
      description: 'Hadamard gate applied to wire A, followed by CNOT (control A, target B). Creates maximally entangled Bell state |Phi+>_AB.',
      stateFormula: '|Psi_1> = |psi_sig> (x) [ (|00> + |11>)/sqrt(2) ]_AB',
      blochBob: { x: 0, y: 0, z: 0 }, // maximally mixed locally
      activeWires: ['A', 'B'],
    },
    {
      step: 2,
      name: 'Bell-State Measurement (Alice)',
      description: 'Alice entangles signature qubit with her EPR half via CNOT (control sig, target A) and Hadamard on sig.',
      stateFormula: '|Psi_2> = 1/2 [ |00>(alpha|0>+beta|1>) + |01>(alpha|1>+beta|0>) + |10>(alpha|0>-beta|1>) + |11>(alpha|1>-beta|0>) ]',
      blochBob: { x: 0, y: 0, z: 0 },
      activeWires: ['sig', 'A'],
    },
    {
      step: 3,
      name: 'Measurement & Classical Feed',
      description: 'Alice measures qubits (sig, A) in computational basis, yielding 2 classical bits (c1, c2). Sent over classical channel to Bob.',
      stateFormula: 'Measurement Outcomes: (0,0)->|Phi+>, (0,1)->|Psi+>, (1,0)->|Phi->, (1,1)->|Psi->',
      blochBob: { x: 0.6, y: 0, z: 0.8 },
      activeWires: ['c1', 'c2'],
    },
    {
      step: 4,
      name: 'Pauli Correction at Bob',
      description: 'Bob receives (c1, c2) and executes Pauli gate operation: sigma_x^c1 * sigma_z^c2 on his qubit B.',
      stateFormula: '|psi_recovered>_B = sigma_x^c1 sigma_z^c2 [ Bob State ] = alpha|0> + beta|1> (Identical to |psi_sig>)',
      blochBob: { x: 0.707, y: 0, z: 0.707 },
      activeWires: ['B'],
    },
    {
      step: 5,
      name: 'Projective Measurement & Verification',
      description: 'Bob performs projective measurement P_psi = |psi><psi| in Alice\'s announced Pauli basis to verify signature authenticity.',
      stateFormula: 'Deterministic Acceptance if e_Bob <= S_v (11%). Minimum 33.3% error if forged.',
      blochBob: { x: 0.707, y: 0, z: 0.707 },
      activeWires: ['B'],
    },
  ];

  const activeStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                Quantum Circuit
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Unitary Logic Evolution
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Teleportation Circuit Architecture for Quantum Digital Signatures
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Step through the 6 stages of quantum state evolution: from Alice&apos;s Pauli eigenstate encoding, through EPR Bell entanglement distribution and Bell-state measurement (BSM), to Bob&apos;s Pauli correction and projective measurement.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Stage {currentStep} / {steps.length - 1}
            </span>

            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Quantum Circuit Diagram */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs overflow-x-auto">
        <div className="min-w-[700px] py-4">
          
          {/* Wire 1: Alice Signature Qubit */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-24 text-right">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">|&psi;<sub>sig</sub>&rang;</span>
              <div className="text-[10px] text-slate-400 font-mono">Alice Key</div>
            </div>

            <div className="flex-1 relative flex items-center">
              {/* Wire line */}
              <div className="absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-700"></div>

              {/* Gate components along timeline */}
              <div className="flex justify-between w-full relative z-10 px-6">
                <div className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded border bg-white dark:bg-slate-900 ${currentStep >= 0 ? 'border-indigo-500 text-indigo-600' : 'border-slate-300 text-slate-400'}`}>
                  State Prep
                </div>

                <div className="w-8"></div>

                <div className={`w-10 h-10 rounded border flex items-center justify-center font-mono font-bold text-xs bg-white dark:bg-slate-900 ${currentStep >= 2 ? 'border-indigo-600 text-indigo-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  &bull; (Ctrl)
                </div>

                <div className={`w-10 h-10 rounded border flex items-center justify-center font-mono font-bold text-xs bg-white dark:bg-slate-900 ${currentStep >= 2 ? 'border-indigo-600 text-indigo-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  H
                </div>

                <div className={`w-12 h-10 rounded border flex flex-col items-center justify-center font-mono text-[10px] bg-white dark:bg-slate-900 ${currentStep >= 3 ? 'border-blue-600 text-blue-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  <span>Measure</span>
                  <span className="font-bold">&rarr; c₁</span>
                </div>

                <div className="w-16"></div>
              </div>
            </div>
          </div>

          {/* Wire 2: Alice Entangled Bell Half */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-24 text-right">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">|0&rang;<sub>A</sub></span>
              <div className="text-[10px] text-slate-400 font-mono">EPR Part A</div>
            </div>

            <div className="flex-1 relative flex items-center">
              <div className="absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-700"></div>

              <div className="flex justify-between w-full relative z-10 px-6">
                <div className="w-8"></div>

                <div className={`w-10 h-10 rounded border flex items-center justify-center font-mono font-bold text-xs bg-white dark:bg-slate-900 ${currentStep >= 1 ? 'border-indigo-600 text-indigo-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  H
                </div>

                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-xs bg-white dark:bg-slate-900 ${currentStep >= 2 ? 'border-indigo-600 text-indigo-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  &oplus;
                </div>

                <div className="w-8"></div>

                <div className={`w-12 h-10 rounded border flex flex-col items-center justify-center font-mono text-[10px] bg-white dark:bg-slate-900 ${currentStep >= 3 ? 'border-blue-600 text-blue-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  <span>Measure</span>
                  <span className="font-bold">&rarr; c₂</span>
                </div>

                <div className="w-16"></div>
              </div>
            </div>
          </div>

          {/* Wire 3: Bob Entangled Bell Half */}
          <div className="flex items-center gap-4">
            <div className="w-24 text-right">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">|0&rang;<sub>B</sub></span>
              <div className="text-[10px] text-slate-400 font-mono">Bob Qubit</div>
            </div>

            <div className="flex-1 relative flex items-center">
              <div className="absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-700"></div>

              <div className="flex justify-between w-full relative z-10 px-6">
                <div className="w-8"></div>

                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-xs bg-white dark:bg-slate-900 ${currentStep >= 1 ? 'border-indigo-600 text-indigo-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  &oplus;
                </div>

                <div className="w-8"></div>
                <div className="w-8"></div>

                <div className={`px-3 py-1.5 rounded border font-mono text-xs font-bold bg-white dark:bg-slate-900 ${currentStep >= 4 ? 'border-emerald-600 text-emerald-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  &sigma;<sub>x</sub><sup>c1</sup> &sigma;<sub>z</sub><sup>c2</sup>
                </div>

                <div className={`px-3 py-1.5 rounded border font-mono text-xs font-bold bg-white dark:bg-slate-900 ${currentStep >= 5 ? 'border-purple-600 text-purple-600 shadow-xs' : 'border-slate-300 text-slate-400'}`}>
                  P<sub>&psi;</sub> (Project)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Description & Quantum State Evolution Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Stage {activeStepData.step}: {activeStepData.name}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
            {activeStepData.description}
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-slate-900 dark:text-white">
            {activeStepData.stateFormula}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Information Flow Guarantee
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              No quantum state travels faster than light. Bob cannot reconstruct Alice&apos;s signature until the 2 classical bits (c₁, c₂) arrive via conventional channel, respecting relativistic causality and no-signaling theorem.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono text-slate-500">
            <span>Reconstruction:</span>
            <span className="font-bold text-emerald-600">Deterministic</span>
          </div>
        </div>
      </div>
    </div>
  );
};
