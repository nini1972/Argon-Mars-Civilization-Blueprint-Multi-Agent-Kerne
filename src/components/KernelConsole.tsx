/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPECIALIST_AGENTS } from '../data/blueprintData';
import { AgentId, AutonomyLevel, ResourceState } from '../types/blueprint';
import {
  ShieldAlert,
  Cpu,
  Flame,
  Droplets,
  Wind,
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Database,
  Radio,
} from 'lucide-react';

interface KernelConsoleProps {
  sol: number;
  millisol: number;
  actTick: number;
  autonomyLevel: AutonomyLevel;
  opticalDepthTau: number;
  setOpticalDepthTau: (tau: number) => void;
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
  onResetNominal: () => void;
}

export const KernelConsole: React.FC<KernelConsoleProps> = ({
  sol,
  millisol,
  actTick,
  autonomyLevel,
  opticalDepthTau,
  setOpticalDepthTau,
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

  // Compute Epistemic Weights based on active hazards
  const isSpeEmergency = speProtonFlux >= 10;
  const isDustStorm = opticalDepthTau >= 3.5;

  let wTka = 0.35;
  let wPss = 0.20;
  let wEma = 0.35;
  let wCud = 0.10;

  if (isSpeEmergency) {
    wTka = 0.55;
    wPss = 0.30;
    wEma = 0.15;
    wCud = 0.00;
  } else if (isDustStorm) {
    wTka = 0.50;
    wPss = 0.35;
    wEma = 0.15;
    wCud = 0.00;
  }

  // VCG Bidding state
  const totalPowerSupply = isDustStorm ? 420 : 980; // kW
  const ethPowerFloor = 350; // CONST-ETH floor
  const contestablePower = Math.max(0, totalPowerSupply - ethPowerFloor);

  const bids = [
    {
      agent: 'AGT-TKA',
      task: 'Electrolysis & Sabatier Sintering',
      minKW: 180,
      optKW: 400,
      allocatedKW: Math.round(contestablePower * (wTka / (wTka + wPss + wEma + wCud))),
    },
    {
      agent: 'AGT-PSS',
      task: 'Rodwell Cryo-Melt Heat Pump',
      minKW: 60,
      optKW: 160,
      allocatedKW: Math.round(contestablePower * (wPss / (wTka + wPss + wEma + wCud))),
    },
    {
      agent: 'AGT-EMA',
      task: 'Circadian Phototherapy & Biophilia',
      minKW: 40,
      optKW: 120,
      allocatedKW: Math.round(contestablePower * (wEma / (wTka + wPss + wEma + wCud))),
    },
    {
      agent: 'AGT-CUD',
      task: 'Diegetic Atmospheric Projections',
      minKW: 0,
      optKW: 45,
      allocatedKW: Math.round(contestablePower * (wCud / (wTka + wPss + wEma + wCud))),
    },
  ];

  // Control Barrier Functions (CBF)
  const isO2Safe = o2PartialPressurePa >= 16000 && o2PartialPressurePa <= 23500;
  const isCo2Safe = co2PartialPressurePa <= 500;
  const isReactorSafe = reactorCoreTempK <= 1100;
  const isHullSafe = hullPressurePa >= 68000;

  // Handle SEU bit-flip injection
  const injectSeu = () => {
    const corrupted = [...bankA];
    corrupted[4] ^= 0x01; // flip 1 bit
    setBankA(corrupted);
    setTmrStatusMessage('SEU Detected in Bank A! Hardware TMR 2-of-3 voting scrubber active.');
    setSeuCount((prev) => prev + 1);

    // Auto scrub after 1.5s
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
            <span>TIER-0 TMR LOCKSTEP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Deterministic Multi-Agent Mars Kernel
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Operating on 10ms Areocentric Control Ticks (ACT) under radiation-hardened Q32.32 fixed-point determinism. Enforces Constrained VCG auctions and Control Barrier Function (CBF) safety envelopes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="mt-2 text-xs font-mono text-slate-500">
            Bounds: 16.0 – 23.5 kPa (CONST-ETH)
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
          <div className="mt-2 text-xs font-mono text-slate-500">
            Ceiling: 500 Pa (Cognitive preservation)
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
      </div>

      {/* Main Grid: VCG Negotiation & Disaster Injection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Constrained VCG Negotiation Engine */}
        <div className="lg:col-span-2 p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Constrained VCG Multi-Commodity Auction</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic epistemic reweighting based on planetary telemetry · Solves every 1 mSol
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
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{(wTka * 100).toFixed(0)}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Physical bus owner</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">w_PSS (Planetary)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{(wPss * 100).toFixed(0)}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Hazard envelopes</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">w_EMA (Emotional)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{(wEma * 100).toFixed(0)}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Allostatic defense</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">w_CUD (Diegetic)</div>
              <div className="text-lg font-bold font-mono text-slate-100 mt-1">{(wCud * 100).toFixed(0)}%</div>
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
                  <th className="pb-2.5 text-right">Min Viable</th>
                  <th className="pb-2.5 text-right">Optimal Desired</th>
                  <th className="pb-2.5 text-right">GMA Pareto Grant</th>
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
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Adversarial Stress Testing</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inject real physical anomalies to observe kernel state transitions
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
                  {isDustStorm ? 'Active: τ = 4.2 (PV dropped 62%)' : 'Nominal: τ = 0.45'}
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
          </div>
        </div>
      </div>

      {/* Bottom Row: TMR Memory Scrubber & Swarm Robotics Token Router */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TMR Bit-Scrubber Inspector */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span>TMR MRAM Bit-Scrubber & SEU Defense</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                2-of-3 bitwise majority voting against cosmic ray Single-Event Upsets
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              SCRUBBED: <span className="text-amber-400 font-bold tabular-nums">{seuCount}</span>
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
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
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
            <span className="text-xs font-mono text-emerald-400">32 Units Online</span>
          </div>

          {/* Simple Interactive Voxel Arena Representation */}
          <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-950 rounded border border-slate-800 font-mono text-[10px]">
            {Array.from({ length: 32 }).map((_, idx) => {
              const isSelected = idx === activeRoverIdx;
              const isEva = idx === 12; // Human EVA point
              return (
                <button
                  key={idx}
                  onClick={() => setActiveRoverIdx(idx)}
                  className={`aspect-square rounded flex flex-col items-center justify-center transition-all ${
                    isEva
                      ? 'bg-rose-950/80 border border-rose-500 text-rose-300'
                      : isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{isEva ? 'EVA' : `R${idx + 1}`}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Selected Unit: <strong className="text-slate-200">Rover #{activeRoverIdx + 1}</strong> (Microwave Sinterer)</span>
            <span className="text-slate-500">Speed: 4.2 km/h in 0.376g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
