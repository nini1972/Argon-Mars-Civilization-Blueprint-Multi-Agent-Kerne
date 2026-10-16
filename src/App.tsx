/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { AtlasTab } from './components/AtlasTab';
import { KernelConsole } from './components/KernelConsole';
import { PlanetarySimulationLab } from './components/PlanetarySimulationLab';
import { EmotionalTwinsLab } from './components/EmotionalTwinsLab';
import { CinematicUniverseExplorer } from './components/CinematicUniverseExplorer';
import { ExportModal } from './components/ExportModal';
import { AutonomyLevel, BlueprintSection } from './types/blueprint';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'atlas' | 'kernel' | 'planetary' | 'emotional' | 'cinematic'>('overview');
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('AL2_NOMINAL_AUTONOMOUS');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Areocentric Clock State
  const [sol, setSol] = useState<number>(142);
  const [millisol, setMillisol] = useState<number>(842.15);
  const [actTick, setActTick] = useState<number>(7420);

  // Environmental and Subsystem State
  const [opticalDepthTau, setOpticalDepthTau] = useState<number>(0.45);
  const [speProtonFlux, setSpeProtonFlux] = useState<number>(0.1);
  const [hullPressurePa, setHullPressurePa] = useState<number>(70000);
  const [o2PartialPressurePa, setO2PartialPressurePa] = useState<number>(18500);
  const [co2PartialPressurePa, setCo2PartialPressurePa] = useState<number>(240);
  const [reactorCoreTempK, setReactorCoreTempK] = useState<number>(1050);

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

  const handleResetNominal = () => {
    setOpticalDepthTau(0.45);
    setSpeProtonFlux(0.1);
    setHullPressurePa(70000);
    setO2PartialPressurePa(18500);
    setCo2PartialPressurePa(240);
    setReactorCoreTempK(1050);
    setAutonomyLevel('AL2_NOMINAL_AUTONOMOUS');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navigation & Telemetry Ribbon */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autonomyLevel={autonomyLevel}
        setAutonomyLevel={setAutonomyLevel}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        sol={sol}
        millisol={millisol}
        actTick={actTick}
        stepTick={stepTick}
        onExportClick={() => setIsExportOpen(true)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <BlueprintExplorer
            onSelectSection={() => {}}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'atlas' && <AtlasTab />}

        {activeTab === 'kernel' && (
          <KernelConsole
            sol={sol}
            millisol={millisol}
            actTick={actTick}
            autonomyLevel={autonomyLevel}
            opticalDepthTau={opticalDepthTau}
            setOpticalDepthTau={setOpticalDepthTau}
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
            onResetNominal={handleResetNominal}
          />
        )}

        {activeTab === 'planetary' && <PlanetarySimulationLab />}

        {activeTab === 'emotional' && <EmotionalTwinsLab />}

        {activeTab === 'cinematic' && <CinematicUniverseExplorer />}
      </main>

      {/* Clean Scientific Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#07090e] py-6 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-sm inline-block" />
            <span>GEMINI 4 ARGON · 50-YEAR MARS CIVILIZATION BLUEPRINT</span>
            <span>·</span>
            <span>SPECIFICATION VER. 4.0</span>
          </div>
          <div>
            1,000,000 TOKEN ARCHITECTURE · ALL CONSTRAINTS SATISFIED (ENV, ETH, COMP, EMO, NAR)
          </div>
        </div>
      </footer>

      {/* Export Blueprint Specification Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
