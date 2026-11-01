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
import { SETTLEMENT_SITES } from './D3MarsMap';
import {
  computePlanetaryPhysics,
  computeKernelVcgAuction,
} from '../utils/physicsEngine';
import {
  ShieldAlert,
  Cpu,
  Flame,
  Droplets,
  Wind,
  Zap,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Database,
  Radio,
  Brain,
  ArrowUpRight,
  FileCode2,
} from 'lucide-react';

interface KernelConsoleProps {
  sol: number;
  millisol: number;
  actTick: number;
  autonomyLevel: AutonomyLevel;
  activeLens?: CivilizationLens;
  activeSettlementId?: SettlementId;
  opticalDepthTau: number;
  setOpticalDepthTau: (tau: number) => void;
  solarZenithDeg?: number;
  speProtonFlux: number;
  setSpeProtonFlux: (spe: number) => void;
  hullPressurePa: number;
  setHullPressurePa: (p: number) => void;
  o2PartialPressurePa: number;
  setO2PartialPressurePa: (p: number) => void;
  co2PartialPressurePa: number;
  setCo2PartialPressurePa: (p: number) => void;
  reactorCoreTempK: number;
  setReactorCoreTempK: (t: number) => void;
  chpShuntKw?: number;
  pipeFlowRateLpm?: number;
  shieldingType?: 'dry_basalt' | 'graded_z';
  arealDepthGcm2?: number;
  sanctuaryMode?: SanctuaryMode;
  humanTensor?: HomeostaticTensor;
  setHumanTensor?: React.Dispatch<React.SetStateAction<HomeostaticTensor>>;
  onNavigateTab?: (tab: DashboardTab) => void;
  onResetNominal: () => void;
}

