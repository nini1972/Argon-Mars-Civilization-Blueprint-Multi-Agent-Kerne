/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { ArcadiaPrimeIntegratedView } from './components/ArcadiaPrimeIntegratedView';
import { AtlasTab } from './components/AtlasTab';
import { KernelConsole } from './components/KernelConsole';
import { PlanetarySimulationLab } from './components/PlanetarySimulationLab';
import { EmotionalTwinsLab } from './components/EmotionalTwinsLab';
import { CinematicUniverseExplorer } from './components/CinematicUniverseExplorer';
import { ExportModal } from './components/ExportModal';
import {
  AutonomyLevel,
  CivilizationLens,
  CivilizationSnapshot,
  DashboardTab,
  HomeostaticTensor,
  SanctuaryMode,
  SettlementId,
  SyntheticDaemonTelemetry,
} from './types/blueprint';
import { GitCompare, Camera, RotateCcw } from 'lucide-react';

export default function App() {
  // Unified Civilization Navigation & Context State Bus
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [activeLens, setActiveLens] = useState<CivilizationLens>('ALL');
  const [activeSettlementId, setActiveSettlementId] = useState<SettlementId>('arcadia-prime');
  const [selectedPlateId, setSelectedPlateId] = useState<string>('plate-1');
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('AL2_NOMINAL_AUTONOMOUS');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [deltaModeActive, setDeltaModeActive] = useState<boolean>(false);

  // Areocentric Clock State
  const [sol, setSol] = useState<number>(142);
  const [millisol, setMillisol] = useState<number>(842.15);
  const [actTick, setActTick] = useState<number>(7420);

  // Unified Planetary Lab & Environmental State
  const [opticalDepthTau, setOpticalDepthTau] = useState<number>(0.45);
  const [solarZenithDeg, setSolarZenithDeg] = useState<number>(35);
  const [speProtonFlux, setSpeProtonFlux] = useState<number>(0.1);
  const [hullPressurePa, setHullPressurePa] = useState<number>(70000);
  const [o2PartialPressurePa, setO2PartialPressurePa] = useState<number>(18500);
  const [co2PartialPressurePa, setCo2PartialPressurePa] = useState<number>(240);
  const [reactorCoreTempK, setReactorCoreTempK] = useState<number>(1050);
  const [chpShuntKw, setChpShuntKw] = useState<number>(320);
  const [pipeFlowRateLpm, setPipeFlowRateLpm] = useState<number>(18);
  const [shieldingType, setShieldingType] = useState<'dry_basalt' | 'graded_z'>('graded_z');
  const [arealDepthGcm2, setArealDepthGcm2] = useState<number>(180);

  // Unified Emotional Digital Twins & Digital Dignity State
  const [humanTensor, setHumanTensor] = useState<HomeostaticTensor>({
    circadianDesync: 0.18,
    allostaticLoad: 0.35,
    cognitiveFatigue: 0.28,
    proxemicCrowding: 0.22,
    vestibularStrain: 0.08,
  });

  const [syntheticDaemon, setSyntheticDaemon] = useState<SyntheticDaemonTelemetry>({
    daemonName: 'tka_kernel_d (RAD750 TMR)',
    entropyDivergence: 0.04,
    seuBitCorrectionRate: 2,
    vcgDeficitPressure: 0.12,
    syntheticEmpathyIndex: 0.92,
  });

  const [sanctuaryMode, setSanctuaryMode] = useState<SanctuaryMode>('ACTIVE_COHORT_SYNC');

  // Counterfactual Baseline Snapshot for Delta Mode
  const [baselineSnapshot, setBaselineSnapshot] = useState<CivilizationSnapshot>({
    label: 'Nominal Year 01 Baseline (Sol 142)',
    sol: 142,
    opticalDepthTau: 0.45,
    speProtonFlux: 0.1,
    hullPressurePa: 70000,
    o2PartialPressurePa: 18500,
    co2PartialPressurePa: 240,
    reactorCoreTempK: 1050,
    chpShuntKw: 320,
    pipeFlowRateLpm: 18,
    humanTensor: {
      circadianDesync: 0.18,
      allostaticLoad: 0.35,
      cognitiveFatigue: 0.28,
      proxemicCrowding: 0.22,
      vestibularStrain: 0.08,
    },
    contestablePowerKw: 659,
    waterLitersPerSol: 48882,
  });

  // Closed-Loop Causal Coupling: Environment Perturbations -> Emotional Twins & Synthetic Daemon
  useEffect(() => {
    // High dust optical depth (tau >= 3.5) or high CO2 (> 400 Pa) or SPE radiation drives biopsychosocial stress
    const dustFactor = Math.max(0, (opticalDepthTau - 0.85) / 5.15);
    const co2Factor = Math.max(0, (co2PartialPressurePa - 240) / 450);
    const speFactor = speProtonFlux >= 10 ? 0.28 : 0;
    const hullFactor = hullPressurePa < 68000 ? 0.35 : 0;

    if (dustFactor > 0.05 || co2Factor > 0.05 || speFactor > 0 || hullFactor > 0) {
      setHumanTensor((prev) => ({
        circadianDesync: Math.min(1, Math.max(prev.circadianDesync, +(0.18 + dustFactor * 0.55).toFixed(2))),
        allostaticLoad: Math.min(
          1,
          Math.max(prev.allostaticLoad, +(0.35 + dustFactor * 0.38 + speFactor + hullFactor).toFixed(2))
        ),
        cognitiveFatigue: Math.min(
          1,
          Math.max(prev.cognitiveFatigue, +(0.28 + co2Factor * 0.55 + dustFactor * 0.25).toFixed(2))
        ),
        proxemicCrowding: Math.min(
          1,
          Math.max(prev.proxemicCrowding, +(0.22 + dustFactor * 0.52 + speFactor * 1.4).toFixed(2))
        ),
        vestibularStrain: prev.vestibularStrain,
      }));
    }
  }, [opticalDepthTau, co2PartialPressurePa, speProtonFlux, hullPressurePa]);

  // Simulation Clock Tick Engine
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setActTick((prev) => {
        const next = prev + 120;
        if (next >= 8877) {
          setMillisol((m) => {
            const nextM = m + 1;
            if (nextM >= 1000) {
              setSol((s) => s + 1);
              return 0;
            }
            return nextM;
          });
          return next - 8877;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isRunning]);

  const stepTick = () => {
    setMillisol((prev) => {
      const next = prev + 1;
      if (next >= 1000) {
        setSol((s) => s + 1);
        return 0;
      }
      return next;
    });
  };

  // Live Derived Power & Water for Delta Diff Bar
  const cosZenith = Math.max(0.01, Math.cos((solarZenithDeg * Math.PI) / 180));
  const directFlux = 589.2 * cosZenith * Math.exp(-opticalDepthTau / cosZenith);
  const diffuseFlux = (589.2 * cosZenith - directFlux) * (0.58 * (1 - Math.exp(-0.65 * opticalDepthTau)));
  const pvYieldWattsPerM2 = Math.max(0, directFlux + diffuseFlux) * 0.28;
  const totalPowerKw = (reactorCoreTempK > 1100 ? 320 : 580) + Math.round(pvYieldWattsPerM2 * 3.2);
  const currentContestableKw = Math.max(0, totalPowerKw - 350);
  const currentWaterLitersPerSol = Math.round(((Math.max(0, chpShuntKw - 45) * 3600) / 499) * 24.66);

  const captureSnapshot = () => {
    setBaselineSnapshot({
      label: `Captured Sol ${sol} Snapshot`,
      sol,
      opticalDepthTau,
      speProtonFlux,
      hullPressurePa,
      o2PartialPressurePa,
      co2PartialPressurePa,
      reactorCoreTempK,
      chpShuntKw,
      pipeFlowRateLpm,
      humanTensor: { ...humanTensor },
      contestablePowerKw: currentContestableKw,
      waterLitersPerSol: currentWaterLitersPerSol,
    });
  };

  const handleResetNominal = () => {
    setOpticalDepthTau(0.45);
    setSolarZenithDeg(35);
    setSpeProtonFlux(0.1);
    setHullPressurePa(70000);
    setO2PartialPressurePa(18500);
    setCo2PartialPressurePa(240);
    setReactorCoreTempK(1050);
    setChpShuntKw(320);
    setPipeFlowRateLpm(18);
    setShieldingType('graded_z');
    setArealDepthGcm2(180);
    setHumanTensor({
      circadianDesync: 0.18,
      allostaticLoad: 0.35,
      cognitiveFatigue: 0.28,
      proxemicCrowding: 0.22,
      vestibularStrain: 0.08,
    });
    setAutonomyLevel('AL2_NOMINAL_AUTONOMOUS');
  };

  const formatDelta = (curr: number, base: number, unit = '', decimals = 0) => {
    const diff = curr - base;
    if (Math.abs(diff) < 0.005) return `0${unit}`;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(decimals)}${unit}`;
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navigation, Global Context Bus & Civilization Lens Switcher */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeLens={activeLens}
        setActiveLens={setActiveLens}
        activeSettlementId={activeSettlementId}
        setActiveSettlementId={setActiveSettlementId}
        autonomyLevel={autonomyLevel}
        setAutonomyLevel={setAutonomyLevel}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        sol={sol}
        setSol={setSol}
        millisol={millisol}
        actTick={actTick}
        stepTick={stepTick}
        onExportClick={() => setIsExportOpen(true)}
        deltaModeActive={deltaModeActive}
        onToggleDeltaMode={() => setDeltaModeActive(!deltaModeActive)}
      />

      {/* Counterfactual Scenario Diff Engine (Delta Mode Ribbon) */}
      {deltaModeActive && (
        <div className="bg-purple-950/30 border-b border-purple-500/40 px-6 py-3 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-purple-200">
              <GitCompare className="w-4 h-4 text-purple-400" />
              <span className="font-bold">COUNTERFACTUAL DELTA ENGINE:</span>
              <span className="text-slate-400">Comparing Live State vs. [{baselineSnapshot.label}]</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <div>
                <span className="text-slate-400">Dust τ: </span>
                <span className="font-bold text-amber-300">
                  {formatDelta(opticalDepthTau, baselineSnapshot.opticalDepthTau, '', 2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Contestable Power: </span>
                <span
                  className={`font-bold ${
                    currentContestableKw < baselineSnapshot.contestablePowerKw
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {formatDelta(currentContestableKw, baselineSnapshot.contestablePowerKw, ' kW', 0)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Rodwell H2O: </span>
                <span
                  className={`font-bold ${
                    currentWaterLitersPerSol < baselineSnapshot.waterLitersPerSol
                      ? 'text-rose-400'
                      : 'text-cyan-300'
                  }`}
                >
                  {formatDelta(currentWaterLitersPerSol, baselineSnapshot.waterLitersPerSol, ' L/Sol', 0)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Allostatic Load: </span>
                <span
                  className={`font-bold ${
                    humanTensor.allostaticLoad > baselineSnapshot.humanTensor.allostaticLoad
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {formatDelta(
                    humanTensor.allostaticLoad * 100,
                    baselineSnapshot.humanTensor.allostaticLoad * 100,
                    '%',
                    0
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={captureSnapshot}
                className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <Camera className="w-3 h-3" />
                <span>Capture Current as Baseline</span>
              </button>
              <button
                onClick={handleResetNominal}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <BlueprintExplorer
            onSelectSection={() => {}}
            onNavigateTab={setActiveTab}
            activeLens={activeLens}
            sol={sol}
            setSol={setSol}
            activeSettlementId={activeSettlementId}
            setActiveSettlementId={setActiveSettlementId}
          />
        )}

        {activeTab === 'arcadia' && (
          <ArcadiaPrimeIntegratedView
            activeSettlementId={activeSettlementId}
            setActiveSettlementId={setActiveSettlementId}
            activeLens={activeLens}
            sol={sol}
            setSol={setSol}
            millisol={millisol}
            autonomyLevel={autonomyLevel}
            opticalDepthTau={opticalDepthTau}
            setOpticalDepthTau={setOpticalDepthTau}
            solarZenithDeg={solarZenithDeg}
            setSolarZenithDeg={setSolarZenithDeg}
            speProtonFlux={speProtonFlux}
            setSpeProtonFlux={setSpeProtonFlux}
            hullPressurePa={hullPressurePa}
            setHullPressurePa={setHullPressurePa}
            o2PartialPressurePa={o2PartialPressurePa}
            co2PartialPressurePa={co2PartialPressurePa}
            setCo2PartialPressurePa={setCo2PartialPressurePa}
            reactorCoreTempK={reactorCoreTempK}
            setReactorCoreTempK={setReactorCoreTempK}
            chpShuntKw={chpShuntKw}
            setChpShuntKw={setChpShuntKw}
            pipeFlowRateLpm={pipeFlowRateLpm}
            setPipeFlowRateLpm={setPipeFlowRateLpm}
            humanTensor={humanTensor}
            setHumanTensor={setHumanTensor}
            sanctuaryMode={sanctuaryMode}
            setSanctuaryMode={setSanctuaryMode}
            onNavigateTab={setActiveTab}
            onSelectPlate={setSelectedPlateId}
            onResetNominal={handleResetNominal}
          />
        )}

        {activeTab === 'atlas' && (
          <AtlasTab
            selectedPlateId={selectedPlateId}
            setSelectedPlateId={setSelectedPlateId}
            activeLens={activeLens}
            activeSettlementId={activeSettlementId}
            setActiveSettlementId={setActiveSettlementId}
            opticalDepthTau={opticalDepthTau}
            humanTensor={humanTensor}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'kernel' && (
          <KernelConsole
            sol={sol}
            millisol={millisol}
            actTick={actTick}
            autonomyLevel={autonomyLevel}
            activeLens={activeLens}
            activeSettlementId={activeSettlementId}
            opticalDepthTau={opticalDepthTau}
            setOpticalDepthTau={setOpticalDepthTau}
            solarZenithDeg={solarZenithDeg}
            speProtonFlux={speProtonFlux}
            setSpeProtonFlux={setSpeProtonFlux}
            hullPressurePa={hullPressurePa}
            setHullPressurePa={setHullPressurePa}
            o2PartialPressurePa={o2PartialPressurePa}
            setO2PartialPressurePa={setO2PartialPressurePa}
            co2PartialPressurePa={co2PartialPressurePa}
            setCo2PartialPressurePa={setCo2PartialPressurePa}
            reactorCoreTempK={reactorCoreTempK}
            setReactorCoreTempK={setReactorCoreTempK}
            chpShuntKw={chpShuntKw}
            pipeFlowRateLpm={pipeFlowRateLpm}
            humanTensor={humanTensor}
            setHumanTensor={setHumanTensor}
            onNavigateTab={setActiveTab}
            onResetNominal={handleResetNominal}
          />
        )}

        {activeTab === 'planetary' && (
          <PlanetarySimulationLab
            activeLens={activeLens}
            opticalDepthTau={opticalDepthTau}
            setOpticalDepthTau={setOpticalDepthTau}
            solarZenithDeg={solarZenithDeg}
            setSolarZenithDeg={setSolarZenithDeg}
            chpShuntKw={chpShuntKw}
            setChpShuntKw={setChpShuntKw}
            pipeFlowRateLpm={pipeFlowRateLpm}
            setPipeFlowRateLpm={setPipeFlowRateLpm}
            shieldingType={shieldingType}
            setShieldingType={setShieldingType}
            arealDepthGcm2={arealDepthGcm2}
            setArealDepthGcm2={setArealDepthGcm2}
            humanTensor={humanTensor}
            onNavigateTab={setActiveTab}
            onResetNominal={handleResetNominal}
          />
        )}

        {activeTab === 'emotional' && (
          <EmotionalTwinsLab
            activeLens={activeLens}
            activeSettlementId={activeSettlementId}
            opticalDepthTau={opticalDepthTau}
            co2PartialPressurePa={co2PartialPressurePa}
            humanTensor={humanTensor}
            setHumanTensor={setHumanTensor}
            syntheticDaemon={syntheticDaemon}
            setSyntheticDaemon={setSyntheticDaemon}
            sanctuaryMode={sanctuaryMode}
            setSanctuaryMode={setSanctuaryMode}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'cinematic' && (
          <CinematicUniverseExplorer
            activeLens={activeLens}
            sol={sol}
            setSol={setSol}
            setActiveSettlementId={setActiveSettlementId}
            setHumanTensor={setHumanTensor}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Clean Scientific Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#07090e] py-6 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-sm inline-block" />
            <span>GEMINI 4 ARGON · 50-YEAR MARS CIVILIZATION BLUEPRINT</span>
            <span>·</span>
            <span className="text-amber-400 font-bold">ARGON MARS OS VER. 5.0 (CONVERGENCE)</span>
          </div>
          <div>
            UNIFIED STATE BUS · 6 LENSES · ARCADIA COMMAND TWIN · ALL CONSTRAINTS SATISFIED
          </div>
        </div>
      </footer>

      {/* Export Blueprint Specification Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
