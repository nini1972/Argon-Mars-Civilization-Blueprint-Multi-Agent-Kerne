/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ATLAS_PLATES } from '../data/atlasPlatesData';
import { AtlasPlate } from '../types/blueprint';
import { D3MarsMap } from './D3MarsMap';
import {
  Map,
  Layers,
  Compass,
  Globe,
  Maximize2,
  Info,
  CheckCircle,
  ShieldCheck,
  Eye,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Droplets,
  Radio,
  Cpu,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface TooltipData {
  title: string;
  category: string;
  coordinates?: string;
  elevation?: string;
  specs: { label: string; value: string }[];
  status?: string;
  statusType?: 'nominal' | 'warning' | 'active';
  description: string;
}

export const AtlasTab: React.FC = () => {
  const [selectedPlateId, setSelectedPlateId] = useState<string>('plate-1');
  const [plate1Mode, setPlate1Mode] = useState<'d3-interactive' | 'cad-schematic'>('d3-interactive');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer toggles for Plates
  const [showMaglevLine, setShowMaglevLine] = useState<boolean>(true);
  const [showStormTracks, setShowStormTracks] = useState<boolean>(true);
  const [showMagneticAnomalies, setShowMagneticAnomalies] = useState<boolean>(true);
  const [showStressVectors, setShowStressVectors] = useState<boolean>(true);
  const [showRadiationShields, setShowRadiationShields] = useState<boolean>(true);
  const [showAirflowGrid, setShowAirflowGrid] = useState<boolean>(true);
  const [showSafetyHalo, setShowSafetyHalo] = useState<boolean>(true);

  const currentPlate = ATLAS_PLATES.find((p) => p.id === selectedPlateId) || ATLAS_PLATES[0];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="space-y-8">
      {/* Atlas Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-1">
            <span>CARTOGRAPHIC &amp; ARCHITECTURAL FOLIO</span>
            <span>·</span>
            <span>PLATES I – VII</span>
            <span>·</span>
            <span>VECTOR SCHEMATICS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Areographic Atlas &amp; Architectural Folio
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Vectorized technical plates rendering planetary topography, lithostatic stratigraphy, multi-deck lava tube floorplans, paraterraforming dome geometry, cryo-hydraulics, and autonomous surface grids.
          </p>
        </div>

        {/* Plate Selector Dropdown / Badges */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>PLATE SELECTION:</span>
          <select
            value={selectedPlateId}
            onChange={(e) => {
              setSelectedPlateId(e.target.value);
              setTooltip(null);
            }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-sans font-medium"
          >
            {ATLAS_PLATES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.number}: {p.title.split('&')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plate Navigation Segmented Strip */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono">
        {ATLAS_PLATES.map((plate) => {
          const isSelected = plate.id === selectedPlateId;
          return (
            <button
              key={plate.id}
              onClick={() => {
                setSelectedPlateId(plate.id);
                setTooltip(null);
              }}
              className={`px-3 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-2 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="opacity-70">{plate.number}</span>
              <span className="font-sans font-medium">{plate.title.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Plate Viewport Stage */}
      <div className="bg-[#0b0e17] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
        {/* Cartographic Title Block & Metadata Strip */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3 text-xs font-mono text-amber-500">
              <span className="font-bold">{currentPlate.number}</span>
              <span>·</span>
              <span className="text-slate-400">{currentPlate.moduleRef}</span>
              <span>·</span>
              <span className="text-slate-500">{currentPlate.scale}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{currentPlate.title}</h2>
            <p className="text-xs text-slate-400 font-sans">{currentPlate.subtitle}</p>
          </div>

          {/* Layer Visibility Toggles */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {selectedPlateId === 'plate-1' && (
              <>
                <div className="flex p-0.5 bg-slate-900 rounded border border-slate-800 mr-2">
                  <button
                    onClick={() => setPlate1Mode('d3-interactive')}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                      plate1Mode === 'd3-interactive'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>D3 Interactive Projection</span>
                  </button>
                  <button
                    onClick={() => setPlate1Mode('cad-schematic')}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                      plate1Mode === 'cad-schematic'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>CAD Schematic</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowMaglevLine(!showMaglevLine)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    showMaglevLine
                      ? 'bg-amber-950/80 border-amber-500/80 text-amber-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Maglev Transit
                </button>
                <button
                  onClick={() => setShowStormTracks(!showStormTracks)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    showStormTracks
                      ? 'bg-orange-950/80 border-orange-500/80 text-orange-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Storm Tracks
                </button>
                <button
                  onClick={() => setShowMagneticAnomalies(!showMagneticAnomalies)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    showMagneticAnomalies
                      ? 'bg-purple-950/80 border-purple-500/80 text-purple-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Crustal Mag
                </button>
              </>
            )}

            {selectedPlateId === 'plate-2' && (
              <>
                <button
                  onClick={() => setShowStressVectors(!showStressVectors)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    showStressVectors
                      ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Hoek-Brown Stress
                </button>
                <button
                  onClick={() => setShowRadiationShields(!showRadiationShields)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    showRadiationShields
                      ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Secondary Neutrons
                </button>
              </>
            )}

            {selectedPlateId === 'plate-3' && (
              <button
                onClick={() => setShowAirflowGrid(!showAirflowGrid)}
                className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                  showAirflowGrid
                    ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                ECLSS Airflow Vectors
              </button>
            )}

            {selectedPlateId === 'plate-7' && (
              <button
                onClick={() => setShowSafetyHalo(!showSafetyHalo)}
                className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                  showSafetyHalo
                    ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                15m EVA Safety Halo
              </button>
            )}
          </div>
        </div>

        {/* Plate Content: D3 Interactive Projection Map OR Technical CAD SVG Viewport */}
        {selectedPlateId === 'plate-1' && plate1Mode === 'd3-interactive' ? (
          <div className="p-6 bg-[#030508]">
            <D3MarsMap
              showMaglev={showMaglevLine}
              showStorms={showStormTracks}
              showMagnetic={showMagneticAnomalies}
            />
          </div>
        ) : (
          /* SVG Drawing Canvas Container */
          <div className="relative w-full aspect-[16/9] min-h-[460px] max-h-[720px] bg-[#06080e] overflow-hidden cursor-crosshair">
          <svg
            viewBox="0 0 1000 560"
            className="w-full h-full select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Background Engineering Coordinate Grid */}
            <defs>
              <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#131b2e" strokeWidth="0.5" />
              </pattern>
              <pattern id="cadDotGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="#1b253b" />
              </pattern>

              {/* Linear and Radial Gradients */}
              <linearGradient id="marsSkyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#432616" />
                <stop offset="60%" stopColor="#8d4b28" />
                <stop offset="100%" stopColor="#bf6936" />
              </linearGradient>

              <linearGradient id="basaltRockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e2430" />
                <stop offset="50%" stopColor="#141821" />
                <stop offset="100%" stopColor="#0c0e14" />
              </linearGradient>

              <linearGradient id="glacialIceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e3a54" />
                <stop offset="100%" stopColor="#061e2e" />
              </linearGradient>

              <radialGradient id="meltCavityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            <rect width="1000" height="560" fill="#07090e" />
            <rect width="1000" height="560" fill="url(#cadGrid)" />

            {/* RENDER ACTIVE PLATE */}
            {selectedPlateId === 'plate-1' && (
              <RenderPlate1
                showMaglev={showMaglevLine}
                showStorms={showStormTracks}
                showMag={showMagneticAnomalies}
                setTooltip={setTooltip}
              />
            )}

            {selectedPlateId === 'plate-2' && (
              <RenderPlate2
                showStress={showStressVectors}
                showNeutrons={showRadiationShields}
                setTooltip={setTooltip}
              />
            )}

            {selectedPlateId === 'plate-3' && (
              <RenderPlate3
                showAirflow={showAirflowGrid}
                setTooltip={setTooltip}
              />
            )}

            {selectedPlateId === 'plate-4' && (
              <RenderPlate4
                setTooltip={setTooltip}
              />
            )}

            {selectedPlateId === 'plate-5' && (
              <RenderPlate5
                setTooltip={setTooltip}
              />
            )}

            {selectedPlateId === 'plate-6' && (
              <RenderPlate6
                setTooltip={setTooltip}
              />
            )}

            {selectedPlateId === 'plate-7' && (
              <RenderPlate7
                showSafetyHalo={showSafetyHalo}
                setTooltip={setTooltip}
              />
            )}

            {/* Global Frame & Axis Ticks */}
            <rect
              x="1"
              y="1"
              width="998"
              height="558"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Corner Precision Marks */}
            <path d="M 12 1 L 1 1 L 1 12" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <path d="M 988 1 L 999 1 L 999 12" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <path d="M 1 548 L 1 559 L 12 559" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <path d="M 999 548 L 999 559 L 988 559" stroke="#f59e0b" strokeWidth="2" fill="none" />
          </svg>

          {/* Interactive Floating Tooltip HUD */}
          {tooltip && (
            <div
              className="absolute z-30 pointer-events-none p-4 rounded-xl border shadow-2xl backdrop-blur-md bg-slate-950/95 max-w-sm transition-all duration-75 text-xs font-mono"
              style={{
                left: Math.min(mousePos.x + 16, 620),
                top: Math.min(mousePos.y + 16, 320),
                borderColor:
                  tooltip.statusType === 'warning'
                    ? '#f43f5e'
                    : tooltip.statusType === 'nominal'
                    ? '#10b981'
                    : '#f59e0b',
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    {tooltip.category}
                  </div>
                  <div className="text-sm font-bold text-slate-100 font-sans">
                    {tooltip.title}
                  </div>
                </div>
                {tooltip.status && (
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                      tooltip.statusType === 'warning'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                        : tooltip.statusType === 'nominal'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                    }`}
                  >
                    {tooltip.status}
                  </span>
                )}
              </div>

              {tooltip.coordinates && (
                <div className="text-[11px] text-amber-400 mb-1">
                  LOC: {tooltip.coordinates} {tooltip.elevation && `· ELEV: ${tooltip.elevation}`}
                </div>
              )}

              <div className="space-y-1 py-1">
                {tooltip.specs.map((s, idx) => (
                  <div key={idx} className="flex justify-between gap-4 text-[11px]">
                    <span className="text-slate-400">{s.label}:</span>
                    <span className="text-slate-200 font-bold tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[11px] font-sans text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                {tooltip.description}
              </p>
            </div>
          )}
        </div>
        )}

        {/* Technical Axioms & Specification Footer */}
        <div className="bg-slate-950 p-6 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase text-amber-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Plate Cartographic Summary &amp; Epistemology</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentPlate.summary}
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <h3 className="font-bold uppercase text-slate-400">Governing Invariants:</h3>
              <ul className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                {currentPlate.keyAxioms.map((ax, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 font-mono">0{idx + 1}.</span>
                    <span>{ax}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PLATE I: AREOGRAPHIC MASTER MAP COMPONENT
// ============================================================================
const RenderPlate1: React.FC<{
  showMaglev: boolean;
  showStorms: boolean;
  showMag: boolean;
  setTooltip: (d: TooltipData | null) => void;
}> = ({ showMaglev, showStorms, showMag, setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      {/* Topographic Elevation Isohypses & Continental Contours */}
      {/* Southern Highlands (Rugged Brown-Ochre) */}
      <path
        d="M 50 280 C 180 240, 260 320, 420 310 C 580 300, 680 350, 840 330 C 920 320, 970 360, 990 420 L 990 540 L 10 540 L 10 320 Z"
        fill="#261b14"
        stroke="#442e20"
        strokeWidth="1.5"
      />

      {/* Hellas Impact Basin (Deep Blue-Purple lowland) */}
      <ellipse
        cx="720"
        cy="430"
        rx="95"
        ry="65"
        fill="#141926"
        stroke="#334155"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        className="cursor-pointer hover:fill-[#1e293b] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Hellas Planitia Basin',
            category: 'Deep Impact Basin',
            coordinates: '42.7°S, 70.0°E',
            elevation: '-7.15 km (Deepest Point)',
            specs: [
              { label: 'Surface Pressure', value: '1,155 Pa (1.16 kPa)' },
              { label: 'Liquid Water Feasibility', value: 'Triple-Point Margin +8.5K' },
              { label: 'CO2 Frost Accumulation', value: 'Seasonal Winter Glaze' },
            ],
            status: 'Strategic Lowland',
            statusType: 'nominal',
            description: 'Due to deep depression, Hellas experiences Mars’ highest atmospheric pressure, making liquid water thermodynamically stable for longer durations.',
          })
        }
      />
      <text x="720" y="435" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        HELLAS BASIN (-7.15km)
      </text>

      {/* Tharsis Bulge (Elevated volcanic plateau) */}
      <path
        d="M 120 180 Q 240 140 320 220 Q 340 340 220 360 Q 120 320 120 180 Z"
        fill="#3b2316"
        stroke="#6c3c20"
        strokeWidth="1.5"
      />
      <text x="210" y="270" textAnchor="middle" fill="#9a5a36" fontSize="11" fontFamily="monospace" fontWeight="bold">
        THARSIS RISE
      </text>

      {/* Olympus Mons Caldera */}
      <circle
        cx="140"
        cy="210"
        r="28"
        fill="#4d2c18"
        stroke="#f59e0b"
        strokeWidth="1.5"
        className="cursor-pointer hover:stroke-white transition-all"
        onMouseEnter={() =>
          setTooltip({
            title: 'Olympus Mons Caldera & Relay',
            category: 'Shield Volcano / Radio Uplink',
            coordinates: '18.65°N, 226.2°E',
            elevation: '+21.287 km',
            specs: [
              { label: 'Summit Pressure', value: '72 Pa (0.072 kPa)' },
              { label: 'Atmospheric Scale Height', value: 'Above 95% of Dust Haze' },
              { label: 'Installation', value: 'High-Altitude Solar Optical Relay' },
            ],
            status: 'Suborbital Peak',
            statusType: 'nominal',
            description: 'Rising above the dusty boundary layer, Olympus summit houses primary interplanetary laser comms with Earth and orbital constellation telemetry.',
          })
        }
      />
      <circle cx="140" cy="210" r="8" fill="#f59e0b" />
      <text x="140" y="250" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">
        OLYMPUS MONS (+21.3km)
      </text>

      {/* Tharsis Montes Trio */}
      <circle cx="210" cy="180" r="14" fill="#4d2c18" stroke="#a16207" strokeWidth="1" />
      <circle cx="230" cy="230" r="14" fill="#4d2c18" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="250" cy="280" r="14" fill="#4d2c18" stroke="#a16207" strokeWidth="1" />
      <text x="280" y="235" fill="#f59e0b" fontSize="10" fontFamily="monospace">
        PAVONIS MONS (Space Elevator Anchor)
      </text>

      {/* Valles Marineris Canyon Fault Lines */}
      <path
        d="M 280 300 Q 380 320 480 300 T 560 340"
        fill="none"
        stroke="#0f172a"
        strokeWidth="6"
        strokeLinecap="round"
        className="cursor-pointer hover:stroke-cyan-500 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Valles Marineris Fault Chasm',
            category: 'Tectonic Rift System',
            coordinates: '14.0°S, 300.0°E',
            elevation: '-5.0 km Floor',
            specs: [
              { label: 'Rift Length', value: '4,000 km' },
              { label: 'Chasm Depth', value: '7.0 km maximum' },
              { label: 'Industrial Role', value: 'Epoch IV Heavy Metallurgy & Slag Kilns' },
            ],
            status: 'Active Corridor',
            statusType: 'nominal',
            description: 'The great canyon provides natural wind and radiation shielding along its deep floor, housing extensive autonomous regolith refining operations.',
          })
        }
      />
      <text x="430" y="335" fill="#64748b" fontSize="10" fontFamily="monospace">
        VALLES MARINERIS (-5km)
      </text>

      {/* 1. Arcadia Prime (ST-01) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Arcadia Prime (ARC-01)',
            category: 'Core Settlement · Agriculture & Propellant',
            coordinates: '39.2°N, 171.0°E',
            elevation: '-3.2 km MOLA',
            specs: [
              { label: 'Current Population', value: '1,450 Citizens' },
              { label: 'Economic Specialization', value: 'Cryo-Agriculture & Methanation' },
              { label: 'LOX/CH4 Propellant Output', value: '45.0 Metric Tons / Synod' },
              { label: 'Food Biomass Yield', value: '1,820 kg Spirulina / Sol' },
            ],
            status: 'Core Settlement',
            statusType: 'nominal',
            description: 'The historic founding landing site of Sol 001. Enclosed within vast basalt lava tubes, specializing in photobioreactor agriculture, Rodwell glacial ice harvesting, and Sabatier rocket propellant synthesis.',
          })
        }
      >
        <circle cx="160" cy="110" r="16" fill="#0284c7" fillOpacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="160" cy="110" r="5" fill="#38bdf8" />
        <text x="160" y="88" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
          ARCADIA PRIME
        </text>
        <text x="160" y="100" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
          Pop: 1,450 · Cryo-Agri
        </text>
      </g>

      {/* 2. Valles Beta (VAL-02) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Valles Beta (VAL-02)',
            category: 'Heavy Metallurgy & Maglev Fabrication',
            coordinates: '14.0°S, 300.0°E (-60°W)',
            elevation: '-5.0 km MOLA Floor',
            specs: [
              { label: 'Current Population', value: '4,800 Citizens' },
              { label: 'Economic Specialization', value: 'Heavy Metallurgy & Basalt Sintering' },
              { label: 'Structural Basalt Output', value: '120 Metric Tons / Sol' },
              { label: 'Refined Titanium Ingot', value: '28.5 Metric Tons / Sol' },
            ],
            status: 'Heavy Metallurgy',
            statusType: 'active',
            description: 'Constructed within the 7 km deep floor of Coprates Chasma. Specializes in heavy blast smelting, microwave-sintered basalt masonry, structural titanium rolling, and vacuum maglev hardware.',
          })
        }
      >
        <circle cx="380" cy="330" r="16" fill="#c2410c" fillOpacity="0.25" stroke="#ea580c" strokeWidth="1.5" />
        <circle cx="380" cy="330" r="5" fill="#ea580c" />
        <text x="380" y="355" textAnchor="middle" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">
          VALLES BETA
        </text>
        <text x="380" y="367" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
          Pop: 4,800 · Heavy Metallurgy
        </text>
      </g>

      {/* 3. Utopia Gamma (UTO-03) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Utopia Gamma (UTO-03)',
            category: 'Strategic Water Reserve & Genome Vault',
            coordinates: '45.0°N, 110.0°E',
            elevation: '-4.1 km MOLA',
            specs: [
              { label: 'Current Population', value: '9,450 Citizens' },
              { label: 'Economic Specialization', value: 'Deep Cryo-Aquifer & Genomic Bank' },
              { label: 'Potable Water Buffer', value: '120,000 Liters / Sol' },
              { label: 'Curated Genomic Strains', value: '18,400 Cryo-Samples' },
            ],
            status: 'Speciation Reserve',
            statusType: 'nominal',
            description: 'Tapping into Utopia Planitia’s massive subsurface ice sheet larger than New Mexico, Utopia Gamma provides absolute water autarky, third-generation native ecology, and cryogenic seed archives.',
          })
        }
      >
        <circle cx="820" cy="100" r="18" fill="#047857" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="820" cy="100" r="5" fill="#10b981" />
        <text x="820" y="78" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
          UTOPIA GAMMA
        </text>
        <text x="820" y="90" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
          Pop: 9,450 · Water Reserve
        </text>
      </g>

      {/* 4. Jezero (JEZ-04) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Jezero (JEZ-04)',
            category: 'Synod Capitol & Biosphere Commons',
            coordinates: '18.38°N, 77.58°E',
            elevation: '-2.5 km MOLA',
            specs: [
              { label: 'Current Population', value: '6,200 Citizens' },
              { label: 'Economic Specialization', value: 'Governance, Biosphere & Laser Comms' },
              { label: 'Paraterraformed Dome', value: '12 Hectares ETFE-Aerogel' },
              { label: 'Deep Space Optical Link', value: '1.24 Gbps Direct-to-Earth' },
            ],
            status: 'Synod Capitol',
            statusType: 'nominal',
            description: 'Seat of the sovereign Mars Republic and First Constitutional Synod. Features the largest surface paraterraforming dome with aerogel greenhouse warming and interplanetary optical comms.',
          })
        }
      >
        <circle cx="620" cy="190" r="20" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="620" cy="190" r="6" fill="#f59e0b" />
        <text x="620" y="165" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
          JEZERO (Synod Capitol)
        </text>
        <text x="620" y="177" textAnchor="middle" fill="#fde68a" fontSize="9" fontFamily="monospace">
          Pop: 6,200 · Governance &amp; Comms
        </text>
      </g>

      {/* 5. Hellas Foundry (HEL-05) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Hellas Foundry (HEL-05)',
            category: 'Deep Atmospheric Gas & Heavy Casting Foundry',
            coordinates: '42.7°S, 70.0°E',
            elevation: '-7.15 km MOLA (Highest Pressure)',
            specs: [
              { label: 'Current Population', value: '3,850 Citizens' },
              { label: 'Economic Specialization', value: 'Atmospheric Gas Liquefaction & Heavy Casting' },
              { label: 'Ambient Pressure', value: '1,155 Pa (1.16 kPa)' },
              { label: 'Atmospheric Gas Cryo-Harvest', value: '240,000 m³ / Sol' },
            ],
            status: 'Atmospheric Foundry',
            statusType: 'active',
            description: 'Located at Mars’ deepest depression where atmospheric pressure is highest (1,155 Pa). Specializes in fractional gas liquefaction (CO2, N2, Argon), geothermal binary-loop energy, and heavy alloy castings.',
          })
        }
      >
        <circle cx="720" cy="430" r="22" fill="#7e22ce" fillOpacity="0.25" stroke="#a855f7" strokeWidth="2" />
        <circle cx="720" cy="430" r="6" fill="#c084fc" />
        <text x="720" y="465" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontFamily="monospace" fontWeight="bold">
          HELLAS FOUNDRY
        </text>
        <text x="720" y="477" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace">
          Pop: 3,850 · Gas Liquefaction &amp; Casting
        </text>
      </g>

      {/* 2,400 km Maglev Vacuum Rail Corridor */}
      {showMaglev && (
        <g>
          <path
            d="M 160 110 Q 180 180 230 230 T 420 290 Q 520 230 620 190"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />
          <text x="360" y="220" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
            2,400 km TRANS-THARSIS VACUUM MAGLEV (Epoch IV)
          </text>
        </g>
      )}

      {/* Prevailing Global Dust Storm Track Overlay */}
      {showStorms && (
        <g opacity="0.6">
          <path
            d="M 720 430 Q 640 320 500 280 T 160 110"
            fill="none"
            stroke="#ea580c"
            strokeWidth="12"
            strokeOpacity="0.25"
            strokeLinecap="round"
          />
          <path
            d="M 720 430 Q 640 320 500 280 T 160 110"
            fill="none"
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <text x="560" y="370" fill="#ea580c" fontSize="10" fontFamily="monospace">
            STORM CYCLONE CORRIDOR (Hellas to Arcadia)
          </text>
        </g>
      )}

      {/* Crustal Magnetic Remanence Anomalies */}
      {showMag && (
        <g opacity="0.7">
          <ellipse cx="640" cy="460" rx="60" ry="35" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="640" cy="460" rx="40" ry="22" fill="none" stroke="#a855f7" strokeWidth="1" />
          <text x="640" y="470" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace">
            CRUSTAL PALEOMAGNETIC ARC (+42 nT)
          </text>
        </g>
      )}

      {/* Latitude / Longitude Markings */}
      <g fill="#475569" fontSize="9" fontFamily="monospace">
        <text x="20" y="35">60°N</text>
        <line x1="10" y1="30" x2="990" y2="30" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 4" />
        <text x="20" y="275">0° (EQUATOR)</text>
        <line x1="10" y1="270" x2="990" y2="270" stroke="#334155" strokeWidth="0.8" />
        <text x="20" y="515">60°S</text>
        <line x1="10" y1="510" x2="990" y2="510" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 4" />
      </g>
    </g>
  );
};

// ============================================================================
// PLATE II: SUBSURFACE STRATIGRAPHIC CROSS-SECTION COMPONENT
// ============================================================================
const RenderPlate2: React.FC<{
  showStress: boolean;
  showNeutrons: boolean;
  setTooltip: (d: TooltipData | null) => void;
}> = ({ showStress, showNeutrons, setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      {/* 1. Surface Atmosphere Boundary (z = +30m to 0m) */}
      <rect x="0" y="0" width="1000" height="90" fill="url(#marsSkyGradient)" opacity="0.6" />

      {/* Surface ETFE Geodesic Dome Profile */}
      <path
        d="M 380 90 Q 500 20 620 90 Z"
        fill="#38bdf8"
        fillOpacity="0.15"
        stroke="#38bdf8"
        strokeWidth="2"
      />
      <text x="500" y="55" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="monospace">
        PARATERRAFORMING DOME (5cm Aerogel, Tin = 294K)
      </text>

      {/* Surface Rover */}
      <rect x="240" y="74" width="28" height="16" fill="#f59e0b" rx="2" />
      <circle cx="245" cy="90" r="4" fill="#0f172a" />
      <circle cx="263" cy="90" r="4" fill="#0f172a" />

      {/* Ground Surface Line z = 0m */}
      <line x1="0" y1="90" x2="1000" y2="90" stroke="#f59e0b" strokeWidth="2" />
      <text x="20" y="85" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
        SURFACE AREOID DATUM (z = 0.0m) · P_atmo = 610 Pa
      </text>

      {/* 2. Regolith Fines & Sintered Overburden (z = 0m to -4.5m / Y: 90 to 150) */}
      <rect
        x="0"
        y="90"
        width="1000"
        height="60"
        fill="#452718"
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Regolith Overburden & Sintered Berm',
            category: 'Geological Layer 1',
            elevation: 'z = 0.0m to -4.5m',
            specs: [
              { label: 'Bulk Density', value: '1,650 kg/m³' },
              { label: 'Perchlorate Content', value: '0.68 wt% ClO4-' },
              { label: 'Thermal Conductivity', value: '0.042 W/(m·K)' },
              { label: 'Diurnal Damping', value: '90K surface swing damped to <3K' },
            ],
            status: 'Remediated & Sintered',
            statusType: 'nominal',
            description: 'Top layer of loose basaltic dust and microwave-sintered interlocking paving blocks protecting against micrometeoroids and diurnal thermal shock.',
          })
        }
      />
      <text x="50" y="125" fill="#ca8a04" fontSize="11" fontFamily="monospace" fontWeight="bold">
        LAYER 1: BASALT REGOLITH OVERBURDEN (rho = 1,650 kg/m³)
      </text>

      {/* Secondary Neutron Peak Indicator */}
      {showNeutrons && (
        <g>
          <rect x="680" y="95" width="300" height="45" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1" rx="4" />
          <text x="690" y="112" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
            SECONDARY NEUTRON SPALLATION PEAK
          </text>
          <text x="690" y="128" fill="#fda4af" fontSize="9" fontFamily="sans-serif">
            H_E(x) surges to 320 mSv/yr in dry basalt without H2O liner
          </text>
        </g>
      )}

      {/* Graded-Z Composite Liner (35cm Borated Water/Polyethylene) */}
      <rect x="0" y="150" width="1000" height="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
      <text x="50" y="160" fill="#e0f2fe" fontSize="9" fontFamily="monospace">
        GRADED-Z MODERATOR: 35cm H2O Ice/Polyethylene + 1.5 wt% B4C (Thermalizes fast neutrons)
      </text>

      {/* 3. Fractured Flood Basalt (z = -4.5m to -18m / Y: 162 to 270) */}
      <rect
        x="0"
        y="162"
        width="1000"
        height="108"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1"
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Hesperian Flood Basalt Strata',
            category: 'Competent Host Rock',
            elevation: 'z = -4.5m to -18.0m',
            specs: [
              { label: 'Uniaxial Compressive Strength', value: '140 MPa' },
              { label: 'Density', value: '2,850 kg/m³' },
              { label: 'Geological Strength Index (GSI)', value: '68' },
              { label: 'Lithostatic Stress at -15m', value: 'σ_v = 158.7 kPa' },
            ],
            status: 'Stable Overburden',
            statusType: 'nominal',
            description: 'Intact basalt flow providing massive structural shielding. Confers natural radiation protection reducing cosmic ray doses to background levels (<0.5 mSv/yr).',
          })
        }
      />
      <text x="50" y="210" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">
        LAYER 2: FRACTURED FLOOD BASALT CRUST (rho = 2,850 kg/m³, sigma_ci = 140 MPa)
      </text>

      {/* Safe Overburden Marker line at H_burial = 10.04m */}
      {showStress && (
        <g>
          <line x1="0" y1="220" x2="1000" y2="220" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="750" y="215" fill="#06b6d4" fontSize="10" fontFamily="monospace">
            H_burial^min = 10.04m (Hoek-Brown Safe Limit)
          </text>
        </g>
      )}

      {/* 4. Pressurized Lava Tube Habitat Vault (z = -18m to -35m / Y: 270 to 390) */}
      {/* Elliptical Lava Tube cross-section */}
      <ellipse
        cx="500"
        cy="330"
        rx="260"
        ry="65"
        fill="#0b1329"
        stroke="#f59e0b"
        strokeWidth="3"
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Pressurized Lava Tube Habitat Vault',
            category: 'Primary Enclosure',
            elevation: 'z = -18.0m to -35.0m',
            specs: [
              { label: 'Internal Pressure', value: '70.0 kPa (N2/O2 mix)' },
              { label: 'Vault Diameter', value: '38.5 meters' },
              { label: 'Structural Reinforcement', value: 'Shotcrete Ribbed Arches' },
              { label: 'Effective Dose Rate', value: '< 0.42 mSv/yr (Earth Equivalent)' },
            ],
            status: 'Fully Pressurized',
            statusType: 'nominal',
            description: 'Subterranean volcanic tube engineered into living sectors. The 18m basalt roof completely eliminates lethal GCR/SPE radiation spikes.',
          })
        }
      />

      {/* Multi-tier Decks inside the Lava Tube */}
      {/* Upper Deck: Civic & Living */}
      <line x1="260" y1="320" x2="740" y2="320" stroke="#38bdf8" strokeWidth="2" />
      <text x="500" y="312" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
        LEVEL 1: CIVIC &amp; BIOSPHERE COMMONS (P = 70.0 kPa, T = 294.15 K)
      </text>

      {/* Lower Deck: Heavy Infrastructure */}
      <line x1="280" y1="350" x2="720" y2="350" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="500" y="365" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">
        LEVEL 2: TECHNICAL KERNEL &amp; ECLSS (Tier-0 TMR Lockstep Core)
      </text>

      {/* Hoek-Brown Stress Vectors */}
      {showStress && (
        <g stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)">
          <path d="M 500 240 L 500 265" />
          <path d="M 320 270 L 340 285" />
          <path d="M 680 270 L 660 285" />
          <text x="510" y="255" fill="#06b6d4" fontSize="9" fontFamily="monospace">
            sigma_theta &gt; 0 (Compressive Hoop Stress)
          </text>
        </g>
      )}

      {/* 5. Deep Cryosphere & Rodwell Cavity (z = -35m to -150m / Y: 390 to 560) */}
      <rect
        x="0"
        y="390"
        width="1000"
        height="170"
        fill="url(#glacialIceGradient)"
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Subsurface Glacial Cryosphere',
            category: 'Water Resource Reservoir',
            elevation: 'z = -35.0m to -150.0m',
            specs: [
              { label: 'Ice Mass Fraction', value: '88% Purity' },
              { label: 'Ambient Temperature', value: '195.0 K (-78.15°C)' },
              { label: 'Specific Heat Capacity', value: '1,750 J/(kg·K)' },
              { label: 'Estimated Glacial Volume', value: '> 1.2 x 10^8 m³' },
            ],
            status: 'Massive Glacier Sheet',
            statusType: 'nominal',
            description: 'Vast subsurface water ice sheet formed during high-obliquity epochs. Heated by secondary glycol loop to extract potable water.',
          })
        }
      />
      <text x="50" y="420" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
        LAYER 3: DEEP CRYOSPHERE GLACIAL SHEET (T = 195 K, Ice Fraction = 88%)
      </text>

      {/* Rodwell Coaxial Thermal Drill Pipe */}
      <line x1="500" y1="350" x2="500" y2="480" stroke="#f59e0b" strokeWidth="4" />

      {/* Spherical Melt Cavity (Stefan Moving-Boundary) */}
      <circle
        cx="500"
        cy="490"
        r="38"
        fill="url(#meltCavityGlow)"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeDasharray="4 2"
        className="cursor-pointer hover:r-[42px] transition-all"
        onMouseEnter={() =>
          setTooltip({
            title: 'Rodriguez Well (Rodwell) Melt Pool',
            category: 'Stefan Phase-Change Cavity',
            elevation: 'z = -120m Depth',
            specs: [
              { label: 'Cavity Radius Rm', value: '3.8 meters' },
              { label: 'Pool Water Temp', value: '282.15 K (+9.0°C)' },
              { label: 'Thermal Shunt Input', value: '320 kW_th (Nuclear CHP)' },
              { label: 'Extraction Rate', value: '18,500 L/Sol' },
            ],
            status: 'Active Melt Cavity',
            statusType: 'nominal',
            description: 'Spherical melt cavity formed by circulating hot water. Governed by the Stefan energy jump condition balancing heat input against cryosphere conduction.',
          })
        }
      />
      <text x="500" y="495" textAnchor="middle" fill="#e0f2fe" fontSize="9" fontFamily="monospace" fontWeight="bold">
        MELT POOL (Rm = 3.8m, +9°C)
      </text>
    </g>
  );
};

