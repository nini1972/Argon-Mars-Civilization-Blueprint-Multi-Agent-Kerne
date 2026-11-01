/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AutonomyLevel,
  CivilizationLens,
  DashboardTab,
  SettlementId,
} from '../types/blueprint';
import { SETTLEMENT_SITES } from './D3MarsMap';
import {
  Play,
  Pause,
  StepForward,
  Download,
  Globe,
  Cpu,
  Brain,
  Sparkles,
  BookOpen,
  ShieldAlert,
  Layers,
  MapPin,
  Radio,
  Clock,
  GitCompare,
} from 'lucide-react';

interface NavigationProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  activeLens: CivilizationLens;
  setActiveLens: (lens: CivilizationLens) => void;
  activeSettlementId: SettlementId;
  setActiveSettlementId: (id: SettlementId) => void;
  autonomyLevel: AutonomyLevel;
  setAutonomyLevel: (lvl: AutonomyLevel) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  sol: number;
  setSol: (sol: number) => void;
  millisol: number;
  actTick: number;
  stepTick: () => void;
  onExportClick: () => void;
  deltaModeActive: boolean;
  onToggleDeltaMode: () => void;
}

const LENS_CONFIG: {
  id: CivilizationLens;
  label: string;
  shortDesc: string;
  colorClass: string;
  activeBg: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'ALL',
    label: 'All Layers (Converged)',
    shortDesc: 'Full 7-module coupled telemetry across physics, kernel, psyche, and canon',
    colorClass: 'text-amber-400',
    activeBg: 'bg-amber-500 text-slate-950 border-amber-400',
    icon: Layers,
  },
  {
    id: 'GEOGRAPHY',
    label: 'Geography Lens',
    shortDesc: 'Areography, MOLA elevation, subsurface glacial ice tables, and lava tube stratigraphy',
    colorClass: 'text-cyan-400',
    activeBg: 'bg-cyan-500 text-slate-950 border-cyan-400',
    icon: Globe,
  },
  {
    id: 'INFRASTRUCTURE',
    label: 'Infrastructure Lens',
    shortDesc: '10ms TMR Kernel, VCG power/water auctions, Sabatier ISRU, and 2,400km Maglev spine',
    colorClass: 'text-amber-400',
    activeBg: 'bg-amber-500 text-slate-950 border-amber-400',
    icon: Cpu,
  },
  {
    id: 'PSYCHOLOGY',
    label: 'Psychology Lens',
    shortDesc: '5D Homeostatic Tensors, FACS tension, circadian entrainment, and ZK-PSE Digital Dignity',
    colorClass: 'text-purple-400',
    activeBg: 'bg-purple-500 text-slate-950 border-purple-400',
    icon: Brain,
  },
  {
    id: 'CULTURE',
    label: 'Culture Lens',
    shortDesc: 'Arean creole linguistics, Basalt Brutalism aesthetics, biophilic commons, and 0.38g nativity',
    colorClass: 'text-emerald-400',
    activeBg: 'bg-emerald-500 text-slate-950 border-emerald-400',
    icon: Sparkles,
  },
  {
    id: 'NARRATIVE',
    label: 'Narrative Lens',
    shortDesc: '12-Film & 3-Series Diegetic Canon, historical precedent pinning, and 46.25Hz Sol soundtrack',
    colorClass: 'text-amber-300',
    activeBg: 'bg-amber-400 text-slate-950 border-amber-300',
    icon: BookOpen,
  },
  {
    id: 'RESILIENCE',
    label: 'Resilience Lens',
    shortDesc: 'Cascade stress-testing, CBF safety envelopes, black-start sequencers, and survival buffers',
    colorClass: 'text-rose-400',
    activeBg: 'bg-rose-500 text-slate-950 border-rose-400',
    icon: ShieldAlert,
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  activeLens,
  setActiveLens,
  activeSettlementId,
  setActiveSettlementId,
  autonomyLevel,
  setAutonomyLevel,
  isRunning,
  setIsRunning,
  sol,
  setSol,
  millisol,
  actTick,
  stepTick,
  onExportClick,
  deltaModeActive,
  onToggleDeltaMode,
}) => {
  // Compute Martian Year & Epoch from Sol (1 Mars Year ~ 668.6 Sols, 50 Earth Years ~ 18,262 Sols)
  const earthYear = Math.min(50, Math.max(1, Math.ceil(sol / 365.24)));
  const currentEpoch =
    earthYear <= 10
      ? 'Epoch I: Beachhead'
      : earthYear <= 20
      ? 'Epoch II: Autarky'
      : earthYear <= 30
      ? 'Epoch III: Nativity'
      : earthYear <= 40
      ? 'Epoch IV: Network'
      : 'Epoch V: Horizon';

  // Compute simulated Earth-Mars one-way light-time latency (3m 12s to 21m 48s across 780-Sol synod)
  const synodPhase = ((sol % 780) / 780) * 2 * Math.PI;
  const lightTimeMinutes = 12.5 + 9.2 * Math.cos(synodPhase);
  const ltMin = Math.floor(lightTimeMinutes);
  const ltSec = Math.floor((lightTimeMinutes - ltMin) * 60);
  const isConjunctionWindow = lightTimeMinutes > 20.8;

  const currentSettlement =
    SETTLEMENT_SITES.find((s) => s.id === activeSettlementId) || SETTLEMENT_SITES[0];

  const currentLensMeta = LENS_CONFIG.find((l) => l.id === activeLens) || LENS_CONFIG[0];

  return (
    <div className="sticky top-0 z-50 bg-[#07090e]/95 backdrop-blur border-b border-slate-800">
      {/* Zone 1, 2, 3: Primary Navigation Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
        {/* Zone 1: Brand Wordmark & OS Version */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-sm sm:text-base font-bold tracking-tight text-slate-100 hover:text-white whitespace-nowrap shrink-0 flex items-center gap-2.5 transition-colors text-left"
        >
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block shadow-sm shadow-amber-500/50" aria-hidden="true" />
          <span>Argon · Mars OS 5.0</span>
        </button>

        {/* Zone 2: Navigation Tabs (Including Arcadia Prime Integrated View) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs xl:text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Overview &amp; Spine
          </button>
          <button
            onClick={() => setActiveTab('arcadia')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 flex items-center gap-1.5 ${
              activeTab === 'arcadia'
                ? 'text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                : 'text-cyan-400/80 hover:text-cyan-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{currentSettlement.name} Twin</span>
          </button>
          <button
            onClick={() => setActiveTab('atlas')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'atlas'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Atlas (Plates I–VII)
          </button>
          <button
            onClick={() => setActiveTab('kernel')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'kernel'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Multi-Agent Kernel
          </button>
          <button
            onClick={() => setActiveTab('planetary')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'planetary'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Planetary Lab
          </button>
          <button
            onClick={() => setActiveTab('emotional')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'emotional'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Emotional Twins
          </button>
          <button
            onClick={() => setActiveTab('cinematic')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 ${
              activeTab === 'cinematic'
                ? 'text-white border-b-2 border-amber-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Cinematic Canon
          </button>
        </nav>

        {/* Zone 3: Delta Mode & Export Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleDeltaMode}
            className={`px-2.5 py-1.5 text-xs font-mono rounded-md border transition-colors flex items-center gap-1.5 ${
              deltaModeActive
                ? 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300'
            }`}
            title="Compare live civilization state against baseline snapshot"
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{deltaModeActive ? 'Delta: ON' : 'Delta Diff'}</span>
          </button>

          <button
            onClick={onExportClick}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Blueprint</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Strip */}
      <div className="flex lg:hidden items-center gap-2 px-6 py-2 bg-slate-950 border-t border-slate-800/80 overflow-x-auto text-xs font-medium">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'arcadia', label: `${currentSettlement.name} Twin` },
            { id: 'atlas', label: 'Atlas' },
            { id: 'kernel', label: 'Kernel' },
            { id: 'planetary', label: 'Planetary Lab' },
            { id: 'emotional', label: 'Emotional Twins' },
            { id: 'cinematic', label: 'Cinematic Canon' },
          ] as { id: DashboardTab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
              activeTab === t.id
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 bg-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Telemetry & Global State Bus Ribbon */}
      <div className="bg-[#0b0f19] border-t border-slate-800/80 px-6 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          {/* Left: Global Settlement Lock & Areocentric Clock */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Settlement Node Selector */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-500 hidden sm:inline">NODE:</span>
              <select
                value={activeSettlementId}
                onChange={(e) => setActiveSettlementId(e.target.value as SettlementId)}
                className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-bold rounded px-2 py-0.5 focus:outline-none focus:border-cyan-400"
              >
                {SETTLEMENT_SITES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} · {s.name} (Pop: {s.population.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-700">|</span>

            {/* Areocentric Clock & 50-Year Spine Scrubber */}
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-amber-400 tabular-nums">
                SOL {sol.toString().padStart(5, '0')}
              </span>
              <span className="text-slate-500">
                (Y{earthYear.toString().padStart(2, '0')} · {currentEpoch.split(':')[0]})
              </span>
              <span className="text-slate-600 hidden md:inline">/</span>
              <span className="text-slate-300 tabular-nums hidden md:inline">
                {millisol.toFixed(0)} mSol
              </span>
              <span className="text-slate-600 hidden xl:inline">/</span>
              <span className="text-slate-400 tabular-nums hidden xl:inline">
                ACT {actTick.toString().padStart(4, '0')}
              </span>
            </div>

            {/* Quick 50-Year Time Scrubber */}
            <div className="hidden xl:flex items-center gap-1.5 pl-1" title="Scrub across the 50-Year Execution Spine (Sol 1 to Sol 18,262)">
              <input
                type="range"
                min={1}
                max={18262}
                value={sol}
                onChange={(e) => setSol(parseInt(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer h-1"
              />
            </div>
          </div>

          {/* Right: Earth Latency, Autonomy Level, and Simulation Stepper */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Earth-Mars One-Way Light Time */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] ${
                isConjunctionWindow
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300'
              }`}
              title="One-Way Light-Time Delay to Earth (DTN Bundle Protocol v7)"
            >
              <Radio className={`w-3 h-3 ${isConjunctionWindow ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
              <span>
                OWLT: {ltMin}m {ltSec.toString().padStart(2, '0')}s
                {isConjunctionWindow ? ' [DEAD-SYNC]' : ' [LOCAL KERNEL]'}
              </span>
            </div>

            {/* Autonomy Level Control */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 hidden md:inline">AL:</span>
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
            <div className="flex items-center gap-1.5">
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
                    <span>Run ACT</span>
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

      {/* Civilization Lens Switcher Bar */}
      <div className="bg-[#080b12] border-t border-slate-800/70 px-6 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1 shrink-0">
              CIVILIZATION LENS:
            </span>
            {LENS_CONFIG.map((lens) => {
              const Icon = lens.icon;
              const isSelected = activeLens === lens.id;
              return (
                <button
                  key={lens.id}
                  onClick={() => setActiveLens(lens.id)}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? `${lens.activeBg} font-bold shadow-sm`
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isSelected ? 'text-slate-950' : lens.colorClass}`} />
                  <span>{lens.label.replace(' Lens', '')}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${currentLensMeta.colorClass.replace('text-', 'bg-')}`} />
            <span>{currentLensMeta.shortDesc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
