/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AutonomyLevel,
  CivilizationLens,
  DashboardTab,
  HomeostaticTensor,
  SanctuaryMode,
  SettlementId,
} from '../types/blueprint';
import { SETTLEMENT_SITES, SettlementSite } from './D3MarsMap';
import { ATLAS_PLATES } from '../data/atlasPlatesData';
import { CANON_FILMS } from '../data/blueprintData';
import {
  MapPin,
  Cpu,
  Sun,
  Droplets,
  Brain,
  Film,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Zap,
  Wind,
  Radio,
  Flame,
  Users,
  Lock,
  ArrowUpRight,
  RotateCcw,
  Activity,
  Sparkles,
  Clock,
  Layers,
} from 'lucide-react';

interface ArcadiaPrimeIntegratedViewProps {
  activeSettlementId: SettlementId;
  setActiveSettlementId: (id: SettlementId) => void;
  activeLens: CivilizationLens;
  sol: number;
  setSol: (sol: number) => void;
  millisol: number;
  autonomyLevel: AutonomyLevel;
  opticalDepthTau: number;
  setOpticalDepthTau: (tau: number) => void;
  solarZenithDeg: number;
  setSolarZenithDeg: (deg: number) => void;
  speProtonFlux: number;
  setSpeProtonFlux: (flux: number) => void;
  hullPressurePa: number;
  setHullPressurePa: (pa: number) => void;
  o2PartialPressurePa: number;
  co2PartialPressurePa: number;
  setCo2PartialPressurePa: (pa: number) => void;
  reactorCoreTempK: number;
  setReactorCoreTempK: (k: number) => void;
  chpShuntKw: number;
  setChpShuntKw: (kw: number) => void;
  pipeFlowRateLpm: number;
  setPipeFlowRateLpm: (lpm: number) => void;
  humanTensor: HomeostaticTensor;
  setHumanTensor: React.Dispatch<React.SetStateAction<HomeostaticTensor>>;
  sanctuaryMode: SanctuaryMode;
  setSanctuaryMode: (mode: SanctuaryMode) => void;
  onNavigateTab: (tab: DashboardTab) => void;
  onSelectPlate: (plateId: string) => void;
  onResetNominal: () => void;
}