// ============================================================================
// PLATE III: LAVA TUBE PRIMARY HABITAT DECK FLOORPLAN (LEVEL 1)
// ============================================================================
const RenderPlate3: React.FC<{
  showAirflow: boolean;
  setTooltip: (d: TooltipData | null) => void;
}> = ({ showAirflow, setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      {/* Outer Elliptical Lava Tube Bulkhead Contour */}
      <path
        d="M 60 280 C 60 110, 940 110, 940 280 C 940 450, 60 450, 60 280 Z"
        fill="#0b0f19"
        stroke="#334155"
        strokeWidth="4"
      />

      {/* Internal Pressure Boundary Ring (Polyurea Liner) */}
      <path
        d="M 75 280 C 75 125, 925 125, 925 280 C 925 435, 75 435, 75 280 Z"
        fill="#070a12"
        stroke="#38bdf8"
        strokeWidth="1.5"
      />

      {/* Sector A: Primary Airlock & Electrostatic Decon Vestibule (West) */}
      <rect
        x="90"
        y="210"
        width="110"
        height="140"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-slate-800 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Sector A: Primary Decon Airlock',
            category: 'EVA Ingress / Egress',
            specs: [
              { label: 'Floor Area', value: '88 m²' },
              { label: 'Decontamination Stages', value: '3-Chamber Gradient' },
              { label: 'Dust Mitigation', value: '1.2 kV Electrostatic Curtain' },
              { label: 'Chemical Scrub', value: 'Aqueous Perchlorate Washdown' },
            ],
            status: 'Pressure Locked',
            statusType: 'nominal',
            description: 'Triple-stage airlock equipped with electrostatic precipitator grates and enzymatic wash loops to eliminate lethal perchlorate ingress.',
          })
        }
      />
      <text x="145" y="275" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
        SECTOR A
      </text>
      <text x="145" y="290" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
        AIRLOCK &amp; DECON
      </text>

      {/* Sector B: Bioregenerative Biosphere Commons (North) */}
      <rect
        x="220"
        y="140"
        width="260"
        height="120"
        fill="#062e24"
        stroke="#10b981"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-[#083b2e] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Sector B: Bioregenerative Biosphere',
            category: 'Agriculture & Oxygen Regeneration',
            specs: [
              { label: 'Photobioreactors', value: '16x Arthrospira platensis vertical columns' },
              { label: 'PAR Light Flux', value: '450 µmol/(m²·s) LED arrays' },
              { label: 'O2 Generation Rate', value: '14.2 kg/day net' },
              { label: 'Protein Harvest', value: '8.4 kg dry biomass/day' },
            ],
            status: 'Photosynthesis Active',
            statusType: 'nominal',
            description: 'Spirulina photobioreactors and duckweed raceways responsible for 78% of the habitat’s metabolic CO2 scrubbing and edible protein synthesis.',
          })
        }
      />
      <text x="350" y="195" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
        SECTOR B: BIOSPHERE COMMONS
      </text>
      <text x="350" y="212" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace">
        Photobioreactors · Duckweed Canals · Microgreens
      </text>

      {/* Sector C: Synod Agora & Cultural Forum (Center) */}
      <rect
        x="240"
        y="280"
        width="340"
        height="140"
        fill="#1e1b2e"
        stroke="#a855f7"
        strokeWidth="1.5"
        rx="8"
        className="cursor-pointer hover:fill-[#27233d] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Sector C: Synod Agora & Assembly',
            category: 'Civic Commons & Ritual Space',
            specs: [
              { label: 'Floor Area', value: '380 m²' },
              { label: 'Acoustic Rating', value: '42 dBA (Acoustic Rock Baffles)' },
              { label: 'Lighting Ambience', value: '2700K Circadian Warm Coving' },
              { label: 'Governance Role', value: 'Public Assemblies & Cultural Rituals' },
            ],
            status: 'Nominal Commons',
            statusType: 'nominal',
            description: 'Central communal gathering space engineered with acoustic dampening volcanic textures to mitigate sensory isolation and foster social cohesion.',
          })
        }
      />
      <text x="410" y="345" textAnchor="middle" fill="#c084fc" fontSize="12" fontFamily="monospace" fontWeight="bold">
        SECTOR C: SYNOD AGORA &amp; COMMONS
      </text>
      <text x="410" y="362" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontFamily="monospace">
        Amphitheater · 2700K Circadian Cove · Cultural Forum
      </text>

      {/* Sector D: Private Somatic Living Quarters (South) */}
      <rect
        x="500"
        y="140"
        width="260"
        height="120"
        fill="#1f2937"
        stroke="#60a5fa"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-slate-700 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Sector D: Personal Living Pods',
            category: 'Private Somatic Enclaves',
            specs: [
              { label: 'Private Units', value: '24 Acoustic Sleep Capsules' },
              { label: 'Volume per Person', value: '18.5 m³ private allocation' },
              { label: 'Biometric Enclave', value: 'Air-Gapped PSE Hardware' },
              { label: 'Olfactory Dosing', value: 'Rosemary / Pine Terpenes' },
            ],
            status: 'Private Quarantine Shield',
            statusType: 'nominal',
            description: 'Individual sleeping capsules designed to counteract proxemic crowding. Each pod features personal circadian light programming and zero-knowledge somatic telemetry.',
          })
        }
      />
      <text x="630" y="195" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">
        SECTOR D: SOMATIC LIVING PODS
      </text>
      <text x="630" y="212" textAnchor="middle" fill="#bfdbfe" fontSize="9" fontFamily="monospace">
        24x Acoustic Enclaves · ZK Privacy Enclosures
      </text>

      {/* Sector E: Medical Enclave & Quarantine Bay */}
      <rect
        x="600"
        y="280"
        width="160"
        height="140"
        fill="#31121d"
        stroke="#f43f5e"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-[#441928] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Sector E: Medical & Quarantine Bay',
            category: 'Clinical Biocontainment',
            specs: [
              { label: 'Negative Pressure Delta', value: '-25 Pa Differential' },
              { label: 'Sterilization', value: 'UVC + Autoclave Chamber' },
              { label: 'Isolation Pods', value: '4 Intensive Care Units' },
              { label: 'Diagnostic Arrays', value: 'Full Hemodynamic / Radiation Sequencer' },
            ],
            status: 'Negative Pressure Active',
            statusType: 'nominal',
            description: 'Containment infirmary configured to isolate unknown pathogens or treat acute decompression and radiation sickness.',
          })
        }
      />
      <text x="680" y="345" textAnchor="middle" fill="#fb7185" fontSize="10" fontFamily="monospace" fontWeight="bold">
        SECTOR E
      </text>
      <text x="680" y="360" textAnchor="middle" fill="#fecdd3" fontSize="9" fontFamily="monospace">
        QUARANTINE &amp; MED
      </text>

      {/* Sector F: Emergency Pyrotechnic Bulkhead & Safe Haven (East) */}
      <rect
        x="780"
        y="210"
        width="130"
        height="140"
        fill="#291e0a"
        stroke="#f59e0b"
        strokeWidth="2"
        rx="6"
        className="cursor-pointer hover:fill-[#3b2a0e] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Sector F: Emergency Blast Haven',
            category: 'Last-Resort Safe Haven',
            specs: [
              { label: 'Guillotine Door Latch', value: '150 ms Pyrotechnic Closure' },
              { label: 'Autonomous Reserves', value: '14 Sols O2 / H2O / Food' },
              { label: 'Emergency Power', value: 'Pu-238 RTG Dedicated Bus' },
              { label: 'Structural Rating', value: 'Withstands 120 kPa Blast' },
            ],
            status: 'Standby Ready',
            statusType: 'nominal',
            description: 'Blast-shielded emergency haven sealed by pyrotechnic titanium bulkheads in the event of catastrophic decompression in Sectors A–D.',
          })
        }
      />
      <text x="845" y="275" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
        SECTOR F
      </text>
      <text x="845" y="290" textAnchor="middle" fill="#fef08a" fontSize="9" fontFamily="monospace">
        EMERGENCY HAVEN
      </text>

      {/* Airflow Velocity Vectors */}
      {showAirflow && (
        <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
          <path d="M 120 180 Q 300 120 500 130 T 800 180" fill="none" />
          <path d="M 800 380 Q 500 440 200 390" fill="none" />
          <text x="500" y="445" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">
            DISPLACEMENT VENTILATION (0.18 m/s laminar flow)
          </text>
        </g>
      )}
    </g>
  );
};

