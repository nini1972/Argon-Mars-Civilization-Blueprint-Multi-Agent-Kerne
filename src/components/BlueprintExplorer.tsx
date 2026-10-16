/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BLUEPRINT_SECTIONS, SPECIALIST_AGENTS } from '../data/blueprintData';
import { BlueprintSection, AgentDescriptor } from '../types/blueprint';
import {
  Layers,
  Cpu,
  Share2,
  ChevronRight,
  BookOpen,
  Hash,
  ArrowRight,
  ShieldAlert,
  Code2,
} from 'lucide-react';

interface BlueprintExplorerProps {
  onSelectSection: (section: BlueprintSection) => void;
  onNavigateTab: (tab: 'overview' | 'atlas' | 'kernel' | 'planetary' | 'emotional' | 'cinematic') => void;
}

export const BlueprintExplorer: React.FC<BlueprintExplorerProps> = ({
  onSelectSection,
  onNavigateTab,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDescriptor | null>(null);

  return (
    <div className="space-y-10">
      {/* Hero Overview */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0b0e17] to-slate-950 p-8 md:p-10 space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider">
            <span>50-Year Mars Civilization Architecture</span>
            <span>·</span>
            <span>1,000,000 Token Specification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            The Unified Mars Civilization Blueprint &amp; Multi-Agent Operating System
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A comprehensive, mathematically closed architectural framework for 50 years of human settlement on Mars. Bridges deterministic real-time control kernels, planetary cryo-hydrology and radiative transfer, zero-knowledge emotional homeostasis, and a 12-film diegetic cinematic canon.
          </p>
        </div>

        {/* Quick Access Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4">
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
              Vectorized areographic maps, deep stratigraphy, and habitat deck floorplans.
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
              TMR lockstep, VCG auctions, and Control Barrier Function (CBF) safety filters.
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
              Delta-Eddington dust models, Rodwell Stefan cryo-hydrology, and secondary neutrons.
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
              5D homeostatic vectors, FACS tension mappings, and ZK-SNARK privacy enclaves.
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
              12 canon feature films, 3 TV series, live soundtrack synthesizer, and Arean creole.
            </p>
          </button>
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
              className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between"
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
            <span>The 7-Module Architecture Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical structure and section identifiers across the blueprint
          </p>
        </div>

        <div className="space-y-3">
          {BLUEPRINT_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 text-xs font-mono bg-slate-950 text-amber-400 rounded border border-slate-800 font-bold">
                    {sec.moduleId}
                  </span>
                  <h3 className="text-base font-bold text-slate-100">{sec.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
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