export const ArcadiaPrimeIntegratedView: React.FC<ArcadiaPrimeIntegratedViewProps> = ({
  activeSettlementId,
  setActiveSettlementId,
  activeLens,
  sol,
  setSol,
  millisol,
  autonomyLevel,
  opticalDepthTau,
  setOpticalDepthTau,
  solarZenithDeg,
  setSolarZenithDeg,
  speProtonFlux,
  setSpeProtonFlux,
  hullPressurePa,
  setHullPressurePa,
  o2PartialPressurePa,
  co2PartialPressurePa,
  setCo2PartialPressurePa,
  reactorCoreTempK,
  setReactorCoreTempK,
  chpShuntKw,
  setChpShuntKw,
  pipeFlowRateLpm,
  setPipeFlowRateLpm,
  humanTensor,
  setHumanTensor,
  sanctuaryMode,
  setSanctuaryMode,
  onNavigateTab,
  onSelectPlate,
  onResetNominal,
}) => {
  const [selectedDomeZone, setSelectedDomeZone] = useState<'tube-1' | 'rodwell-alpha' | 'sabatier' | 'biosphere'>('tube-1');

  const site: SettlementSite =
    SETTLEMENT_SITES.find((s) => s.id === activeSettlementId) || SETTLEMENT_SITES[0];

  // Coupled Physics Calculations (from PlanetarySimulationLab)
  const cosZenith = Math.max(0.01, Math.cos((solarZenithDeg * Math.PI) / 180));
  const toaFlux = 589.2;
  const directFlux = toaFlux * cosZenith * Math.exp(-opticalDepthTau / cosZenith);
  const diffuseRatio = 0.58 * (1 - Math.exp(-0.65 * opticalDepthTau));
  const diffuseFlux = (toaFlux * cosZenith - directFlux) * diffuseRatio;
  const totalSurfaceFlux = Math.max(0, directFlux + diffuseFlux);
  const pvYieldWattsPerM2 = totalSurfaceFlux * 0.28;

  // Rodwell Cryo-Hydrology
  const netMeltKw = Math.max(0, chpShuntKw - 45);
  const meltRateLitersPerSol = Math.round(((netMeltKw * 3600) / 499) * 24.66);
  const isPipeFreezing = pipeFlowRateLpm < 8;

  // Coupled Kernel & Emotional Preemption Weights
  const isSpeEmergency = speProtonFlux >= 10;
  const isDustStorm = opticalDepthTau >= 3.5;
  const isAllostaticPreemption = humanTensor.allostaticLoad >= 0.72;

  let wTka = 0.35;
  let wPss = 0.20;
  let wEma = 0.35;
  let wCud = 0.10;

  if (isSpeEmergency) {
    wTka = 0.52;
    wPss = 0.28;
    wEma = isAllostaticPreemption ? 0.20 : 0.15;
    wCud = 0.00;
  } else if (isDustStorm) {
    wTka = 0.45;
    wPss = 0.30;
    wEma = isAllostaticPreemption ? 0.25 : 0.18;
    wCud = 0.00;
  } else if (isAllostaticPreemption) {
    // Emotional Twin Preemption: AGT-EMA overrides industrial sintering to restore human homeostasis
    wTka = 0.25;
    wPss = 0.18;
    wEma = 0.47;
    wCud = 0.10;
  }

  const weightSum = wTka + wPss + wEma + wCud;
  const pvContributionKw = Math.round(pvYieldWattsPerM2 * 3.2);
  const fissionBaseKw = reactorCoreTempK > 1100 ? 320 : 580;
  const totalPowerSupply = fissionBaseKw + pvContributionKw;
  const ethPowerFloor = 350;
  const contestablePower = Math.max(0, totalPowerSupply - ethPowerFloor);

  // Critical-Path 50-Year Spine Slippage Predictor
  const powerDeficitRatio = Math.max(0, (820 - totalPowerSupply) / 820);
  const fatiguePenalty = Math.max(0, humanTensor.cognitiveFatigue - 0.45);
  const projectedMilestoneSlipSols = Math.round(
    (powerDeficitRatio * 240 + fatiguePenalty * 180 + (isPipeFreezing ? 95 : 0))
  );

  // Match Canonical Film to current Sol/Epoch or Anomaly
  const earthYear = Math.min(50, Math.max(1, Math.ceil(sol / 365.24)));
  const activeEpochNum =
    earthYear <= 10 ? 'Epoch I' : earthYear <= 20 ? 'Epoch II' : earthYear <= 30 ? 'Epoch III' : earthYear <= 40 ? 'Epoch IV' : 'Epoch V';

  const contextualFilm = isDustStorm
    ? CANON_FILMS.find((f) => f.id === 'F-03') || CANON_FILMS[0]
    : isSpeEmergency
    ? CANON_FILMS.find((f) => f.id === 'F-02') || CANON_FILMS[0]
    : CANON_FILMS.find((f) => f.epoch.includes(activeEpochNum)) || CANON_FILMS[0];

  // Multi-Domain Cascade Stress Scenarios
  const triggerCascadeScenario = (type: 'dust_confinement' | 'aquifer_freeze' | 'spe_scram' | 'nominal') => {
    if (type === 'dust_confinement') {
      setOpticalDepthTau(4.5);
      setCo2PartialPressurePa(460);
      setHumanTensor({
        circadianDesync: 0.68,
        allostaticLoad: 0.79,
        cognitiveFatigue: 0.74,
        proxemicCrowding: 0.84,
        vestibularStrain: 0.14,
      });
    } else if (type === 'aquifer_freeze') {
      setChpShuntKw(95);
      setPipeFlowRateLpm(6);
      setHumanTensor((prev) => ({
        ...prev,
        allostaticLoad: 0.75,
        cognitiveFatigue: 0.64,
      }));
    } else if (type === 'spe_scram') {
      setSpeProtonFlux(85);
      setReactorCoreTempK(1120);
      setHullPressurePa(66500);
      setHumanTensor({
        circadianDesync: 0.48,
        allostaticLoad: 0.88,
        cognitiveFatigue: 0.78,
        proxemicCrowding: 0.91,
        vestibularStrain: 0.22,
      });
    } else {
      onResetNominal();
    }
  };

  // Highlight border helper based on active Civilization Lens
  const getLensHighlight = (panelLens: CivilizationLens[]) => {
    if (activeLens === 'ALL') return 'border-slate-800';
    return panelLens.includes(activeLens)
      ? 'border-amber-500/90 ring-1 ring-amber-500/30 bg-slate-900/90'
      : 'border-slate-800/50 opacity-75';
  };

  return (
    <div className="space-y-6">
      {/* Top Integrated Settlement Command Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/95 via-[#0b101d] to-slate-950 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span
                className="px-2 py-0.5 rounded font-bold text-slate-950"
                style={{ backgroundColor: site.color }}
              >
                {site.code}
              </span>
              <span className="text-cyan-400 font-bold uppercase">
                INTEGRATED CITY-STATE COMMAND TWIN
              </span>
              <span>·</span>
              <span className="text-slate-400">
                {site.coordinates[1] >= 0 ? `${site.coordinates[1]}°N` : `${Math.abs(site.coordinates[1])}°S`},{' '}
                {site.coordinates[0] >= 0 ? `${site.coordinates[0]}°E` : `${Math.abs(site.coordinates[0])}°W`}
              </span>
              <span>·</span>
              <span className="text-slate-400">Elev: {site.elevationMolaKm} km MOLA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{site.name} — Unified Operational View</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {site.primaryRole}. Real-time closed-loop convergence uniting Areographic Atlas Plates, Planetary Physics, Tier-0 TMR Kernel Auctions, Emotional Digital Twins, and the 50-Year Execution Spine.
            </p>
          </div>

          {/* Settlement Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SETTLEMENT_SITES.map((s) => {
              const isSelected = s.id === site.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSettlementId(s.id as SettlementId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-100 text-slate-950 border-white font-bold shadow-md'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Telemetry Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-500 uppercase">Population &amp; Nativity</div>
            <div className="text-base font-bold text-slate-100 mt-0.5 tabular-nums">
              {site.population.toLocaleString()}
            </div>
            <div className="text-[10px] text-cyan-400">
              {Math.round((site.populationBreakdown.areanNative / site.population) * 100)}% Arean Native
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-500 uppercase">Surface Optical Depth</div>
            <div className="text-base font-bold text-amber-400 mt-0.5 tabular-nums">
              τ = {opticalDepthTau.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400">
              PV Yield: {pvYieldWattsPerM2.toFixed(1)} W/m²
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-500 uppercase">Kernel Power Bus</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5 tabular-nums">
              {totalPowerSupply} kW_e
            </div>
            <div className="text-[10px] text-slate-400">
              Contestable: {contestablePower} kW
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-500 uppercase">Rodwell Glacial H2O</div>
            <div className="text-base font-bold text-cyan-400 mt-0.5 tabular-nums">
              {meltRateLitersPerSol.toLocaleString()} L/Sol
            </div>
            <div className="text-[10px] text-slate-400">
              Buffer: {site.lifeSupportBufferDays} Sols
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-500 uppercase">Cohort Allostatic Load</div>
            <div
              className={`text-base font-bold mt-0.5 tabular-nums ${
                isAllostaticPreemption ? 'text-rose-400' : 'text-purple-300'
              }`}
            >
              {(humanTensor.allostaticLoad * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-400">
              {isAllostaticPreemption ? 'AGT-EMA Preemption ON' : 'Homeostasis Nominal'}
            </div>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-500 uppercase">50-Yr Spine Drift</div>
            <div
              className={`text-base font-bold mt-0.5 tabular-nums ${
                projectedMilestoneSlipSols > 30 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {projectedMilestoneSlipSols === 0 ? 'ON SCHEDULE' : `+${projectedMilestoneSlipSols} Sols`}
            </div>
            <div className="text-[10px] text-slate-400">
              Year {earthYear} ({activeEpochNum})
            </div>
          </div>
        </div>
      </div>

      {/* 6-Panel Master Convergence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================================================================ */}
        {/* PANEL 1: SPATIAL ATLAS & SUBSURFACE TOPOLOGY (PLATES I, II, III) */}
        {/* ================================================================ */}
        <div
          className={`p-6 bg-slate-900/60 rounded-2xl border transition-all space-y-4 ${getLensHighlight([
            'GEOGRAPHY',
            'INFRASTRUCTURE',
          ])}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-amber-500 uppercase">
                PANEL 01 · SPATIAL ATLAS &amp; ARCHITECTURAL STRATIGRAPHY
              </div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>{site.name} Sector Schematic &amp; Plate Index</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('atlas')}
              className="px-2.5 py-1 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded flex items-center gap-1 transition-colors"
            >
              <span>Full Atlas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Subsurface Sector SVG Diagram */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#06080f] p-3">
            <svg viewBox="0 0 600 230" className="w-full h-auto select-none">
              {/* Surface Sky & Dust Opacity */}
              <rect
                x="0"
                y="0"
                width="600"
                height="45"
                fill={isDustStorm ? '#7c2d12' : '#1e1b2e'}
                fillOpacity={Math.min(0.85, 0.25 + opticalDepthTau * 0.12)}
              />
              <text x="12" y="20" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                SURFACE DATUM (z = 0m) · τ = {opticalDepthTau.toFixed(2)} · {site.surfacePressurePa} Pa
              </text>

              {/* Surface Solar Array & Sinter Rovers */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedDomeZone('sabatier')}
              >
                <rect x="410" y="25" width="165" height="16" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <text x="492" y="36" textAnchor="middle" fill="#e0f2fe" fontSize="9" fontFamily="monospace">
                  PV BLANKET + ISRU ({pvYieldWattsPerM2.toFixed(0)} W/m²)
                </text>
              </g>

              {/* Basalt Overburden Layer (10.04m minimum safe burial) */}
              <rect x="0" y="45" width="600" height="55" fill="#141824" stroke="#334155" strokeWidth="1" />
              <text x="12" y="65" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                BASALT OVERBURDEN (H_burial = 18.5m ≥ 10.04m Min) · Graded-Z H2O/Boron Liner
              </text>

              {/* Lava Tube Primary Habitat Vault (z = -18.5m) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedDomeZone('tube-1')}
              >
                <rect
                  x="20"
                  y="95"
                  width="340"
                  height="65"
                  rx="12"
                  fill="#0f172a"
                  stroke={selectedDomeZone === 'tube-1' ? '#38bdf8' : '#475569'}
                  strokeWidth="2"
                />
                <text x="35" y="116" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  LAVA TUBE HABITAT DECK ({(hullPressurePa / 1000).toFixed(1)} kPa · PO2 {(o2PartialPressurePa / 1000).toFixed(1)} kPa)
                </text>
                <text x="35" y="132" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                  Circadian Sky-Cove: {humanTensor.circadianDesync > 0.5 ? '6500K Entrainment Boost' : '4200K Nominal Sol Sync'}
                </text>
                <text x="35" y="147" fill="#a855f7" fontSize="9" fontFamily="monospace">
                  ZK-PSE Cohort Stress: {(humanTensor.allostaticLoad * 100).toFixed(0)}% · CO2: {co2PartialPressurePa} Pa
                </text>
              </g>

              {/* Spirulina Photobioreactor & Biosphere Bay */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedDomeZone('biosphere')}
              >
                <rect
                  x="375"
                  y="95"
                  width="205"
                  height="65"
                  rx="10"
                  fill="#052e16"
                  fillOpacity="0.6"
                  stroke={selectedDomeZone === 'biosphere' ? '#10b981' : '#047857'}
                  strokeWidth="1.8"
                />
                <text x="388" y="116" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  BIOSPHERE &amp; SPIRULINA
                </text>
                <text x="388" y="132" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
                  1,820 kg/Sol Biomass · 98% O2 Loop
                </text>
                <text x="388" y="147" fill="#6ee7b7" fontSize="9" fontFamily="monospace">
                  Biophilic Sanctuary: ACTIVE
                </text>
              </g>

              {/* Deep Cryosphere & Rodwell Stefan Melt Cavity (z = -120m) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedDomeZone('rodwell-alpha')}
              >
                <rect x="0" y="170" width="600" height="60" fill="#082f49" fillOpacity="0.55" />
                <ellipse
                  cx="480"
                  cy="200"
                  rx="75"
                  ry="22"
                  fill="#0284c7"
                  fillOpacity="0.4"
                  stroke={isPipeFreezing ? '#f43f5e' : '#38bdf8'}
                  strokeWidth="2"
                />
                <text x="15" y="192" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  DEEP GLACIAL AQUIFER (z = -120m) · RODWELL STEFAN CAVITY
                </text>
                <text x="15" y="208" fill="#bae6fd" fontSize="9" fontFamily="monospace">
                  CHP Shunt: {chpShuntKw} kW_th → Yield: {meltRateLitersPerSol.toLocaleString()} L/Sol · Flow: {pipeFlowRateLpm} L/min
                </text>
                <text x="480" y="203" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {isPipeFreezing ? 'FREEZE ALERT!' : 'MELT POOL +7.2°C'}
                </text>
              </g>
            </svg>
          </div>

          {/* Direct Plate Jump Links */}
          <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
            {ATLAS_PLATES.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPlate(p.id);
                  onNavigateTab('atlas');
                }}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 text-left transition-colors"
              >
                <div className="text-amber-400 font-bold">{p.number}</div>
                <div className="text-slate-300 truncate font-sans text-[10px]">
                  {p.title.split('&')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* PANEL 2: PLANETARY LAB & MICRO-CLIMATE COUPLER                   */}
        {/* ================================================================ */}
        <div
          className={`p-6 bg-slate-900/60 rounded-2xl border transition-all space-y-4 ${getLensHighlight([
            'GEOGRAPHY',
            'RESILIENCE',
          ])}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase">
                PANEL 02 · PLANETARY PHYSICS &amp; CRYO-HYDROLOGY COUPLER
              </div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sun className="w-4 h-4 text-cyan-400" />
                <span>Live Environmental Boundary Conditions</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('planetary')}
              className="px-2.5 py-1 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded flex items-center gap-1 transition-colors"
            >
              <span>Planetary Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Sliders Coupled to Global State Bus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Dust Optical Depth (τ):</span>
                <span className="text-amber-400 font-bold tabular-nums">{opticalDepthTau.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="6.0"
                step="0.05"
                value={opticalDepthTau}
                onChange={(e) => setOpticalDepthTau(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>Direct: {directFlux.toFixed(0)} W/m²</span>
                <span>Diffuse: {diffuseFlux.toFixed(0)} W/m²</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Rodwell CHP Heat Shunt:</span>
                <span className="text-cyan-400 font-bold tabular-nums">{chpShuntKw} kW_th</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={chpShuntKw}
                onChange={(e) => setChpShuntKw(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>Melt: {meltRateLitersPerSol.toLocaleString()} L/Sol</span>
                <span>Loss: 45 kW_th</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Ambient Habitat CO2:</span>
                <span className={co2PartialPressurePa > 450 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {co2PartialPressurePa} Pa
                </span>
              </div>
              <input
                type="range"
                min="180"
                max="650"
                step="10"
                value={co2PartialPressurePa}
                onChange={(e) => setCo2PartialPressurePa(parseInt(e.target.value))}
                className="w-full accent-emerald-400"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                &gt;450 Pa induces saccadic slowing &amp; cognitive fatigue
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Pipeline Flow Rate:</span>
                <span className={isPipeFreezing ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
                  {pipeFlowRateLpm} L/min
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={pipeFlowRateLpm}
                onChange={(e) => setPipeFlowRateLpm(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                {isPipeFreezing ? 'CBF-PIPE-FREEZE: Pneumatic CO2 purge armed!' : 'Turbulent flow Re > 4,000 nominal'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>CAUSAL COUPLING STATUS:</span>
            <span className="text-emerald-400 font-bold">
              Physics → Kernel Power ({totalPowerSupply} kW) &amp; Twin Stress Synchronized
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PANEL 3: MULTI-AGENT KERNEL & VCG AUCTION (LOCAL ARCADIA NODE)   */}
        {/* ================================================================ */}
        <div
          className={`p-6 bg-slate-900/60 rounded-2xl border transition-all space-y-4 ${getLensHighlight([
            'INFRASTRUCTURE',
            'RESILIENCE',
          ])}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-amber-500 uppercase">
                PANEL 03 · MULTI-AGENT KERNEL (TIER-0 TMR &amp; VCG AUCTION)
              </div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>Autonomous Resource Allocation &amp; Guardrails</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('kernel')}
              className="px-2.5 py-1 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded flex items-center gap-1 transition-colors"
            >
              <span>Kernel Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Epistemic Weights Bar */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">w_TKA (Tech)</div>
              <div className="text-base font-bold text-slate-100">{((wTka / weightSum) * 100).toFixed(0)}%</div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">w_PSS (Env)</div>
              <div className="text-base font-bold text-cyan-400">{((wPss / weightSum) * 100).toFixed(0)}%</div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                isAllostaticPreemption
                  ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="text-[10px] text-purple-300">w_EMA (Psyche)</div>
              <div className="text-base font-bold text-purple-300">{((wEma / weightSum) * 100).toFixed(0)}%</div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">w_CUD (Canon)</div>
              <div className="text-base font-bold text-amber-400">{((wCud / weightSum) * 100).toFixed(0)}%</div>
            </div>
          </div>

          {/* Live Allocation Rows */}
          <div className="space-y-2 font-mono text-xs">
            {[
              {
                agent: 'AGT-TKA',
                task: 'Sabatier ISRU & Basalt Sintering',
                kw: Math.round(contestablePower * (wTka / weightSum)),
                clause: 'REF:[ISRU-Industrial]',
              },
              {
                agent: 'AGT-PSS',
                task: 'Rodwell Cryo-Pump & Dust Shield',
                kw: Math.round(contestablePower * (wPss / weightSum)),
                clause: 'REF:[Cryosphere-Hydrology]',
              },
              {
                agent: 'AGT-EMA',
                task: '6500K Phototherapy & Biophilia Air',
                kw: Math.round(contestablePower * (wEma / weightSum)),
                clause: 'CONST-ETH Art. III',
              },
              {
                agent: 'AGT-CUD',
                task: 'Diegetic Sky-Dome & Archive Sync',
                kw: Math.round(contestablePower * (wCud / weightSum)),
                clause: 'REF:[Visual-Semiotics]',
              },
            ].map((row) => (
              <div
                key={row.agent}
                className="px-3 py-2 bg-slate-950/90 rounded-lg border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <span className="text-amber-400 font-bold mr-2">{row.agent}</span>
                  <span className="text-slate-200 font-sans">{row.task}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                    {row.clause}
                  </span>
                  <span className="text-emerald-400 font-bold tabular-nums w-16 text-right">
                    {row.kw} kW
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between font-mono">
            <span>BLUEPRINT GUARDRAIL [CONST-ETH]:</span>
            <span>350 kW Life-Support Floor Un-Contestable · COMPLIANT</span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PANEL 4: EMOTIONAL DIGITAL TWINS & DIGITAL DIGNITY LEDGER        */}
        {/* ================================================================ */}
        <div
          className={`p-6 bg-slate-900/60 rounded-2xl border transition-all space-y-4 ${getLensHighlight([
            'PSYCHOLOGY',
            'CULTURE',
          ])}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-purple-400 uppercase">
                PANEL 04 · EMOTIONAL DIGITAL TWINS &amp; SANCTUARY LEDGER
              </div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Cohort Affective Weather &amp; Biopsychosocial Feedback</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('emotional')}
              className="px-2.5 py-1 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 rounded flex items-center gap-1 transition-colors"
            >
              <span>Emotional Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Digital Dignity Sanctuary Mode Switcher */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-bold">CITIZEN CONSENT &amp; SANCTUARY:</span>
            </div>
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'ACTIVE_COHORT_SYNC', label: 'K≥16 Cohort Sync' },
                  { id: 'DIFFERENTIAL_ONLY', label: 'ε=0.08 Diff-Privacy' },
                  { id: 'SANCTUARY_BLACKOUT', label: 'Sanctuary Opacity' },
                ] as { id: SanctuaryMode; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSanctuaryMode(m.id)}
                  className={`px-2 py-1 rounded text-[10px] transition-colors ${
                    sanctuaryMode === m.id
                      ? 'bg-purple-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5D Tensor Bars */}
          <div className="space-y-2.5 font-mono text-xs">
            {[
              {
                label: 'ϕ_circ (Circadian Desync)',
                val: humanTensor.circadianDesync,
                key: 'circadianDesync' as keyof HomeostaticTensor,
                action: 'Sky-Dome 6500K Melanopic Boost',
              },
              {
                label: 'σ_allost (Allostatic Load)',
                val: humanTensor.allostaticLoad,
                key: 'allostaticLoad' as keyof HomeostaticTensor,
                action: 'AGT-EMA VCG Preemption (>72%)',
              },
              {
                label: 'κ_cog (Cognitive Fatigue)',
                val: humanTensor.cognitiveFatigue,
                key: 'cognitiveFatigue' as keyof HomeostaticTensor,
                action: 'Swarm Rover EVA Auto-Offload',
              },
              {
                label: 'ρ_prox (Proxemic Crowding)',
                val: humanTensor.proxemicCrowding,
                key: 'proxemicCrowding' as keyof HomeostaticTensor,
                action: 'Botanical Atrium Access Priority',
              },
            ].map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-purple-300 font-bold tabular-nums">
                    {sanctuaryMode === 'SANCTUARY_BLACKOUT'
                      ? 'REDACTED [SANCTUARY]'
                      : `${(item.val * 100).toFixed(0)}% · ${item.action}`}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.val > 0.72 ? 'bg-rose-500' : item.val > 0.5 ? 'bg-amber-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: sanctuaryMode === 'SANCTUARY_BLACKOUT' ? '100%' : `${item.val * 100}%`,
                      opacity: sanctuaryMode === 'SANCTUARY_BLACKOUT' ? 0.2 : 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-200 font-mono flex items-center justify-between">
            <span>ARCHITECTURAL BIO-FEEDBACK:</span>
            <span>
              {isAllostaticPreemption
                ? 'ACTIVE — Throttling non-essential EVA & routing +45 kW to Biophilia'
                : 'STANDBY — Cohort within nominal allostatic envelope'}
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PANEL 5: CINEMATIC CANON & 50-YEAR EXECUTION SPINE PINNING       */}
        {/* ================================================================ */}
        <div
          className={`p-6 bg-slate-900/60 rounded-2xl border transition-all space-y-4 ${getLensHighlight([
            'NARRATIVE',
            'CULTURE',
          ])}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase">
                PANEL 05 · DIEGETIC MEMORY &amp; 50-YEAR EXECUTION SPINE
              </div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Historical Precedent &amp; Cultural Resonance</span>
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('cinematic')}
              className="px-2.5 py-1 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded flex items-center gap-1 transition-colors"
            >
              <span>Cinematic Bible</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 50-Year Execution Spine Interactive Epoch Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>50-YEAR EXECUTION SPINE SCRUBBER:</span>
              <span className="text-amber-400 font-bold">
                Sol {sol.toLocaleString()} / 18,262 (Year {earthYear})
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[
                { label: 'Epoch I (Y1-10)', targetSol: 1240 },
                { label: 'Epoch II (Y11-20)', targetSol: 4200 },
                { label: 'Epoch III (Y21-30)', targetSol: 8100 },
                { label: 'Epoch IV (Y31-40)', targetSol: 13200 },
                { label: 'Epoch V (Y41-50)', targetSol: 17600 },
              ].map((ep) => {
                const isCurrent = activeEpochNum === ep.label.split(' (')[0];
                return (
                  <button
                    key={ep.label}
                    onClick={() => setSol(ep.targetSol)}
                    className={`p-2 rounded border text-[10px] font-mono transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ep.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextually Surfaced Canonical Precedent */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">
                ACTIVE PRECEDENT: [{contextualFilm.id}] {contextualFilm.title}
              </span>
              <span className="text-slate-500">{contextualFilm.solsTimeline}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {contextualFilm.logline}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
              <span>Coupling: {contextualFilm.technicalCoupling}</span>
              <span className="text-cyan-400">Motif: {contextualFilm.soundtrackMotif.split(' (')[0]}</span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PANEL 6: RESILIENCE & CASCADE STRESS-TEST SIMULATOR              */}
        {/* ================================================================ */}
        <div
          className={`p-6 bg-slate-900/60 rounded-2xl border transition-all space-y-4 ${getLensHighlight([
            'RESILIENCE',
            'INFRASTRUCTURE',
            'PSYCHOLOGY',
          ])}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-rose-400 uppercase">
                PANEL 06 · MULTI-DOMAIN CASCADE STRESS SIMULATOR
              </div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Cross-Module Fault Injection &amp; Survival Buffers</span>
              </h2>
            </div>
            <button
              onClick={() => triggerCascadeScenario('nominal')}
              className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore Nominal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => triggerCascadeScenario('dust_confinement')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                isDustStorm
                  ? 'bg-amber-950/50 border-amber-500 text-amber-200'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span>GDS τ=4.5 Confinement</span>
                <Wind className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Drops PV 65%, raises CO2 to 460 Pa, spikes Twin crowding &amp; triggers AGT-EMA preemption.
              </p>
            </button>

            <button
              onClick={() => triggerCascadeScenario('aquifer_freeze')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                isPipeFreezing
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span>Rodwell Slurry Freeze</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Shunts CHP to 95 kW, drops flow to 6 L/min, arms CBF-Pipe-Freeze CO2 purge valve.
              </p>
            </button>

            <button
              onClick={() => triggerCascadeScenario('spe_scram')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                isSpeEmergency
                  ? 'bg-rose-950/50 border-rose-500 text-rose-200'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span>SPE + NaK Core Scram</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                85 PFU radiation storm + 1,120K core overheat; forces EVA lock &amp; battery failover.
              </p>
            </button>
          </div>

          {/* Live Cascade Trace Log */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5">
            <div className="text-slate-400 uppercase text-[10px] font-bold">
              LIVE CROSS-MODULE PROPAGATION TRACE:
            </div>
            <div className="text-slate-300">
              1. <span className="text-cyan-400">[Planetary Lab]</span> τ={opticalDepthTau.toFixed(2)} → Surface PV={pvYieldWattsPerM2.toFixed(1)} W/m² | Rodwell={meltRateLitersPerSol.toLocaleString()} L/Sol
            </div>
            <div className="text-slate-300">
              2. <span className="text-amber-400">[Multi-Agent Kernel]</span> Contestable Bus={contestablePower} kW | w_EMA={((wEma / weightSum) * 100).toFixed(0)}%
            </div>
            <div className="text-slate-300">
              3. <span className="text-purple-400">[Emotional Twins]</span> σ_allost={(humanTensor.allostaticLoad * 100).toFixed(0)}% | κ_cog={(humanTensor.cognitiveFatigue * 100).toFixed(0)}% → Spine Slippage: +{projectedMilestoneSlipSols} Sols
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