// ============================================================================
// PLATE IV: SUBTERRANEAN INFRASTRUCTURE & TECHNICAL KERNEL (LEVEL 2)
// ============================================================================
const RenderPlate4: React.FC<{
  setTooltip: (d: TooltipData | null) => void;
}> = ({ setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      <rect x="50" y="40" width="900" height="480" fill="#0b0f19" stroke="#334155" strokeWidth="2" rx="10" />

      {/* Grid Bays */}
      {/* Bay 1: Physicochemical ECLSS Loop */}
      <rect
        x="80"
        y="70"
        width="260"
        height="200"
        fill="#1e293b"
        stroke="#38bdf8"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-slate-800 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Physicochemical ECLSS Revitalization Loop',
            category: 'Life Support Hardware',
            specs: [
              { label: 'CO2 Adsorption', value: '4-Bed Vacuum-Swing Amine (4BMS)' },
              { label: 'Water Electrolysis', value: 'SPE Proton Exchange Membrane' },
              { label: 'Water Recovery', value: '98.2% Vapor Compression Distillation' },
              { label: 'O2 Generation Rate', value: '2.4 kg/hr max surge capacity' },
            ],
            status: 'Closed Loop Active',
            statusType: 'nominal',
            description: 'Physicochemical backup to biological photobioreactors. Absorbs sudden crew metabolic surges and maintains exact 18.5 kPa O2 / 240 Pa CO2.',
          })
        }
      />
      <text x="210" y="105" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
        BAY 1: ECLSS REVITALIZATION
      </text>
      <text x="210" y="125" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        Amine Beds · SPE Electrolyzer · Distillation
      </text>

      {/* Sabatier Chemical Reactor Graphic inside Bay 1 */}
      <circle cx="210" cy="180" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="210" y="185" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">
        4BMS BEDS
      </text>

      {/* Bay 2: Sabatier & MOXIE Fuel Synthesis Plant */}
      <rect
        x="360"
        y="70"
        width="280"
        height="200"
        fill="#1e293b"
        stroke="#ea580c"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-slate-800 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'ISRU Fuel & Propellant Synthesis Plant',
            category: 'Chemical Metallurgy & Propellant',
            specs: [
              { label: 'Reaction', value: 'CO2 + 4 H2 -> CH4 + 2 H2O (Sabatier)' },
              { label: 'Operating Temp', value: '673.15 K (Ru/Al2O3 catalyst)' },
              { label: 'Electrolysis Stack', value: 'Solid Oxide Electrolysis (MOXIE)' },
              { label: 'Methane Output', value: '420 kg/Sol Liquefied CH4' },
            ],
            status: 'Exothermic Synthesis',
            statusType: 'nominal',
            description: 'Produces liquid methane rocket fuel and water from atmospheric CO2 and glacial hydrogen. Reaction heat is shunted directly into the habitat heating loop.',
          })
        }
      />
      <text x="500" y="105" textAnchor="middle" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">
        BAY 2: ISRU SABATIER &amp; MOXIE
      </text>
      <text x="500" y="125" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        Methanation Reactor · Cryo Liquefier
      </text>

      <rect x="420" y="150" width="160" height="60" fill="#0f172a" stroke="#ea580c" strokeWidth="1" rx="4" />
      <text x="500" y="185" textAnchor="middle" fill="#fed7aa" fontSize="9" fontFamily="monospace">
        Ru/Al2O3 CATALYST BED (400°C)
      </text>

      {/* Bay 3: Primary Power & CHP Thermal Manifold */}
      <rect
        x="660"
        y="70"
        width="260"
        height="200"
        fill="#1e293b"
        stroke="#f59e0b"
        strokeWidth="1.5"
        rx="6"
        className="cursor-pointer hover:fill-slate-800 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Combined Heat & Power (CHP) Substation',
            category: 'Grid Distribution',
            specs: [
              { label: 'Primary Voltage', value: '400V DC / 1,000V DC HVDC' },
              { label: 'Transformer Capacity', value: '1.5 MWe Continuous' },
              { label: 'Thermal Shunt Loop', value: 'Propylene Glycol / Water 380 kW_th' },
              { label: 'Emergency Buffer', value: '570 kWh LiFePO4 + RFC Battery' },
            ],
            status: 'Grid Synced',
            statusType: 'nominal',
            description: 'Routes electrical power from remote fission reactors and solar fields while circulating thermal reject heat into the habitat underfloor warming grid.',
          })
        }
      />
      <text x="790" y="105" textAnchor="middle" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
        BAY 3: 400V/1kV DC POWER GRID
      </text>
      <text x="790" y="125" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        Switchgear · SiC Inverters · CHP Manifold
      </text>

      {/* Bay 4: Tier-0 TMR Lockstep Compute Vault & AI Core */}
      <rect
        x="80"
        y="300"
        width="560"
        height="190"
        fill="#0f172a"
        stroke="#a855f7"
        strokeWidth="2"
        rx="8"
        className="cursor-pointer hover:fill-[#141b36] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Tier-0 TMR Lockstep Compute Core',
            category: 'Autonomous Kernel Hardware',
            specs: [
              { label: 'Processor Topology', value: 'Triple Modular Redundant RV64GC' },
              { label: 'Memory Fabric', value: 'Radiation-Hard MRAM with EDAC' },
              { label: 'Cycle Time', value: '10 ms Areocentric Control Tick (ACT)' },
              { label: 'Optical Air-Gap', value: 'Galvanic Isolation Bus to Tier-1' },
            ],
            status: 'TMR Voting Locked',
            statusType: 'nominal',
            description: 'The deterministic heartbeat of the civilization. Runs the Mars Kernel, Control Barrier Functions, and VCG auction solver without dynamic heap allocations.',
          })
        }
      />
      <text x="360" y="335" textAnchor="middle" fill="#c084fc" fontSize="12" fontFamily="monospace" fontWeight="bold">
        BAY 4: TIER-0 TMR DISTRIBUTED COMPUTE VAULT
      </text>
      <text x="360" y="355" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
        Node A · Node B · Node C (Bitwise Majority Voting against Cosmic Ray SEUs)
      </text>

      {/* 3 Redundant Nodes Visualized */}
      <rect x="120" y="380" width="120" height="70" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" rx="4" />
      <text x="180" y="420" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontFamily="monospace">
        NODE A (TMR-1)
      </text>

      <rect x="300" y="380" width="120" height="70" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" rx="4" />
      <text x="360" y="420" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontFamily="monospace">
        NODE B (TMR-2)
      </text>

      <rect x="480" y="380" width="120" height="70" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" rx="4" />
      <text x="540" y="420" textAnchor="middle" fill="#c7d2fe" fontSize="10" fontFamily="monospace">
        NODE C (TMR-3)
      </text>

      {/* Bay 5: Lizard-Brain Emergency Relays (AL-5 Fallback) */}
      <rect
        x="660"
        y="300"
        width="260"
        height="190"
        fill="#261017"
        stroke="#f43f5e"
        strokeWidth="1.5"
        rx="8"
        className="cursor-pointer hover:fill-[#381622] transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Lizard-Brain Hardware Watchdog (AL-5)',
            category: 'Failsafe Hardware Sequencer',
            specs: [
              { label: 'Architecture', value: 'Zero-Software Solid-State Relays' },
              { label: 'Trigger Threshold', value: 'Multi-Node SEU Collapse or V_bus < 88%' },
              { label: 'Black-Start Engine', value: 'Step 1..6 Autonomous Sequencer' },
              { label: 'Direct Control', value: 'Hardwired Pyrotechnic Bulkhead Valves' },
            ],
            status: 'Watchdog Armed',
            statusType: 'nominal',
            description: 'Analog and discrete gate safety interlock. If software kernel crashes, hardware relays autonomously cycle control drums, shed industrial power, and vent emergency oxygen.',
          })
        }
      />
      <text x="790" y="335" textAnchor="middle" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold">
        BAY 5: LIZARD-BRAIN WATCHDOG
      </text>
      <text x="790" y="355" textAnchor="middle" fill="#fecdd3" fontSize="9" fontFamily="monospace">
        Discrete Relays · Black-Start Sequencer
      </text>

      <circle cx="790" cy="420" r="30" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
      <text x="790" y="425" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold">
        AL-5 LOCK
      </text>
    </g>
  );
};

