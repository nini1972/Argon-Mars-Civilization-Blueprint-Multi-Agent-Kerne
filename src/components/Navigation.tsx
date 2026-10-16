/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AutonomyLevel } from '../types/blueprint';
import { Play, Pause, StepForward, Download, Terminal } from 'lucide-react';

interface NavigationProps {
  activeTab: 'overview' | 'kernel' | 'planetary' | 'emotional' | 'cinematic';
  setActiveTab: (tab: 'overview' | 'kernel' | 'planetary' | 'emotional' | 'cinematic') => void;
  autonomyLevel: AutonomyLevel;
  setAutonomyLevel: (lvl: AutonomyLevel) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  sol: number;
  millisol: number;
  actTick: number;
  stepTick: () => void;
  onExportClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  autonomyLevel,
  setAutonomyLevel,
  isRunning,
  setIsRunning,
  sol,
  millisol,
  actTick,
  stepTick,
  onExportClick,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-[#07090e]/95 backdrop-blur border-b border-slate-800">
      {/* Zone 1, 2, 3: Strict Top Bar Contract */}
      <header className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-base font-bold tracking-tight text-slate-100 hover:text-white whitespace-nowrap shrink-0 flex items-center gap-2.5 transition-colors text-left"
        >
          <span className="w-2 h-2 bg-amber-500 rounded-sm inline-block" aria-hidden="true" />
          <span>Argon · Mars Civilization Blueprint</span>
        </button>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-amber-500'
                : 'hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('kernel')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'kernel'
                ? 'text-white border-b-2 border-amber-500'
                : 'hover:text-slate-200'
            }`}
          >
            Multi-Agent Kernel
          </button>
          <button
            onClick={() => setActiveTab('planetary')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'planetary'
                ? 'text-white border-b-2 border-amber-500'
                : 'hover:text-slate-200'
            }`}
          >
            Planetary Lab
          </button>
          <button
            onClick={() => setActiveTab('emotional')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'emotional'
                ? 'text-white border-b-2 border-amber-500'
                : 'hover:text-slate-200'
            }`}
          >
            Emotional Twins
          </button>
          <button
            onClick={() => setActiveTab('cinematic')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'cinematic'
                ? 'text-white border-b-2 border-amber-500'
                : 'hover:text-slate-200'
            }`}
          >
            Cinematic Canon
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExportClick}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Blueprint</span>
          </button>
        </div>
      </header>

      {/* Telemetry Ribbon (Scientific & Aerospace Precision Strip) */}
      <div className="bg-[#0b0f19] border-t border-slate-800/80 px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
          {/* Areocentric Clocks */}
          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-slate-500">MISSION CLOCK:</span>
            <span className="font-semibold text-amber-400 tabular-nums">
              SOL {sol.toString().padStart(4, '0')}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 tabular-nums">
              {millisol.toFixed(2)} mSol
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 tabular-nums">
              ACT {actTick.toString().padStart(4, '0')}
            </span>
          </div>

          {/* Autonomy Level Control */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">AUTONOMY:</span>
            <select
              value={autonomyLevel}
              onChange={(e) => setAutonomyLevel(e.target.value as AutonomyLevel)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2 py-0.5 focus:outline-none focus:border-amber-500"
            >
              <option value="AL0_MANUAL_DIRECT">AL-0: MANUAL_DIRECT</option>
              <option value="AL1_CREW_SUPERVISED">AL-1: CREW_SUPERVISED</option>
              <option value="AL2_NOMINAL_AUTONOMOUS">AL-2: NOMINAL_AUTONOMOUS</option>
              <option value="AL3_CONJUNCTION_LOCK">AL-3: CONJUNCTION_LOCK</option>
              <option value="AL4_ACUTE_EMERGENCY">AL-4: ACUTE_EMERGENCY</option>
              <option value="AL5_LIZARD_BRAIN">AL-5: LIZARD_BRAIN</option>
            </select>
          </div>

          {/* Simulation Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Execute ACT Loop</span>
                </>
              )}
            </button>
            <button
              onClick={stepTick}
              disabled={isRunning}
              className="px-2 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded disabled:opacity-40 transition-colors flex items-center gap-1"
              title="Advance 1 Millisol"
            >
              <StepForward className="w-3 h-3" />
              <span>+1 mSol</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