export const KernelConsole: React.FC<KernelConsoleProps> = ({
  sol,
  millisol,
  actTick,
  autonomyLevel,
  activeLens = 'ALL',
  activeSettlementId = 'arcadia-prime',
  opticalDepthTau,
  setOpticalDepthTau,
  solarZenithDeg = 35,
  speProtonFlux,
  setSpeProtonFlux,
  hullPressurePa,
  setHullPressurePa,
  o2PartialPressurePa,
  setO2PartialPressurePa,
  co2PartialPressurePa,
  setCo2PartialPressurePa,
  reactorCoreTempK,
  setReactorCoreTempK,
  chpShuntKw = 320,
  pipeFlowRateLpm = 18,
  shieldingType = 'graded_z',
  arealDepthGcm2 = 180,
  sanctuaryMode = 'ACTIVE_COHORT_SYNC',
  humanTensor,
  setHumanTensor,
  onNavigateTab,
  onResetNominal,
}) => {
  // TMR Memory Bank Simulation State
  const [bankA, setBankA] = useState<number[]>([0x4d, 0x41, 0x01, 0x04, 0x5a, 0x9f, 0x12, 0x88]);
  const [bankB, setBankB] = useState<number[]>([0x4d, 0x41, 0x01, 0x04, 0x5a, 0x9f, 0x12, 0x88]);
  const [bankC, setBankC] = useState<number[]>([0x4d, 0x41, 0x01, 0x04, 0x5a, 0x9f, 0x12, 0x88]);
  const [seuCount, setSeuCount] = useState<number>(0);
  const [tmrStatusMessage, setTmrStatusMessage] = useState<string>('All three MRAM banks verified in sync');

  // Swarm Robotics Voxel Grid simulation
  const [activeRoverIdx, setActiveRoverIdx] = useState<number>(0);

  const currentSettlement =
    SETTLEMENT_SITES.find((s) => s.id === activeSettlementId) || SETTLEMENT_SITES[0];

  const defaultTensor: HomeostaticTensor = {
    circadianDesync: 0.18,
    allostaticLoad: 0.35,
    cognitiveFatigue: 0.28,
    proxemicCrowding: 0.22,
    vestibularStrain: 0.08,
  };
  const activeTensor = humanTensor || defaultTensor;

  // Shared Planetary Physics Engine -> Kernel Power, Cryo & Shielding (DEF-02, DEF-06)
  const physics = computePlanetaryPhysics({
    opticalDepthTau,
    solarZenithDeg,
    reactorCoreTempK,
    chpShuntKw,
    pipeFlowRateLpm,
    shieldingType,
    arealDepthGcm2,
    speProtonFlux,
    settlementPopulation: currentSettlement.population,
  });

  const {
    pvArrayOutputKw,
    fissionBaseKw,
    totalPowerSupplyKw: totalPowerSupply,
    contestablePowerKw: contestablePower,
    isPipeFreezing,
    effectiveDoseMsvYear,
    isRadiationHazard,
    seuBitFlipRatePerMsol,
  } = physics;

  // Harmonized VCG Multi-Commodity Auction & Sanctuary Air-Gap (DEF-03, DEF-04, DEF-06)
  const vcg = computeKernelVcgAuction({
    opticalDepthTau,
    speProtonFlux,
    chpShuntKw,
    pipeFlowRateLpm,
    effectiveDoseMsvYear,
    contestablePowerKw: contestablePower,
    humanTensor: activeTensor,
    sanctuaryMode,
  });

  const {
    wTka,
    wPss,
    wEma,
    wCud,
    weightSum,
    isSpeEmergency,
    isDustStorm,
    isAllostaticPreemption,
    isCognitiveThrottle,
    isCircadianBoost,
    isSanctuaryRedacted,
    bids,
  } = vcg;

  const allostaticLoad = activeTensor.allostaticLoad;

  // Control Barrier Functions (CBF)
  const isO2Safe = o2PartialPressurePa >= 16000 && o2PartialPressurePa <= 23500;
  const isCo2Safe = co2PartialPressurePa <= 500;
  const isReactorSafe = reactorCoreTempK <= 1100;
  const isHullSafe = hullPressurePa >= 68000;
  const isCryoPipeSafe = !isPipeFreezing;

  // Handle SEU bit-flip injection
  const injectSeu = () => {
    const corrupted = [...bankA];
    corrupted[4] ^= 0x01; // flip 1 bit
    setBankA(corrupted);
    setTmrStatusMessage('SEU Detected in Bank A! Hardware TMR 2-of-3 voting scrubber active.');
    setSeuCount((prev) => prev + 1);

    // Auto scrub after 1.2s
    setTimeout(() => {
      setBankA([...bankB]);
      setTmrStatusMessage('Bank A scrubbed & corrected via Bank B & C majority vote (0 bit error rate).');
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-1">
            <span>MODULE 2</span>
            <span>·</span>
            <span>SECTION [Kernel-Architecture]</span>
            <span>·</span>
            <span>NODE: {currentSettlement.code} ({currentSettlement.name.toUpperCase()})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Deterministic Multi-Agent Mars Kernel
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Operating on 10ms Areocentric Control Ticks (ACT) under radiation-hardened Q32.32 fixed-point determinism. Dynamically coupled to Planetary Lab radiative flux and Emotional Twin allostatic preemption.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('arcadia')}
              className="px-3 py-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 rounded-md transition-colors flex items-center gap-1.5"
            >
              <span>{currentSettlement.name} Twin</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onResetNominal}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Nominal State</span>
          </button>
        </div>
      </div>

      {/* Control Barrier Function (CBF) Hard Safety Telemetry strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* O2 Barrier */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Oxygen PO2 Barrier</span>
            {isO2Safe ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Nominal
              </span>
            ) : (
              <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Breach
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {(o2PartialPressurePa / 1000).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">kPa</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>Bounds: 16.0 – 23.5 kPa</span>
            <span className="text-emerald-400 text-[10px]">[CONST-ETH]</span>
          </div>
        </div>

        {/* CO2 Barrier */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">CO2 Toxicity Barrier</span>
            {isCo2Safe ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Nominal
              </span>
            ) : (
              <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Toxic
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {co2PartialPressurePa.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-slate-400">Pa</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>Ceiling: 500 Pa</span>
            <span className="text-purple-400 text-[10px]">→ Twin κ_cog</span>
          </div>
        </div>

        {/* Hull Pressure */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Habitat Pressure</span>
            {isHullSafe ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Sealed
              </span>
            ) : (
              <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Decompression
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {(hullPressurePa / 1000).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">kPa</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500">
            Setpoint: 70.0 kPa (26.5% O2)
          </div>
        </div>

        {/* Reactor Core */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Fission Core NaK</span>
            {isReactorSafe ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Critical
              </span>
            ) : (
              <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Overheat
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {reactorCoreTempK.toFixed(0)}
            </span>
            <span className="text-xs font-mono text-slate-400">K</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500">
            Safety Trip: 1,100 K (B4C Drum Auto-Scram)
          </div>
        </div>

        {/* Cryo-Pipe & Shielding CBF Barrier (DEF-06) */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Cryo-Pipe &amp; Rad</span>
            {isCryoPipeSafe && !isRadiationHazard ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Nominal
              </span>
            ) : (
              <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {isPipeFreezing ? 'Pipe Purge' : 'Rad Alert'}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {pipeFlowRateLpm}
            </span>
            <span className="text-xs font-mono text-slate-400">
              L/m · {effectiveDoseMsvYear.toFixed(0)} mSv/yr
            </span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>Floor: ≥8 L/m</span>
            <span className="text-cyan-400 text-[10px]">[CBF-PIPE]</span>
          </div>
        </div>
      </div>

      {/* Main Grid: VCG Negotiation & Disaster Injection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Constrained VCG Negotiation Engine */}
        <div
          className={`lg:col-span-2 p-6 bg-slate-900/60 rounded-xl border space-y-6 transition-all ${
            activeLens === 'INFRASTRUCTURE' || activeLens === 'PSYCHOLOGY' || activeLens === 'CULTURE'
              ? 'border-amber-500/70 ring-1 ring-amber-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Constrained VCG Multi-Commodity Auction (Coupled Bus)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fission ({fissionBaseKw} kW) + Planetary Lab PV ({pvArrayOutputKw} kW at τ={opticalDepthTau.toFixed(2)}) · Emotional Twin{' '}
                {isSanctuaryRedacted
                  ? 'REDACTED [SANCTUARY]'
                  : `σ_allost=${(allostaticLoad * 100).toFixed(0)}%${isCircadianBoost ? ' · ϕ_circ>70%' : ''}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">CONTESTABLE POWER:</span>
              <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                {contestablePower} kW
                <span className="text-xs text-slate-500 font-normal ml-1">/ {totalPowerSupply} kW total</span>
              </div>
            </div>
          </div>

          {/* Epistemic Weights Indicators */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">w_TKA (Tech)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">
                {((wTka / weightSum) * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Physical bus owner</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">w_PSS (Planetary)</div>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
                {((wPss / weightSum) * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Hazard envelopes</div>
            </div>
            <div
              className={`p-3 rounded border ${
                isAllostaticPreemption || isCircadianBoost
                  ? 'bg-purple-950/50 border-purple-500 text-purple-200'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="text-xs text-purple-300 font-mono">w_EMA (Emotional)</div>
              <div className="text-lg font-bold font-mono text-purple-300 mt-1">
                {((wEma / weightSum) * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-purple-400 mt-0.5">
                {isSanctuaryRedacted
                  ? 'SANCTUARY OPACITY'
                  : isAllostaticPreemption
                  ? 'PREEMPTION ACTIVE'
                  : isCircadianBoost
                  ? 'CIRCADIAN BOOST'
                  : 'Allostatic defense'}
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">w_CUD (Diegetic)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">
                {((wCud / weightSum) * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Shed during storms</div>
            </div>
          </div>

          {/* Subsystem Bidding Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2.5">Agent Daemon</th>
                  <th className="pb-2.5">Subsystem Allocation Task</th>
                  <th className="pb-2.5">Blueprint Guardrail</th>
                  <th className="pb-2.5 text-right">Min Viable</th>
                  <th className="pb-2.5 text-right">Optimal</th>
                  <th className="pb-2.5 text-right">GMA Grant</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bids.map((b) => {
                  const isFullyFunded = b.allocatedKW >= b.optKW;
                  const isPartiallyFunded = b.allocatedKW >= b.minKW;
                  return (
                    <tr key={b.agent} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-semibold text-slate-200">{b.agent}</td>
                      <td className="py-2.5 text-slate-300 font-sans">{b.task}</td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-400">
                          {b.blueprintClause}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-400">{b.minKW} kW</td>
                      <td className="py-2.5 text-right text-slate-400">{b.optKW} kW</td>
                      <td className="py-2.5 text-right font-bold text-amber-400">{b.allocatedKW} kW</td>
                      <td className="py-2.5 text-right">
                        {isFullyFunded ? (
                          <span className="text-emerald-400">100% Grant</span>
                        ) : isPartiallyFunded ? (
                          <span className="text-amber-400">Degraded</span>
                        ) : (
                          <span className="text-rose-400">Shed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Hard Life-Support Protection Note */}
          <div className="p-3.5 bg-slate-950/80 rounded border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">CONST-ETH Invariant Guaranteed:</strong> 350W
              electrical, 150W thermal, 2.50g H2O, and 0.84g O2 per colonist per mSol is carved out
              into an un-contestable pool prior to any auction execution.
            </div>
          </div>
        </div>

        {/* Right Col: Adversarial Hazard Injection & Recovery */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-5 transition-all ${
            activeLens === 'RESILIENCE'
              ? 'border-rose-500/70 ring-1 ring-rose-500/20'
              : 'border-slate-800'
          }`}
        >
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Adversarial Stress Testing</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inject real physical or psychological anomalies to observe cross-module transitions
            </p>
          </div>

          <div className="space-y-3">
            {/* Dust Storm Trigger */}
            <button
              onClick={() => setOpticalDepthTau(isDustStorm ? 0.45 : 4.2)}
              className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                isDustStorm
                  ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-semibold">Global Dust Storm (GDS)</div>
                <div className="text-[11px] text-slate-400">
                  {isDustStorm
                    ? `Active: τ = ${opticalDepthTau.toFixed(2)} (PV = ${pvArrayOutputKw} kW)`
                    : `Nominal: τ = ${opticalDepthTau.toFixed(2)}`}
                </div>
              </div>
              <Wind className="w-4 h-4 text-amber-400" />
            </button>

            {/* Solar Proton Event */}
            <button
              onClick={() => setSpeProtonFlux(isSpeEmergency ? 0.1 : 85)}
              className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                isSpeEmergency
                  ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-semibold">Solar Proton Event (SPE)</div>
                <div className="text-[11px] text-slate-400">
                  {isSpeEmergency ? 'Active: 85 PFU (EVA aborted)' : 'Nominal: 0.1 PFU'}
                </div>
              </div>
              <Radio className="w-4 h-4 text-rose-400" />
            </button>

            {/* Hull Breach */}
            <button
              onClick={() => setHullPressurePa(hullPressurePa > 60000 ? 54000 : 70000)}
              className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                hullPressurePa < 68000
                  ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-semibold">Depressurization Breach</div>
                <div className="text-[11px] text-slate-400">
                  {hullPressurePa < 68000 ? 'FM-02: Bulkhead pyros armed' : 'Nominal: 70 kPa'}
                </div>
              </div>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </button>

            {/* Reactor Overheat */}
            <button
              onClick={() => setReactorCoreTempK(reactorCoreTempK > 1060 ? 1050 : 1125)}
              className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                reactorCoreTempK > 1100
                  ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-semibold">Core NaK Overheating</div>
                <div className="text-[11px] text-slate-400">
                  {reactorCoreTempK > 1100 ? 'FM-03: Drum scram active' : 'Nominal: 1,050 K'}
                </div>
              </div>
              <Flame className="w-4 h-4 text-rose-400" />
            </button>

            {/* Emotional Twin Allostatic Preemption Trigger */}
            {setHumanTensor && (
              <button
                onClick={() =>
                  setHumanTensor((prev) => ({
                    ...prev,
                    allostaticLoad: isAllostaticPreemption ? 0.35 : 0.82,
                    cognitiveFatigue: isAllostaticPreemption ? 0.28 : 0.74,
                  }))
                }
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  isAllostaticPreemption
                    ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Cohort Allostatic Overload (&gt;72%)</div>
                  <div className="text-[11px] text-slate-400">
                    {isSanctuaryRedacted
                      ? 'Sanctuary Opacity: Biometric override paused'
                      : isAllostaticPreemption
                      ? 'Active: AGT-EMA preempting sintering bus'
                      : `Nominal: σ_allost = ${(allostaticLoad * 100).toFixed(0)}%`}
                  </div>
                </div>
                <Brain className="w-4 h-4 text-purple-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: TMR Memory Scrubber & Swarm Robotics Token Router */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TMR Bit-Scrubber Inspector */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-4 transition-all ${
            activeLens === 'RESILIENCE' || activeLens === 'NARRATIVE'
              ? 'border-amber-500/70 ring-1 ring-amber-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span>TMR MRAM Bit-Scrubber &amp; SEU Defense</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                2-of-3 bitwise majority voting · Shielding SEU Flux: {seuBitFlipRatePerMsol} flips/mSol
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              SCRUBBED: <span className="text-amber-400 font-bold tabular-nums">{seuCount + seuBitFlipRatePerMsol}</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400">Bank A (Primary):</span>
              <span className="text-slate-200">
                {bankA.map((b) => b.toString(16).padStart(2, '0')).join(' ')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400">Bank B (Redundant):</span>
              <span className="text-slate-200">
                {bankB.map((b) => b.toString(16).padStart(2, '0')).join(' ')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400">Bank C (Lockstep):</span>
              <span className="text-slate-200">
                {bankC.map((b) => b.toString(16).padStart(2, '0')).join(' ')}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{tmrStatusMessage}</span>
            </span>
            <button
              onClick={injectSeu}
              className="px-3 py-1.5 text-xs bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 border border-amber-500/50 rounded transition-colors"
            >
              Inject Cosmic Ray SEU
            </button>
          </div>
        </div>

        {/* Swarm Token-Router 0.38g & EVA Exclusion Halo */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-4 transition-all ${
            activeLens === 'GEOGRAPHY' || activeLens === 'INFRASTRUCTURE'
              ? 'border-cyan-500/70 ring-1 ring-cyan-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>Swarm Robotics 0.376g Token-Router</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Collision-free time-expanded reservation grid · 15m human EVA exclusion halo
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              {currentSettlement.activeSwarmRovers} Units Online ({currentSettlement.code})
            </span>
          </div>

          {/* Simple Interactive Voxel Arena Representation coupled to activeSwarmRovers & Cognitive Throttle */}
          <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-950 rounded border border-slate-800 font-mono text-[10px]">
            {Array.from({ length: 32 }).map((_, idx) => {
              const isSelected = idx === activeRoverIdx;
              const isEvaSlot = idx === 12;
              const isOnlineRover = idx < currentSettlement.activeSwarmRovers;
              const isAutoEva = isEvaSlot && isCognitiveThrottle;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveRoverIdx(idx)}
                  className={`aspect-square rounded flex flex-col items-center justify-center transition-all ${
                    isAutoEva
                      ? 'bg-purple-950/90 border border-purple-400 text-purple-200 font-bold'
                      : isEvaSlot
                      ? 'bg-rose-950/80 border border-rose-500 text-rose-300'
                      : isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isOnlineRover
                      ? 'bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                      : 'bg-slate-950 border border-slate-800/50 text-slate-600'
                  }`}
                >
                  <span>{isAutoEva ? 'AUTO' : isEvaSlot ? 'EVA' : `R${idx + 1}`}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>
              Selected Unit: <strong className="text-slate-200">Rover #{activeRoverIdx + 1}</strong>{' '}
              {isCognitiveThrottle
                ? '(Auto-Taking Over Human EVA Tasks due to κ_cog > 65%)'
                : activeRoverIdx < currentSettlement.activeSwarmRovers
                ? `(${currentSettlement.code} Active Microwave Sinterer)`
                : '(Standby Depot Reserve)'}
            </span>
            <span className="text-slate-500">Speed: 4.2 km/h in 0.376g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
