/**
 * Header Component for Quantum-Inspired Cyber Threat Detection Framework
 */

import React from 'react';
import { 
  ShieldCheck, 
  Atom, 
  Activity, 
  RotateCcw, 
  Cpu, 
  Lock, 
  AlertTriangle,
  Play,
  FileCheck,
  TrendingUp,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fidelity: number;
  bellCHSH: number;
  isSimulating: boolean;
  onRunSimulation: () => void;
  onReset: () => void;
  activeThreat: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  fidelity,
  bellCHSH,
  isSimulating,
  onRunSimulation,
  onReset,
  activeThreat,
}) => {
  const tabs = [
    { id: 'simulator', label: 'Protocol Simulator', icon: Atom },
    { id: 'attacks', label: 'Attack Lab (Threat Detection)', icon: AlertTriangle },
    { id: 'deliverables', label: 'Delivery Table', icon: FileCheck, badge: 'Required' },
    { id: 'circuit', label: 'Teleportation Circuit', icon: Cpu },
    { id: 'security', label: 'Mathematical Analysis', icon: Lock },
    { id: 'metrics', label: 'Performance & Complexity', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Top Banner with Brand & Real-Time Quantum Telemetry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '16s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Q-SHIELD <span className="text-xs px-2 py-0.5 font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">QDS-v4.2</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Information-Theoretic Security
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quantum-Inspired Cyber Threat Detection for Digital Signature Security (Teleportation-Based QDS)
              </p>
            </div>
          </div>

          {/* Real-time Status Badges & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Quantum State Telemetry */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="font-mono text-slate-400 dark:text-slate-500">Fidelity:</span>
                <span className={`font-mono font-bold ${fidelity > 0.9 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {(fidelity * 100).toFixed(1)}%
                </span>
              </div>

              <span className="text-slate-300 dark:text-slate-600">|</span>

              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="font-mono text-slate-400 dark:text-slate-500">CHSH S:</span>
                <span className={`font-mono font-bold ${bellCHSH >= 2.2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`}>
                  {bellCHSH.toFixed(2)}
                </span>
              </div>

              {activeThreat !== 'NONE' && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                    Threat: {activeThreat}
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <button
              id="run-sim-button"
              onClick={onRunSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isSimulating ? 'Executing Teleportation...' : 'Execute QDS'}
            </button>

            <button
              id="reset-state-button"
              onClick={onReset}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              title="Reset Protocol State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1 mt-3 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-indigo-800 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