// ============================================================================
// PLATE V: MESO-SCALE CRATER DOME STRUCTURAL GEOMETRY
// ============================================================================
const RenderPlate5: React.FC<{
  setTooltip: (d: TooltipData | null) => void;
}> = ({ setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      {/* Crater Basin Geometry */}
      <path
        d="M 50 360 C 180 370, 240 440, 500 450 C 760 440, 820 370, 950 360 L 950 540 L 50 540 Z"
        fill="#261b14"
        stroke="#442e20"
        strokeWidth="2"
      />
      <text x="500" y="500" textAnchor="middle" fill="#78350f" fontSize="12" fontFamily="monospace" fontWeight="bold">
        JEZERO CRATER BASALT BEDROCK (-2.5 km MOLA Datum)
      </text>

      {/* Post-Tensioned Rock Anchors on Crater Rim */}
      <g stroke="#f59e0b" strokeWidth="3">
        <line x1="160" y1="365" x2="130" y2="430" />
        <line x1="190" y1="370" x2="160" y2="435" />
        <line x1="840" y1="365" x2="870" y2="430" />
        <line x1="810" y1="370" x2="840" y2="435" />
      </g>
      <text x="140" y="450" fill="#f59e0b" fontSize="9" fontFamily="monospace">
        POST-TENSIONED ANCHORS (25m Deep)
      </text>

      {/* Geodesic Dome Profile (12 Hectare clear span) */}
      <path
        d="M 160 365 C 220 120, 780 120, 840 365 Z"
        fill="#0284c7"
        fillOpacity="0.12"
        stroke="#38bdf8"
        strokeWidth="3"
        className="cursor-pointer hover:fill-opacity-20 transition-all"
        onMouseEnter={() =>
          setTooltip({
            title: '12-Hectare Jezero Paraterraforming Dome',
            category: 'Tensile Geodesic Superstructure',
            specs: [
              { label: 'Clear Span Diameter', value: '420 meters' },
              { label: 'Apex Height', value: '88 meters' },
              { label: 'Enclosed Floor Area', value: '12.0 Hectares (120,000 m²)' },
              { label: 'Internal Pressure Delta', value: '69.39 kPa upward thrust' },
            ],
            status: 'Tensile Equilibrium',
            statusType: 'nominal',
            description: 'Enclosed habitable biosphere constructed during Epoch III. Balances internal atmospheric pressure against basalt-fiber tensile ring cables and bedrock foundation anchors.',
          })
        }
      />

      {/* Geodesic Cable Truss Lattice */}
      <g stroke="#0ea5e9" strokeWidth="1" opacity="0.6">
        <path d="M 160 365 L 500 135 L 840 365" />
        <path d="M 280 240 L 500 135 L 720 240" />
        <path d="M 220 300 L 780 300" />
        <path d="M 320 200 L 680 200" />
      </g>

      {/* Multi-Layer Cushion Skin Detail (Magnified Bubble) */}
      <circle cx="500" cy="135" r="42" fill="#0b1329" stroke="#f59e0b" strokeWidth="2" />
      <text x="500" y="125" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
        GLAZING CUSHION
      </text>
      <text x="500" y="140" textAnchor="middle" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
        ETFE Outer (1mm)
      </text>
      <text x="500" y="152" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="monospace">
        5cm Aerogel (0.012 W/mK)
      </text>
      <text x="500" y="164" textAnchor="middle" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
        ETFE Inner (1mm)
      </text>

      {/* Electrostatic Dust-Shield Wave Indicators */}
      <g stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3">
        <path d="M 260 210 Q 500 90 740 210" fill="none" />
      </g>
      <text x="500" y="80" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">
        1.2 kV 3-PHASE TRAVELING ELECTROSTATIC WAVE (Dust Repulsion)
      </text>

      {/* Interior Terraced City Architecture under the Dome */}
      <path d="M 320 365 L 340 330 L 400 330 L 420 365" fill="#1e293b" stroke="#64748b" />
      <path d="M 440 365 L 460 310 L 540 310 L 560 365" fill="#1e293b" stroke="#64748b" />
      <path d="M 580 365 L 600 330 L 660 330 L 680 365" fill="#1e293b" stroke="#64748b" />
      <text x="500" y="350" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
        TERRACED SYNOD CAPITOL COMPLEX (Epoch III)
      </text>
    </g>
  );
};

