/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BLUEPRINT_SECTIONS, SPECIALIST_AGENTS, CANON_FILMS } from '../data/blueprintData';
import {
  BlueprintSection,
  CivilizationLens,
  DashboardTab,
  SettlementId,
} from '../types/blueprint';
import { SETTLEMENT_SITES } from './D3MarsMap';
import {
  Layers,
  Cpu,
  ChevronRight,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface BlueprintExplorerProps {
  onSelectSection: (section: BlueprintSection) => void;
  onNavigateTab: (tab: DashboardTab) => void;
  activeLens?: CivilizationLens;
  sol?: number;
  setSol?: (sol: number) => void;
  activeSettlementId?: SettlementId;
  setActiveSettlementId?: (id: SettlementId) => void;
}

const EPOCH_MILESTONES = [
  {
    id: 'Epoch I',
    years: 'Years 01–10',
    solRange: 'Sol 0001 – 3,650',
    targetSol: 1240,
    title: 'Beachhead & Autarky Foundation',
    settlement: 'arcadia-prime' as SettlementId,
    pop: '48 → 150',
    powerMW: '1.2 MWe',
    canonRef: 'F-01 / F-02 / F-03',
    summary: '12-crew pre-deployment landing in Arcadia Planitia, Sabatier ISRU commissioning, and sealing of Lava Tube-1.',
  },
  {
    id: 'Epoch II',
    years: 'Years 11–20',
    solRange: 'Sol 3,651 – 7,300',
    targetSol: 5200,
    title: 'Subsurface Aquifer & First Nativity',
    settlement: 'arcadia-prime' as SettlementId,
    pop: '150 → 1,450',
    powerMW: '12.5 MWe',
    canonRef: 'F-04 / F-05 / F-06',
    summary: 'Breaching the -120m Rodwell glacial table, birth of the first Mars-native Arean cohort, and First Constitutional Synod.',
  },
  {
    id: 'Epoch III',
    years: 'Years 21–30',
    solRange: 'Sol 7,301 – 10,950',
    targetSol: 8100,
    title: 'Paraterraforming & Swarm Sintering',
    settlement: 'jezero' as SettlementId,
    pop: '2,000 → 6,200',
    powerMW: '48.0 MWe',
    canonRef: 'F-07 / F-08 / F-09',
    summary: '240 microwave-sintering rovers construct the 12-hectare ETFE-aerogel dome at Jezero Capitol; Conjunction black-start.',
  },
  {
    id: 'Epoch IV',
    years: 'Years 31–40',
    solRange: 'Sol 10,951 – 14,600',
    targetSol: 13200,
    title: '2,400km Maglev & Multi-Basin Network',
    settlement: 'valles-beta' as SettlementId,
    pop: '8,000 → 15,000',
    powerMW: '185.0 MWe',
    canonRef: 'F-10 / F-11',
    summary: 'Completion of the Trans-Tharsis Vacuum Maglev linking Valles Beta and Hellas Foundry; Earth climate schism treaty.',
  },
  {
    id: 'Epoch V',
    years: 'Years 41–50',
    solRange: 'Sol 14,601 – 18,262',
    targetSol: 17600,
    title: 'Speciation Horizon & Homo Arean',
    settlement: 'utopia-gamma' as SettlementId,
    pop: '15,000 → 25,750',
    powerMW: '520.0 MWe',
    canonRef: 'F-12 / S-03',
    summary: 'Utopia Gamma deep cryo-aquifer & genomic vault online; 98.8% closed-loop bioregenerative sovereignty achieved.',
  },
];

const AGENT_LENS_MAP: Record<string, CivilizationLens[]> = {
  'AGT-PSS': ['GEOGRAPHY', 'RESILIENCE'],
  'AGT-TKA': ['INFRASTRUCTURE', 'RESILIENCE'],
  'AGT-EMA': ['PSYCHOLOGY', 'CULTURE'],
  'AGT-CUD': ['NARRATIVE', 'CULTURE'],
  'AGT-GMA': ['INFRASTRUCTURE', 'RESILIENCE', 'GEOGRAPHY'],
};

const MODULE_LENS_MAP: Record<string, CivilizationLens[]> = {
  'Module 1': ['GEOGRAPHY', 'RESILIENCE'],
  'Module 2': ['INFRASTRUCTURE', 'RESILIENCE'],
  'Module 3': ['PSYCHOLOGY', 'CULTURE'],
  'Module 4': ['NARRATIVE', 'CULTURE'],
  'Module 5': ['RESILIENCE', 'INFRASTRUCTURE'],
  'Module 6': ['CULTURE', 'PSYCHOLOGY'],
  'Module 7': ['GEOGRAPHY', 'INFRASTRUCTURE'],
};

export const BlueprintExplorer: React.FC<BlueprintExplorerProps> = ({
  onNavigateTab,
  activeLens = 'ALL',
  sol = 142,
  setSol,
  activeSettlementId = 'arcadia-prime',
  setActiveSettlementId,
}) => {
  const earthYear = Math.min(50, Math.max(1, Math.ceil(sol / 365.24)));
  const currentSettlement =
    SETTLEMENT_SITES.find((s) => s.id === activeSettlementId) || SETTLEMENT_SITES[0];

  const getLensStyle = (lenses: CivilizationLens[]) => {
    if (activeLens === 'ALL') return 'border-slate-800';
    return lenses.includes(activeLens)
      ? 'border-amber-500/90 ring-1 ring-amber-500/30 bg-slate-900/90'
      : 'border-slate-800/50 opacity-70';
  };

  return (
    <div className="space-y-10">
      {/* Hero Overview */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0b0e17] to-slate-950 p-8 md:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider">
              <span>ARGON MARS OS 5.0 (CONVERGENCE RELEASE)</span>
              <span>·</span>
              <span>UNIFIED CIVILIZATION STATE BUS</span>
              <span>·</span>
              <span className="text-cyan-400">LENS: {activeLens}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              The Unified Mars Civilization Blueprint &amp; Multi-Agent Operating System
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A mathematically closed, bidirectionally coupled operating environment for 50 years of human civilization on Mars. Connects Areographic Atlas Plates, Planetary Cryo-Hydrology, Tier-0 TMR Kernel Auctions, Zero-Knowledge Emotional Digital Twins, and the 12-Film Diegetic Canon into one living state machine.
            </p>
          </div>

          {/* Primary Launchpad to Arcadia Prime Integrated City-State Twin */}
          <div className="shrink-0 p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/50 max-w-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FLAGSHIP CONVERGENCE VIEW</span>
              </span>
              <span>{currentSettlement.code}</span>
            </div>
            <div className="text-base font-bold text-white">
              {currentSettlement.name} Integrated Command Twin
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inspect Atlas stratigraphy, Planetary Lab physics, Kernel VCG bids, Emotional Twin dignity telemetry, and Cascade Stress tests on a single unified screen.
            </p>
            <button
              onClick={() => onNavigateTab('arcadia')}
              className="w-full py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <span>Launch {currentSettlement.name} Command View</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Access Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-4">
          <button
            onClick={() => onNavigateTab('arcadia')}
            className="p-4 bg-cyan-950/30 hover:bg-cyan-900/40 rounded-xl border border-cyan-500/50 text-left transition-all group"
          >
            <div className="text-cyan-400 text-xs font-mono mb-1">CITY-STATE TWIN</div>
            <div className="text-sm font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
              <span>Arcadia Integrated</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-300 mt-1.5">
              6-panel unified command bridge for all 5 settlements.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('atlas')}
            className="p-4 bg-slate-950/70 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/80 text-left transition-all group"
          >
            <div className="text-amber-500 text-xs font-mono mb-1">FOLIO</div>
            <div className="text-sm font-bold text-slate-100 group-hover:text-amber-400 flex items-center justify-between">
              <span>Atlas (Plates I–VII)</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Vectorized areographic maps, deep stratigraphy, and floorplans.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('kernel')}
            className="p-4 bg-slate-950/70 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/60 text-left transition-all group"
          >
            <div className="text-amber-500 text-xs font-mono mb-1">MODULE 2</div>
            <div className="text-sm font-bold text-slate-100 group-hover:text-amber-400 flex items-center justify-between">
              <span>Deterministic Kernel</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              TMR lockstep, VCG auctions, and CBF safety filters.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('planetary')}
            className="p-4 bg-slate-950/70 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/60 text-left transition-all group"
          >
            <div className="text-cyan-400 text-xs font-mono mb-1">MODULE 1</div>
            <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 flex items-center justify-between">
              <span>Planetary Simulation</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Delta-Eddington dust, Rodwell cryo-hydrology, and GCR neutrons.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('emotional')}
            className="p-4 bg-slate-950/70 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/60 text-left transition-all group"
          >
            <div className="text-purple-400 text-xs font-mono mb-1">MODULE 3</div>
            <div className="text-sm font-bold text-slate-100 group-hover:text-purple-300 flex items-center justify-between">
              <span>Emotional Twins</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              5D homeostatic vectors, FACS mappings, and Digital Dignity.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('cinematic')}
            className="p-4 bg-slate-950/70 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/60 text-left transition-all group"
          >
            <div className="text-amber-500 text-xs font-mono mb-1">MODULE 4</div>
            <div className="text-sm font-bold text-slate-100 group-hover:text-amber-400 flex items-center justify-between">
              <span>Cinematic Canon</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              12 feature films, 3 TV series, live synth, and Arean creole.
            </p>
          </button>
        </div>
      </div>

      {/* Interactive 50-Year Diachronic Execution Spine State Loader */}
      <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-amber-500 uppercase mb-1">
              MODULE 5 · INTERACTIVE 50-YEAR EXECUTION SPINE STATE LOADER
            </div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Scrub Civilization State Across Five 10-Year Epochs (Sol 0001 – Sol 18,262)</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">ACTIVE TEMPORAL COORDINATE:</span>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold">
              Sol {sol.toLocaleString()} · Year {earthYear}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {EPOCH_MILESTONES.map((ep) => {
            const isCurrentEpoch =
              (ep.id === 'Epoch I' && earthYear <= 10) ||
              (ep.id === 'Epoch II' && earthYear > 10 && earthYear <= 20) ||
              (ep.id === 'Epoch III' && earthYear > 20 && earthYear <= 30) ||
              (ep.id === 'Epoch IV' && earthYear > 30 && earthYear <= 40) ||
              (ep.id === 'Epoch V' && earthYear > 40);

            return (
              <div
                key={ep.id}
                onClick={() => {
                  if (setSol) setSol(ep.targetSol);
                  if (setActiveSettlementId) setActiveSettlementId(ep.settlement);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isCurrentEpoch
                    ? 'bg-amber-950/25 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-400">{ep.id}</span>
                    <span className="text-[10px] text-slate-400">{ep.years}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{ep.title}</h3>
                  <div className="text-[10px] font-mono text-cyan-400">{ep.solRange}</div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{ep.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pop Scale:</span>
                    <span className="text-slate-200 font-bold">{ep.pop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Grid Target:</span>
                    <span className="text-emerald-400 font-bold">{ep.powerMW}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Canon Films:</span>
                    <span className="text-amber-400">{ep.canonRef}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialist Agent Taxonomy Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              <span>Specialist Kernel Agent Taxonomy</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The 5 specialized personas instantiated as deterministic runtime daemons
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SPECIALIST_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className={`p-5 bg-slate-900/60 rounded-xl border space-y-3 flex flex-col justify-between transition-all ${getLensStyle(
                AGENT_LENS_MAP[agent.id] || ['INFRASTRUCTURE']
              )}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-500">{agent.id}</span>
                  <span className="text-slate-500 text-[10px]">{agent.tier}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{agent.name}</h3>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{agent.daemon}</div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {agent.mandate}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                <div>Consumes: {agent.consumes.length} streams</div>
                <div>Produces: {agent.produces.length} products</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Module Master Architecture Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>The 7-Module Architecture Matrix &amp; Constitutional Guardrails</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical structure, governing PDEs, and live invariant compliance across the blueprint
          </p>
        </div>

        <div className="space-y-3">
          {BLUEPRINT_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              className={`p-5 bg-slate-900/60 rounded-xl border space-y-3 transition-all ${getLensStyle(
                MODULE_LENS_MAP[sec.moduleId] || ['INFRASTRUCTURE']
              )}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 text-xs font-mono bg-slate-950 text-amber-400 rounded border border-slate-800 font-bold">
                    {sec.moduleId}
                  </span>
                  <h3 className="text-base font-bold text-slate-100">{sec.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> GUARDRAIL ACTIVE
                  </span>
                  <span>ID: [{sec.id}]</span>
                  <span>·</span>
                  <span className="text-slate-300">{sec.agentOwnership.join(', ')}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{sec.summary}</p>

              {sec.subsections && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                  {sec.subsections.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2.5 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs"
                    >
                      <div className="text-amber-500 font-bold">[{sub.id}]</div>
                      <div className="text-slate-200 font-sans text-[11px] mt-0.5 font-semibold">
                        {sub.title}
                      </div>
                      <div className="text-slate-400 font-sans text-[10px] mt-1 line-clamp-2">
                        {sub.summary}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sec.governingEquations && sec.governingEquations.length > 0 && (
                <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300 space-y-1">
                  <div className="text-[10px] uppercase text-slate-500">Governing Mathematical Invariants:</div>
                  {sec.governingEquations.map((eq, i) => (
                    <div key={i} className="tabular-nums">
                      {eq}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
