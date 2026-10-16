/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sun,
  Droplets,
  Radiation,
  Wind,
  Layers,
  Zap,
  TrendingDown,
  Info,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const PlanetarySimulationLab: React.FC = () => {
  // Delta-Eddington Simulation Controls
  const [opticalDepthTau, setOpticalDepthTau] = useState<number>(0.85);
  const [solarZenithDeg, setSolarZenithDeg] = useState<number>(35);

  // Rodwell Cryo-Hydrology Controls
  const [chpShuntKw, setChpShuntKw] = useState<number>(320);
  const [pipeFlowRateLpm, setPipeFlowRateLpm] = useState<number>(18);

  // Radiation Shielding Controls
  const [shieldingType, setShieldingType] = useState<'dry_basalt' | 'graded_z'>('graded_z');
  const [arealDepthGcm2, setArealDepthGcm2] = useState<number>(180);

  // Delta-Eddington calculations
  const cosZenith = Math.max(0.01, Math.cos((solarZenithDeg * Math.PI) / 180));
  const toaFlux = 589.2; // W/m^2 mean Mars
  const directFlux = toaFlux * cosZenith * Math.exp(-opticalDepthTau / cosZenith);
  const diffuseRatio = 0.58 * (1 - Math.exp(-0.65 * opticalDepthTau));
  const diffuseFlux = (toaFlux * cosZenith - directFlux) * diffuseRatio;
  const totalSurfaceFlux = Math.max(0, directFlux + diffuseFlux);
  const pvEfficiency = 0.28; // Modern multi-junction InGaP/GaAs/Ge
  const pvYieldWattsPerM2 = totalSurfaceFlux * pvEfficiency;

  // Rodwell Stefan Cavity calculations
  // Energy to melt 195K ice to 280K water ~ 500 kJ/kg
  const conductiveLossKw = 45;
  const netMeltKw = Math.max(0, chpShuntKw - conductiveLossKw);
  const meltRateKgPerHour = (netMeltKw * 3600) / 499; // kg/hour
  const meltRateLitersPerSol = Math.round(meltRateKgPerHour * 24.66);

  // Pipe freeze risk
  const isPipeFreezing = pipeFlowRateLpm < 8;

  // Radiation dose calculation
  let effectiveDoseMsvYear = 240;
  if (shieldingType === 'dry_basalt') {
    if (arealDepthGcm2 < 45) {
      // Secondary neutron buildup peak!
      effectiveDoseMsvYear = 240 * (1 + 0.35 * Math.sin((arealDepthGcm2 / 45) * Math.PI));
    } else {
      effectiveDoseMsvYear = 240 * Math.exp(-(arealDepthGcm2 - 45) / 120);
    }
  } else {
    // Graded-Z with water/polyethylene moderator wall
    effectiveDoseMsvYear = 240 * Math.exp(-arealDepthGcm2 / 55);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>MODULE 1</span>
            <span>·</span>
            <span>SECTION [Planetary-Simulation]</span>
            <span>·</span>
            <span>PARATERRAFORMING & CLIMATE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Planetary Simulation &amp; Paraterraforming Lab
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Coupled physical models spanning Delta-Eddington dust radiative transfer, moving-boundary Rodwell cryo-hydrology, and HZETRN Boltzmann secondary neutron shielding paradoxes.
          </p>
        </div>
      </div>

      {/* Lab Grid: Delta Eddington & Rodwell Cryo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab 1: Delta-Eddington Radiative Transfer */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Delta-Eddington Dusty Solar Radiation Model</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400">REF:[Atmo-Dynamics]</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between mb-1.5">
                <span>Column Optical Depth (τ):</span>
                <span className="text-amber-400 font-bold tabular-nums">{opticalDepthTau.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.15"
                max="6.0"
                step="0.05"
                value={opticalDepthTau}
                onChange={(e) => setOpticalDepthTau(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>0.15 (Clear)</span>
                <span>3.5 (Storm)</span>
                <span>6.0 (Global Storm)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between mb-1.5">
                <span>Solar Zenith Angle (θ_z):</span>
                <span className="text-slate-200 font-bold tabular-nums">{solarZenithDeg}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="85"
                step="5"
                value={solarZenithDeg}
                onChange={(e) => setSolarZenithDeg(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>0° (Noon Zenith)</span>
                <span>85° (Horizon Sunset)</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-center">
            <div>
              <div className="text-[10px] uppercase text-slate-500">Direct Beam</div>
              <div className="text-base font-bold text-slate-200 mt-1 tabular-nums">
                {directFlux.toFixed(1)} <span className="text-xs font-normal text-slate-500">W/m²</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500">Mie Diffuse Sky</div>
              <div className="text-base font-bold text-cyan-400 mt-1 tabular-nums">
                {diffuseFlux.toFixed(1)} <span className="text-xs font-normal text-slate-500">W/m²</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500">PV Array Output</div>
              <div className="text-base font-bold text-amber-400 mt-1 tabular-nums">
                {pvYieldWattsPerM2.toFixed(1)} <span className="text-xs font-normal text-slate-500">W/m²</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-800">
            <strong>Mie Forward Scattering Insight:</strong> Even at severe optical depth (τ = 3.5), forward-peaked Mie scattering by 1.5µm palagonite dust retains ~22% of solar flux as diffuse sky illumination, sustaining multi-junction solar blankets even when the sun’s disk is invisible.
          </div>
        </div>

        {/* Lab 2: Rodwell Cryo-Hydrology Stefan Cavity */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Rodwell Glacial Cavity Stefan Moving-Boundary</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400">REF:[Cryosphere-Hydrology]</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between mb-1.5">
                <span>Nuclear CHP Heat Shunt:</span>
                <span className="text-cyan-400 font-bold tabular-nums">{chpShuntKw} kW_th</span>
              </label>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={chpShuntKw}
                onChange={(e) => setChpShuntKw(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>50 kW (Keep-warm)</span>
                <span>800 kW (Max Extraction)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between mb-1.5">
                <span>Pipeline Delivery Flow:</span>
                <span className="text-slate-200 font-bold tabular-nums">{pipeFlowRateLpm} L/min</span>
              </label>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={pipeFlowRateLpm}
                onChange={(e) => setPipeFlowRateLpm(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>4 L/min (Freeze Risk)</span>
                <span>40 L/min (Surge)</span>
              </div>
            </div>
          </div>

          {/* Melt Output Display */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-center">
            <div>
              <div className="text-[10px] uppercase text-slate-500">Net Melt Enthalpy</div>
              <div className="text-base font-bold text-slate-200 mt-1 tabular-nums">
                {netMeltKw} <span className="text-xs font-normal text-slate-500">kW</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500">Water Production</div>
              <div className="text-base font-bold text-cyan-400 mt-1 tabular-nums">
                {meltRateLitersPerSol.toLocaleString()} <span className="text-xs font-normal text-slate-500">L/Sol</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500">Pipe Freeze Guard</div>
              <div className="text-base font-bold mt-1">
                {isPipeFreezing ? (
                  <span className="text-rose-400 text-xs flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Purge Armed
                  </span>
                ) : (
                  <span className="text-emerald-400 text-xs flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> +7.2°C Flow
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-800">
            <strong>Subsurface Permafrost Stefan Rule:</strong> 195K Martian glacial ice requires 0.1386 kWh_th per liter melted. Waste heat from the primary fission trench is piped 450m via jacketed glycol to sustain continuous 24/7 melt pools without battery depletion.
          </div>
        </div>
      </div>

      {/* Lab 3: Radiation Exposure & Secondary Neutron Spallation Paradox */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Radiation className="w-4 h-4 text-rose-500" />
              <span>HZETRN Radiation Transport &amp; The Secondary Neutron Paradox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrating why unmoderated dry basalt amplifies fast spallation neutrons before attenuating them
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">SHIELDING MATERIAL:</span>
            <div className="flex p-0.5 bg-slate-950 rounded border border-slate-800">
              <button
                onClick={() => setShieldingType('dry_basalt')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  shieldingType === 'dry_basalt'
                    ? 'bg-rose-950 text-rose-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dry Basalt Only
              </button>
              <button
                onClick={() => setShieldingType('graded_z')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  shieldingType === 'graded_z'
                    ? 'bg-emerald-950 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Graded-Z + H2O Boron Wall
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between mb-1.5">
                <span>Areal Shielding Depth:</span>
                <span className="text-slate-200 font-bold tabular-nums">{arealDepthGcm2} g/cm²</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={arealDepthGcm2}
                onChange={(e) => setArealDepthGcm2(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>0 g/cm² (Surface)</span>
                <span>250 g/cm² (1.5m)</span>
                <span>500 g/cm² (3.0m)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-slate-400">Equivalent Physical Depth:</div>
              <div className="text-slate-200 font-bold">
                {(arealDepthGcm2 / 165).toFixed(2)} meters of compacted regolith
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-slate-400">Annual GCR Dose:</span>
                <span className="text-lg font-bold text-amber-400 tabular-nums">
                  {effectiveDoseMsvYear.toFixed(1)} mSv/yr
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                ALARA Career Benchmark: &lt; 20 mSv/yr (Earth natural background: 2.4 mSv/yr)
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              The Secondary Neutron Spallation Paradox Explained
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When high-energy Galactic Cosmic Rays (GCR heavy ions like Fe-56) strike dry Martian basalt (silicon, oxygen, iron), nuclear fragmentation shatters target nuclei into showers of high-LET 1–100 MeV fast neutrons.
            </p>
            <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Danger Zone (15 to 45 g/cm²):</span>
              </div>
              <p className="text-slate-400">
                Thin dry basalt shielding (under 25 cm) actually increases biological radiation dose by up to 35% compared to standing unshielded on the open surface, because heavy ion kinetic energy is converted into dense penetrating neutron cascades without any hydrogen atoms to thermalize them!
              </p>
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>The Graded-Z Architectural Solution:</strong> Overburden requires an inner 35cm hydrogen-dense water/polyethylene liner doped with 1.5 wt% Boron-10 to capture thermalized neutrons.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