// ============================================================================
// PLATE VI: RODWELL CRYO-HYDROLOGY & HYDRAULIC DELIVERY NETWORK
// ============================================================================
const RenderPlate6: React.FC<{
  setTooltip: (d: TooltipData | null) => void;
}> = ({ setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      {/* Surface Header & Fission Heat Exchanger */}
      <rect
        x="80"
        y="50"
        width="220"
        height="120"
        fill="#1e293b"
        stroke="#ea580c"
        strokeWidth="2"
        rx="8"
        className="cursor-pointer hover:fill-slate-800 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Nuclear Trench Heat Exchanger Station',
            category: 'Thermal Shunt Primary Loop',
            specs: [
              { label: 'Reactor Primary Coolant', value: 'Liquid Metal NaK-78 at 920 K' },
              { label: 'Secondary Loop Fluid', value: 'Inhibited Propylene Glycol / H2O' },
              { label: 'Thermal Duty Shunted', value: '380 kW_th Continuous' },
              { label: 'Return Temp to Reactor', value: '315 K (+42°C)' },
            ],
            status: 'Thermal Transfer Active',
            statusType: 'nominal',
            description: 'Couples waste reject heat from the crustal nuclear fast reactor to supply thermal drilling enthalpy into the deep glacial sheet.',
          })
        }
      />
      <text x="190" y="90" textAnchor="middle" fill="#fb923c" fontSize="11" fontFamily="monospace" fontWeight="bold">
        HX-101: NUCLEAR CHP INTERFACE
      </text>
      <text x="190" y="110" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        NaK-to-Glycol Secondary Loop (380 kW_th)
      </text>

      {/* Hot Glycol Supply Pipe going Down to Wellhead */}
      <path d="M 300 110 L 480 110 L 480 430" fill="none" stroke="#ea580c" strokeWidth="4" />
      <text x="490" y="260" fill="#ea580c" fontSize="9" fontFamily="monospace">
        HOT WATER INJECTION (+85°C)
      </text>

      {/* Wellhead Drill Rig */}
      <rect x="440" y="120" width="80" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="480" y="155" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
        WELLHEAD #1
      </text>

      {/* Deep Cryosphere Ice Layer */}
      <rect x="360" y="280" width="600" height="260" fill="url(#glacialIceGradient)" opacity="0.8" rx="8" />
      <text x="660" y="310" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
        ARCADIA GLACIAL ICE SHEET (T = 195 K, Depth -120m)
      </text>

      {/* Spherical Melt Cavity */}
      <circle
        cx="480"
        cy="450"
        r="60"
        fill="url(#meltCavityGlow)"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        className="cursor-pointer hover:r-[65px] transition-all"
        onMouseEnter={() =>
          setTooltip({
            title: 'Rodriguez Well Melt Pool (Cavity Rm)',
            category: 'Stefan Subsurface Cavity',
            specs: [
              { label: 'Pool Water Mass', value: '45,000 Liters' },
              { label: 'Submerged Pump Head', value: '140 meters vertical lift' },
              { label: 'Conductive Heat Loss', value: '45 kW_th into 195K permafrost' },
              { label: 'Net Melt Rate', value: '780 kg/hr potable water' },
            ],
            status: 'Pump Extraction Active',
            statusType: 'nominal',
            description: 'Thermally excavated subterranean reservoir. Recirculates warm water to maintain a self-insulating liquid pool inside the deep permafrost.',
          })
        }
      />
      <text x="480" y="455" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
        MELT CAVITY (+9°C)
      </text>

      {/* Cold Water Extraction Lift Pipe */}
      <path d="M 500 450 L 500 110 L 680 110" fill="none" stroke="#38bdf8" strokeWidth="4" />
      <text x="510" y="280" fill="#38bdf8" fontSize="9" fontFamily="monospace">
        PUMPED POTABLE LIFT (18 L/min)
      </text>

      {/* Automated Emergency Purge Valve (CBF-Pipe-Freeze) */}
      <circle
        cx="600"
        cy="110"
        r="14"
        fill="#4c0519"
        stroke="#f43f5e"
        strokeWidth="2"
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'PV-204: Automated Cryo-Purge Valve',
            category: 'CBF Hard Safety Actuator',
            specs: [
              { label: 'Trigger Condition', value: 'T_pipe < 276.15 K (+3°C)' },
              { label: 'Purge Medium', value: 'Dry High-Pressure N2 / CO2' },
              { label: 'Actuation Time', value: '< 12.0 seconds' },
              { label: 'Safety Mandate', value: 'Prevents volumetric ice freeze-burst' },
            ],
            status: 'CBF Armed',
            statusType: 'warning',
            description: 'Pneumatic emergency valve that blows the delivery pipeline dry with compressed gas if water flow slows down, preventing freezing.',
          })
        }
      />
      <text x="600" y="85" textAnchor="middle" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">
        PV-204 (PURGE)
      </text>

      {/* Water Treatment & Storage Manifold */}
      <rect
        x="680"
        y="50"
        width="240"
        height="180"
        fill="#1e293b"
        stroke="#0284c7"
        strokeWidth="2"
        rx="8"
        className="cursor-pointer hover:fill-slate-800 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Water Purification & Mineralization Core',
            category: 'Potable Water Conditioning',
            specs: [
              { label: 'Membrane Filtration', value: '0.01 µm Ultrafiltration' },
              { label: 'UV Sterilization', value: '254 nm Germicidal Chamber' },
              { label: 'Mineral Dosing', value: 'Ca2+, Mg2+, HCO3- (Taste & Health)' },
              { label: 'Storage Reservoir', value: '120,000 Liters Pressurized Reserve' },
            ],
            status: 'Potable 100% Pure',
            statusType: 'nominal',
            description: 'Filters ancient glacial sediments, neutralizes trace dissolved salts, and adds essential minerals before pumping to habitat living quarters.',
          })
        }
      />
      <text x="800" y="90" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
        TREATMENT &amp; RESERVOIR
      </text>
      <text x="800" y="110" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        UF Membranes · UV-C · Mineral Dosing
      </text>
    </g>
  );
};

// ============================================================================
// PLATE VII: MOBILE EV-CITY V2G / R2H FLEET TOPOLOGY & SURFACE LOGISTICS
// ============================================================================
const RenderPlate7: React.FC<{
  showSafetyHalo: boolean;
  setTooltip: (d: TooltipData | null) => void;
}> = ({ showSafetyHalo, setTooltip }) => {
  return (
    <g className="transition-all duration-300">
      {/* Surface Terrain Fines & Excavation Corridors */}
      <rect x="50" y="40" width="900" height="480" fill="#181310" stroke="#332219" strokeWidth="2" rx="10" />

      {/* 15m Discretized Voxel Grid Lines (TETR Protocol) */}
      <g stroke="#261b14" strokeWidth="0.8">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`vl-${i}`} x1={100 + i * 55} y1="60" x2={100 + i * 55} y2="500" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`hl-${i}`} x1="80" y1={80 + i * 55} x2="920" y2={80 + i * 55} />
        ))}
      </g>

      {/* Central Habitat Ingress Airlock & Docking Hub */}
      <rect
        x="420"
        y="210"
        width="160"
        height="140"
        fill="#0b0f19"
        stroke="#f59e0b"
        strokeWidth="2.5"
        rx="8"
        className="cursor-pointer hover:fill-slate-900 transition-colors"
        onMouseEnter={() =>
          setTooltip({
            title: 'Arcadia Beachhead V2G Docking Hub',
            category: 'Mobile Energy Terminal',
            specs: [
              { label: 'Inductive Charge Bays', value: '4x 150 kW Bidirectional Pads' },
              { label: 'Thermal Umbilicals', value: '2x Molten Salt Heat Exchangers' },
              { label: 'Contestable V2G Capacity', value: 'Up to 3.6 MWh Virtual Battery' },
              { label: 'Emergency Support', value: '14 Sols complete habitat power' },
            ],
            status: 'V2G Dispatch Online',
            statusType: 'nominal',
            description: 'The bidirectional interface where mobile heavy haulers inject stored battery power and phase-change latent salt heat into the habitat grid.',
          })
        }
      />
      <text x="500" y="270" textAnchor="middle" fill="#f59e0b" fontSize="12" fontFamily="monospace" fontWeight="bold">
        HABITAT AIRLOCK HUB
      </text>
      <text x="500" y="290" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
        V2G Inductive Charging · Thermal Docks
      </text>

      {/* Human EVA Crew Member (Red Indicator with 15m Safety Halo) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'EVA Crew Team Alpha (Human Inhabitants)',
            category: 'Living Personnel on Surface',
            specs: [
              { label: 'Crew Count', value: '2 Astronauts' },
              { label: 'Suit Pressure', value: '30.0 kPa Pure O2' },
              { label: 'Safety Exclusion Halo', value: '15.0m L-infinity norm radius' },
              { label: 'Autonomous Swarm Rule', value: 'All rovers hard-brake on halo breach' },
            ],
            status: 'EVA Active',
            statusType: 'nominal',
            description: 'Geological survey crew on foot. Protected by a mandatory 15m exclusion boundary enforced in the kernel token-router.',
          })
        }
      >
        {showSafetyHalo && (
          <circle cx="280" cy="180" r="48" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
        )}
        <circle cx="280" cy="180" r="7" fill="#f43f5e" />
        <text x="280" y="160" textAnchor="middle" fill="#fda4af" fontSize="9" fontFamily="monospace" fontWeight="bold">
          HUMAN EVA (15m Halo)
        </text>
      </g>

      {/* Rover Units across the Grid */}
      {/* Rover 1: Microwave Sinterer */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Swarm Unit R-01 (Microwave Sinterer)',
            category: 'Autonomous Construction Rover',
            specs: [
              { label: 'Battery SoC', value: '88% (105.6 kWh LiFePO4)' },
              { label: 'Task Assignment', value: 'Sintering Regolith Road Trench #4' },
              { label: 'Speed in 0.376g', value: '4.2 km/h' },
              { label: 'Safety Halo Status', value: 'Clear (Distance to EVA: 42m)' },
            ],
            status: 'Operational',
            statusType: 'nominal',
            description: 'Autonomous 6-wheeled rover fusing surface regolith into interlocking structural basalt tiles using 2.45 GHz magnetron microwave beams.',
          })
        }
      >
        <rect x="200" y="320" width="28" height="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
        <circle cx="204" cy="342" r="3" fill="#0f172a" />
        <circle cx="224" cy="342" r="3" fill="#0f172a" />
        <text x="214" y="310" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
          R-01 (Sinter)
        </text>
      </g>

      {/* Rover 2: Heavy Cryo Ice Hauler */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Swarm Unit R-08 (Heavy Cryo Hauler)',
            category: 'Mobile Logistics & Thermal Carrier',
            specs: [
              { label: 'Battery SoC', value: '94% (450 kWh RFC Stack)' },
              { label: 'Thermal Cartridge', value: '25 kWh_th Latent Eutectic Salt' },
              { label: 'Payload', value: '4,200 kg Ice Core Slurry' },
              { label: 'Route Goal', value: 'Docking Bay 2' },
            ],
            status: 'Transit to Hub',
            statusType: 'nominal',
            description: 'Equipped with a dual-chemistry battery pack and molten salt heat pod, transferring energy between the glacier well and habitat.',
          })
        }
      >
        <rect x="680" y="240" width="34" height="22" fill="#ea580c" stroke="#fb923c" strokeWidth="1.5" rx="3" />
        <circle cx="686" cy="264" r="3.5" fill="#0f172a" />
        <circle cx="708" cy="264" r="3.5" fill="#0f172a" />
        <text x="697" y="230" textAnchor="middle" fill="#fdba74" fontSize="9" fontFamily="monospace">
          R-08 (Cryo V2G)
        </text>
      </g>

      {/* Rover 3: EVA Safety Escort Rover */}
      <g
        className="cursor-pointer"
        onMouseEnter={() =>
          setTooltip({
            title: 'Swarm Unit R-12 (EVA Safety Escort)',
            category: 'Human Support Rover',
            specs: [
              { label: 'Emergency O2 Pod', value: '3,000 Liters High-Pressure' },
              { label: 'Radiation Shelter', value: 'Lead-Polyethylene Cockpit' },
              { label: 'Proximity', value: 'Shadowing EVA Team at 18m offset' },
            ],
            status: 'Escort Duty',
            statusType: 'nominal',
            description: 'Accompanies surface explorers, providing real-time comms relay, emergency repressurization, and immediate transport back to the airlock.',
          })
        }
      >
        <rect x="360" y="165" width="26" height="18" fill="#10b981" stroke="#34d399" strokeWidth="1.5" rx="3" />
        <circle cx="364" cy="185" r="3" fill="#0f172a" />
        <circle cx="382" cy="185" r="3" fill="#0f172a" />
        <text x="373" y="155" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace">
          R-12 (Escort)
        </text>
      </g>

      {/* Token Reservation Vectors */}
      <path d="M 680 250 L 590 270" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M 230 330 L 410 290" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="500" y="460" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        DETERMINISTIC TOKEN RESERVATIONS (Guaranteed Deadlock &amp; Collision Free)
      </text>
    </g>
  );
};
