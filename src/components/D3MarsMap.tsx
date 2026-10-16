/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Compass,
  RotateCw,
  Globe,
  MapPin,
  Layers,
  Users,
  Activity,
  Zap,
  Droplets,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Info,
  Radio,
  Sliders,
  X,
  Factory,
  TrendingUp,
  Cpu,
  PackageCheck,
  Layers3,
} from 'lucide-react';

export interface SettlementSite {
  id: string;
  name: string;
  code: string;
  epoch: string;
  foundedSol: number;
  population: number;
  populationBreakdown: {
    earthBorn: number;
    areanNative: number;
    syntheticCoreDaemons: number;
  };
  coordinates: [number, number]; // [Longitude, Latitude] in degrees (-180 to 180, -90 to 90)
  elevationMolaKm: number;
  surfacePressurePa: number;
  status: string;
  statusType: 'nominal' | 'active' | 'warning';
  primaryRole: string;
  economicSpecializations: string[];
  economicOutputs: { label: string; value: string }[];
  primaryExports: string[];
  lifeSupportBufferDays: number;
  activeSwarmRovers: number;
  primarySubsystems: string[];
  description: string;
  color: string;
  accentBg: string;
}

export const SETTLEMENT_SITES: SettlementSite[] = [
  {
    id: 'arcadia-prime',
    name: 'Arcadia Prime',
    code: 'ARC-01',
    epoch: 'Epoch I (Years 01–10)',
    foundedSol: 1,
    population: 1450,
    populationBreakdown: {
      earthBorn: 980,
      areanNative: 470,
      syntheticCoreDaemons: 12,
    },
    coordinates: [171.0, 39.2], // 171.0°E, 39.2°N
    elevationMolaKm: -3.2,
    surfacePressurePa: 740,
    status: 'CORE SETTLEMENT',
    statusType: 'nominal',
    primaryRole: 'Foundational Beachhead, Subsurface Cryo-Agriculture & Methanation Propellant Synthesis',
    economicSpecializations: [
      'Subsurface Cryo-Agriculture & Photobioreactor Spirulina Systems',
      'Rodwell Glacial Phase-Change Ice Harvesting (-120m Stefan Cavity)',
      'Dual-Loop Sabatier Methanation & Rocket Propellant (LOX/CH4) Synthesis',
      'Basalt Lava Tube Pressurized Biological Vaults & Seedling Nursery',
    ],
    economicOutputs: [
      { label: 'LOX/CH4 Return Propellant', value: '45.0 Metric Tons / Synod' },
      { label: 'Spirulina & Micro-Greens Yield', value: '1,820 kg / Sol' },
      { label: 'Glacial Melt Pure H2O', value: '42,000 Liters / Sol' },
    ],
    primaryExports: [
      'Return Rocket Propellant (LOX/CH4)',
      'High-Protein Spirulina Biomass',
      'Glacial Water Reserves',
      'Acclimatized Crop Seedlings',
    ],
    lifeSupportBufferDays: 45,
    activeSwarmRovers: 8,
    primarySubsystems: [
      'Rodwell Glacial Wellhead Alpha (-120m Stefan Cavity)',
      'Arcadia Lava Tube-1 Pressurized Vault (70.0 kPa)',
      'Spirulina Photobioreactor Column Racks (4-Tier)',
      'Dual-Loop Sabatier Methane Synthesis Plant',
    ],
    description: 'The historic founding landing site of Sol 001. Deep beneath 18 meters of volcanic basalt in Arcadia Planitia, Arcadia Prime operates as the northern hemisphere’s primary agricultural breadbasket and rocket propellant refinery.',
    color: '#38bdf8', // Cyan
    accentBg: 'rgba(56, 189, 248, 0.15)',
  },
  {
    id: 'valles-beta',
    name: 'Valles Beta',
    code: 'VAL-02',
    epoch: 'Epoch IV (Years 31–40)',
    foundedSol: 14200,
    population: 4800,
    populationBreakdown: {
      earthBorn: 890,
      areanNative: 3910,
      syntheticCoreDaemons: 34,
    },
    coordinates: [-60.0, -14.0], // 300.0°E, 14.0°S
    elevationMolaKm: -5.0,
    surfacePressurePa: 890,
    status: 'HEAVY METALLURGY',
    statusType: 'active',
    primaryRole: 'Deep Chasm Smelting, Sintered Basalt Fabrication & Maglev Logistics Crossroads',
    economicSpecializations: [
      'Coprates Chasma Heavy Blast Smelting & Slag Refining',
      'Microwave Sintered Basalt Structural Beams & Masonry Blocks',
      'Titanium-Alloy Structural Rolling Mill & Heavy Press Tooling',
      'Trans-Tharsis Vacuum Maglev Rolling Stock Fabrication & Maintenance',
    ],
    economicOutputs: [
      { label: 'Sintered Basalt Structural Trusses', value: '120 Metric Tons / Sol' },
      { label: 'Refined Titanium & Steel Ingots', value: '28.5 Metric Tons / Sol' },
      { label: 'Vacuum Maglev Rail Cars & Bogies', value: '14 Units / Month' },
    ],
    primaryExports: [
      'Structural Basalt Girders',
      'Industrial Titanium Plates',
      'Maglev Bogies & Tracks',
      'Autonomous Excavator Chassis',
    ],
    lifeSupportBufferDays: 38,
    activeSwarmRovers: 26,
    primarySubsystems: [
      'Coprates Chasma Heavy Smelting Kilns & Sinter Swarm Base',
      'Trans-Tharsis Maglev Central Switching Yard',
      'Canyon Thermal Inversion Wind Turbine Towers',
      'Underground Structural Titanium Rolling Mill',
    ],
    description: 'Constructed within the 7 km deep floor of Coprates Chasma in Valles Marineris. Taking advantage of the dense 890 Pa atmosphere and sheer shielding walls, Valles Beta leads all heavy industrial metal processing on Mars.',
    color: '#ea580c', // Orange
    accentBg: 'rgba(234, 88, 12, 0.15)',
  },
  {
    id: 'utopia-gamma',
    name: 'Utopia Gamma',
    code: 'UTO-03',
    epoch: 'Epoch V (Years 41–50)',
    foundedSol: 17500,
    population: 9450,
    populationBreakdown: {
      earthBorn: 120,
      areanNative: 9330,
      syntheticCoreDaemons: 42,
    },
    coordinates: [110.0, 45.0], // 110.0°E, 45.0°N
    elevationMolaKm: -4.1,
    surfacePressurePa: 810,
    status: 'SPECIATION RESERVE',
    statusType: 'nominal',
    primaryRole: 'Strategic Cryo-Aquifer Reserve, Genomic Archive & Deep Backup Compute',
    economicSpecializations: [
      'Strategic Planetary Deep Cryo-Aquifer Extraction & Desalination',
      'Sub-Glacial Cryogenic Seed Bank & Genomic Diversification Archive',
      'Homo Arean Evolutionary Epigenetic & High-Efficiency Metabolic Research',
      'Deep Subsurface Tier-0 Autonomous Backup Compute & Data Vaults',
    ],
    economicOutputs: [
      { label: 'Strategic Potable Water Buffer', value: '120,000 Liters / Sol' },
      { label: 'Cryo-Preserved Genomic Strains', value: '18,400 Cryo-Samples' },
      { label: 'Sub-Basalt Air-Gapped Compute', value: '48.2 ExaFLOPS' },
    ],
    primaryExports: [
      'Ultra-Pure Desalinated Water',
      'Acclimatized Cryogenic Seed Stocks',
      'Epigenetic Therapeutics',
      'Cold Data Storage Services',
    ],
    lifeSupportBufferDays: 120,
    activeSwarmRovers: 32,
    primarySubsystems: [
      'Multi-Cluster Rodwell Aquifer Array (120,000 L/Sol Capacity)',
      'Sub-Glacial Cryogenic Seed & Genome Vaults',
      'Homo Arean Evolutionary Genetic Research Habitat',
      'Autonomous Deep Backup Compute Vault',
    ],
    description: 'The monumental achievement of Epoch V. Tapping into Utopia Planitia’s subsurface pure water ice sheet larger than the State of New Mexico, Utopia Gamma provides absolute water autarky and biological security for the civilization.',
    color: '#10b981', // Emerald
    accentBg: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'jezero',
    name: 'Jezero',
    code: 'JEZ-04',
    epoch: 'Epoch III (Years 21–30)',
    foundedSol: 7800,
    population: 6200,
    populationBreakdown: {
      earthBorn: 1420,
      areanNative: 4780,
      syntheticCoreDaemons: 28,
    },
    coordinates: [77.58, 18.38], // 77.58°E, 18.38°N
    elevationMolaKm: -2.5,
    surfacePressurePa: 690,
    status: 'SYNOD CAPITOL',
    statusType: 'nominal',
    primaryRole: 'Interplanetary Governance, 12-Hectare Biosphere Commons & Optical Laser Comms',
    economicSpecializations: [
      'Interplanetary Diplomacy, Legislative Assembly & Common Law Synod',
      '12-Hectare ETFE-Aerogel Biosphere Commons & Botanical Parks',
      'High-Bandwidth Deep Space Optical Laser Uplink & Constellation Telemetry',
      'Charter of Biological Commons Intellectual Property & Academic Consortium',
    ],
    economicOutputs: [
      { label: 'Deep Space Optical Laser Bandwidth', value: '1.24 Gbps Direct-to-Earth' },
      { label: 'Paraterraformed Biosphere Area', value: '12.0 Hectares (420m clear span)' },
      { label: 'Constitutional Synod Treaties', value: 'Charter v4.2 Ratified' },
    ],
    primaryExports: [
      'Governance & Regulatory Protocols',
      'Interplanetary Telecommunications Uplink',
      'Botanical Flora Strains',
      'Academic Research Curricula',
    ],
    lifeSupportBufferDays: 60,
    activeSwarmRovers: 14,
    primarySubsystems: [
      '12-Hectare ETFE Aerogel Tension Dome (420m clear span)',
      'Grand Assembly Amphitheater & Biological Commons Synod',
      'Terraced Sintered Basalt Civil Quarters',
      'Interplanetary Optical Laser Uplink Array',
    ],
    description: 'The sovereign civic capitol of the Mars Republic. Beneath a 12-hectare pressurized ETFE geodesic dome with solid-state aerogel insulation, Jezero anchors planetary diplomacy, scientific consortiums, and Earth communications.',
    color: '#f59e0b', // Amber
    accentBg: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'hellas-foundry',
    name: 'Hellas Foundry',
    code: 'HEL-05',
    epoch: 'Epoch IV (Years 31–40)',
    foundedSol: 13100,
    population: 3850,
    populationBreakdown: {
      earthBorn: 520,
      areanNative: 3310,
      syntheticCoreDaemons: 20,
    },
    coordinates: [70.0, -42.7], // 70.0°E, 42.7°S
    elevationMolaKm: -7.15,
    surfacePressurePa: 1155,
    status: 'DEEP ATMOSPHERIC FOUNDRY',
    statusType: 'active',
    primaryRole: 'High-Pressure Atmospheric Gas Liquefaction, Geothermal Smelting & Heavy Casting',
    economicSpecializations: [
      'High-Pressure Atmospheric CO2, N2 & Argon Fractional Cryo-Liquefaction (1,155 Pa)',
      'Triple-Point Liquid Water Thermal Processing & Geothermal Heat Extraction',
      'Heavy Industrial Casting Foundry, Slag Ceramics & Extreme-Duty Mining Tooling',
      'Volatile Atmospheric Gas Scavenging & Planetary Fuel Reserve Storage',
    ],
    economicOutputs: [
      { label: 'Atmospheric Gas Liquefaction', value: '240,000 m³ CO2/N2 / Sol' },
      { label: 'Heavy Industrial Castings Output', value: '64.0 Metric Tons / Sol' },
      { label: 'Refined Industrial Argon & N2', value: '12,500 Liters / Sol' },
    ],
    primaryExports: [
      'Liquid Carbon Dioxide & Liquid Nitrogen',
      'Purified Industrial Argon Gas',
      'Heavy Slag Ceramic Liners',
      'Geothermal Deep-Drill Heat Exchangers',
    ],
    lifeSupportBufferDays: 52,
    activeSwarmRovers: 22,
    primarySubsystems: [
      'Atmospheric Gas Fractional Distillation Cryo-Towers (1.16 kPa Intake)',
      'Basin Floor Heavy Slag Ceramic Sintering Foundry',
      'Supercritical CO2 Geothermal Binary-Cycle Turbine Loop',
      'Pressurized Liquid Water Chemical Synthesis Vats',
    ],
    description: 'Located at the deepest depression on the Martian surface (-7.15 km MOLA), Hellas Foundry experiences the planet’s highest atmospheric pressure (1,155 Pa). It specializes in direct cryogenic gas liquefaction, heavy slag ceramics, and geothermal heat harvesting.',
    color: '#a855f7', // Purple
    accentBg: 'rgba(168, 85, 247, 0.15)',
  },
];

interface D3MarsMapProps {
  onSelectSite?: (site: SettlementSite) => void;
  showMaglev?: boolean;
  showStorms?: boolean;
  showMagnetic?: boolean;
}

export const D3MarsMap: React.FC<D3MarsMapProps> = ({
  onSelectSite,
  showMaglev = true,
  showStorms = true,
  showMagnetic = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Map state
  const [projectionType, setProjectionType] = useState<'orthographic' | 'equirectangular'>('orthographic');
  const [rotation, setRotation] = useState<[number, number, number]>([-110, -15, 0]);
  const [scale, setScale] = useState<number>(245);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [activePopupSite, setActivePopupSite] = useState<SettlementSite | null>(SETTLEMENT_SITES[0]);
  const [hoveredSite, setHoveredSite] = useState<SettlementSite | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [cursorCoords, setCursorCoords] = useState<[number, number] | null>(null);

  // Animation frame ref for smooth spin
  const animRef = useRef<number | null>(null);

  // Render SVG Map using D3
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 560;

    // Reset previous contents
    svg.selectAll('*').remove();

    // Defs & Gradients
    const defs = svg.append('defs');

    // Space Deep Background
    const spaceGrad = defs.append('radialGradient')
      .attr('id', 'd3SpaceBg')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '75%');
    spaceGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0b0f19');
    spaceGrad.append('stop').attr('offset', '100%').attr('stop-color', '#030508');

    // Mars Atmospheric Limb Glow (Spherical glow)
    const limbGlow = defs.append('radialGradient')
      .attr('id', 'd3MarsLimb')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    limbGlow.append('stop').attr('offset', '80%').attr('stop-color', '#c2410c').attr('stop-opacity', 0);
    limbGlow.append('stop').attr('offset', '98%').attr('stop-color', '#fb923c').attr('stop-opacity', 0.45);
    limbGlow.append('stop').attr('offset', '100%').attr('stop-color', '#38bdf8').attr('stop-opacity', 0.8);

    // Planet Surface Shading Gradient
    const planetShade = defs.append('radialGradient')
      .attr('id', 'd3PlanetShade')
      .attr('cx', '35%')
      .attr('cy', '35%')
      .attr('r', '70%');
    planetShade.append('stop').attr('offset', '0%').attr('stop-color', '#a13b17');
    planetShade.append('stop').attr('offset', '45%').attr('stop-color', '#6c210b');
    planetShade.append('stop').attr('offset', '85%').attr('stop-color', '#381206');
    planetShade.append('stop').attr('offset', '100%').attr('stop-color', '#140602');

    // Base background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#d3SpaceBg)');

    // Starfield points in background
    const starGroup = svg.append('g').attr('class', 'starfield');
    const randomStars = [
      [90, 60], [280, 40], [450, 70], [760, 45], [920, 110],
      [70, 440], [240, 510], [670, 490], [890, 430], [950, 320],
      [160, 220], [830, 220], [50, 180], [920, 190], [340, 520],
      [520, 30], [600, 530], [130, 370], [860, 520], [400, 540]
    ];
    randomStars.forEach(([sx, sy]) => {
      starGroup.append('circle')
        .attr('cx', sx)
        .attr('cy', sy)
        .attr('r', (sx % 3 === 0) ? 1.4 : 0.9)
        .attr('fill', '#94a3b8')
        .attr('opacity', 0.55);
    });

    // Create D3 Projection
    const projection = projectionType === 'orthographic'
      ? d3.geoOrthographic()
          .scale(scale)
          .translate([width / 2, height / 2])
          .rotate(rotation)
          .clipAngle(90)
      : d3.geoEquirectangular()
          .scale(scale * 0.62)
          .translate([width / 2, height / 2])
          .rotate([rotation[0], 0, 0]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Planet Container Group
    const planetGroup = svg.append('g').attr('class', 'planet-group');

    // Sphere Background & Shading (in Orthographic mode)
    if (projectionType === 'orthographic') {
      // Glow under the globe
      planetGroup.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', scale * 1.04)
        .attr('fill', '#ea580c')
        .attr('opacity', 0.16)
        .attr('filter', 'blur(8px)');

      // Solid Planet Base
      planetGroup.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', scale)
        .attr('fill', 'url(#d3PlanetShade)')
        .attr('stroke', '#431407')
        .attr('stroke-width', 1.5);
    } else {
      // 2D Map Outline
      planetGroup.append('path')
        .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
        .attr('d', pathGenerator)
        .attr('fill', '#26120b')
        .attr('stroke', '#5c220f')
        .attr('stroke-width', 1.5);
    }

    // Graticule (Coordinate Grid Lines)
    const graticule = d3.geoGraticule().step([30, 30]);
    planetGroup.append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#78350f')
      .attr('stroke-width', 0.6)
      .attr('opacity', 0.4);

    // Equator Line (Prominent)
    const equator = d3.geoCircle().center([0, 90]).radius(90)();
    planetGroup.append('path')
      .datum(equator)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', 0.65);

    // Prime Meridian (0° Longitude)
    const meridian = d3.geoCircle().center([90, 0]).radius(90)();
    planetGroup.append('path')
      .datum(meridian)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '2 2')
      .attr('opacity', 0.45);

    // ------------------------------------------------------------------------
    // TOPOGRAPHIC FEATURES & AREOGRAPHIC FORMATIONS
    // ------------------------------------------------------------------------

    // 1. Hellas Basin Depression (70°E, 42.7°S) - Site of Hellas Foundry!
    const hellasFeature = d3.geoCircle().center([70.0, -42.7]).radius(16)();
    planetGroup.append('path')
      .datum(hellasFeature)
      .attr('d', pathGenerator)
      .attr('fill', '#141824')
      .attr('stroke', '#a855f7')
      .attr('stroke-width', 1.4)
      .attr('stroke-dasharray', '4 2')
      .attr('opacity', 0.85);

    // 2. Argyre Basin Depression (316°E, 49.7°S -> -44.0°W, -49.7°S)
    const argyreFeature = d3.geoCircle().center([-44.0, -49.7]).radius(10)();
    planetGroup.append('path')
      .datum(argyreFeature)
      .attr('d', pathGenerator)
      .attr('fill', '#141824')
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.9)
      .attr('opacity', 0.75);

    // 3. Tharsis Volcanic Plateau Rise
    const tharsisPoly = {
      type: 'Polygon',
      coordinates: [[
        [-140, 25], [-100, 20], [-80, -5], [-95, -20],
        [-130, -15], [-150, 5], [-140, 25]
      ]]
    } as d3.GeoPermissibleObjects;
    planetGroup.append('path')
      .datum(tharsisPoly)
      .attr('d', pathGenerator)
      .attr('fill', '#7c2d12')
      .attr('fill-opacity', 0.35)
      .attr('stroke', '#9a3412')
      .attr('stroke-width', 1.2);

    // 4. Olympus Mons Caldera & Base (-133.8°W, 18.65°N)
    const olympusBase = d3.geoCircle().center([-133.8, 18.65]).radius(7)();
    const olympusPeak = d3.geoCircle().center([-133.8, 18.65]).radius(2.2)();
    planetGroup.append('path')
      .datum(olympusBase)
      .attr('d', pathGenerator)
      .attr('fill', '#9a3412')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.2);
    planetGroup.append('path')
      .datum(olympusPeak)
      .attr('d', pathGenerator)
      .attr('fill', '#fbbf24');

    // 5. Tharsis Montes Trio (Ascraeus, Pavonis, Arsia)
    const tharsisMontes: [number, number][] = [
      [-104.5, 11.9], // Ascraeus
      [-113.4, 0.8],  // Pavonis
      [-121.0, -9.0], // Arsia
    ];
    tharsisMontes.forEach(([lon, lat]) => {
      const volcano = d3.geoCircle().center([lon, lat]).radius(3.6)();
      planetGroup.append('path')
        .datum(volcano)
        .attr('d', pathGenerator)
        .attr('fill', '#7c2d12')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 1);
    });

    // 6. Valles Marineris Canyon System (Floor of Valles Beta)
    const vallesLine = {
      type: 'LineString',
      coordinates: [
        [-90, -8], [-80, -10], [-65, -12], [-50, -14], [-38, -16]
      ]
    } as d3.GeoPermissibleObjects;
    planetGroup.append('path')
      .datum(vallesLine)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#060a12')
      .attr('stroke-width', 5)
      .attr('stroke-linecap', 'round');
    planetGroup.append('path')
      .datum(vallesLine)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#ea580c')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '2 1');

    // 7. North & South Polar Glacial Ice Caps
    const northCap = d3.geoCircle().center([0, 90]).radius(12)();
    const southCap = d3.geoCircle().center([0, -90]).radius(14)();
    planetGroup.append('path')
      .datum(northCap)
      .attr('d', pathGenerator)
      .attr('fill', '#e0f2fe')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);
    planetGroup.append('path')
      .datum(southCap)
      .attr('d', pathGenerator)
      .attr('fill', '#e0f2fe')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 1)
      .attr('opacity', 0.85);

    // ------------------------------------------------------------------------
    // INFRASTRUCTURE OVERLAYS: 5-NODE 2,400 KM VACUUM MAGLEV CORRIDOR
    // ------------------------------------------------------------------------
    if (showMaglev) {
      // Connect all 5 nodes in sequence: Arcadia Prime -> Valles Beta -> Hellas Foundry -> Jezero -> Utopia Gamma
      const maglevCoords: [number, number][] = [
        [171.0, 39.2],  // Arcadia Prime
        [-60.0, -14.0], // Valles Beta
        [70.0, -42.7],  // Hellas Foundry
        [77.58, 18.38], // Jezero
        [110.0, 45.0],  // Utopia Gamma
        [171.0, 39.2],  // Loop back
      ];

      for (let i = 0; i < maglevCoords.length - 1; i++) {
        const seg = {
          type: 'LineString',
          coordinates: [maglevCoords[i], maglevCoords[i + 1]]
        } as d3.GeoPermissibleObjects;

        planetGroup.append('path')
          .datum(seg)
          .attr('d', pathGenerator)
          .attr('fill', 'none')
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '6 4')
          .attr('opacity', 0.85);
      }
    }

    // ------------------------------------------------------------------------
    // STORM TRACKS OVERLAY
    // ------------------------------------------------------------------------
    if (showStorms) {
      const stormArc = {
        type: 'LineString',
        coordinates: [
          [70.0, -42.7], // Hellas Foundry
          [40.0, -10.0],
          [-10.0, 10.0],
          [-60.0, -14.0], // Valles Beta
          [-120.0, 20.0],
          [171.0, 39.2]  // Arcadia Prime
        ]
      } as d3.GeoPermissibleObjects;

      planetGroup.append('path')
        .datum(stormArc)
        .attr('d', pathGenerator)
        .attr('fill', 'none')
        .attr('stroke', '#ea580c')
        .attr('stroke-width', 8)
        .attr('stroke-opacity', 0.22)
        .attr('stroke-linecap', 'round');

      planetGroup.append('path')
        .datum(stormArc)
        .attr('d', pathGenerator)
        .attr('fill', 'none')
        .attr('stroke', '#ea580c')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '8 6')
        .attr('opacity', 0.75);
    }

    // ------------------------------------------------------------------------
    // CRUSTAL MAGNETIC ANOMALIES
    // ------------------------------------------------------------------------
    if (showMagnetic) {
      const magAnomaly = d3.geoCircle().center([140.0, -50.0]).radius(15)();
      planetGroup.append('path')
        .datum(magAnomaly)
        .attr('d', pathGenerator)
        .attr('fill', 'none')
        .attr('stroke', '#c084fc')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 3')
        .attr('opacity', 0.7);
    }

    // Limb atmospheric glow overlay for 3D sphere (pointer-events none)
    if (projectionType === 'orthographic') {
      planetGroup.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', scale)
        .attr('fill', 'url(#d3MarsLimb)')
        .attr('pointer-events', 'none');
    }

    // ------------------------------------------------------------------------
    // FIVE SETTLEMENT NODES (CLICKABLE SVG MARKERS)
    // ------------------------------------------------------------------------
    const nodesGroup = svg.append('g').attr('class', 'settlement-nodes-layer');

    SETTLEMENT_SITES.forEach((site) => {
      // Calculate projected screen position
      const projected = projection(site.coordinates);
      if (!projected) return;

      const [px, py] = projected;

      // In orthographic mode, check if point is visible on the front hemisphere
      if (projectionType === 'orthographic') {
        const center = projection.rotate();
        const dist = d3.geoDistance(site.coordinates, [-center[0], -center[1]]);
        if (dist > Math.PI / 2) {
          // Node is on the back face of the sphere
          return;
        }
      }

      const isSelected = activePopupSite?.id === site.id;
      const isHovered = hoveredSite?.id === site.id;

      const nodeG = nodesGroup.append('g')
        .attr('transform', `translate(${px}, ${py})`)
        .attr('class', 'cursor-pointer select-none')
        .on('click', (event) => {
          event.stopPropagation();
          setActivePopupSite(site);
          if (onSelectSite) onSelectSite(site);
          setIsRotating(false);
        })
        .on('mouseenter', (event) => {
          setHoveredSite(site);
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) {
            setHoverPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }
        })
        .on('mousemove', (event) => {
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) {
            setHoverPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }
        })
        .on('mouseleave', () => {
          setHoveredSite(null);
          setHoverPos(null);
        });

      // Outer Radar Beacon Ring (pulsing / dashed)
      nodeG.append('circle')
        .attr('r', isSelected ? 22 : isHovered ? 18 : 13)
        .attr('fill', site.color)
        .attr('fill-opacity', isSelected ? 0.35 : 0.18)
        .attr('stroke', site.color)
        .attr('stroke-width', isSelected ? 2.5 : 1)
        .attr('stroke-dasharray', isSelected ? '4 2' : 'none');

      // Inner Core Marker Pin
      nodeG.append('circle')
        .attr('r', isSelected ? 7 : 5)
        .attr('fill', '#ffffff')
        .attr('stroke', site.color)
        .attr('stroke-width', 2.5);

      // Label Container Pill
      const labelG = nodeG.append('g')
        .attr('transform', 'translate(14, -8)');

      // Background backdrop for readability
      labelG.append('rect')
        .attr('x', -4)
        .attr('y', -6)
        .attr('width', isSelected ? 180 : 160)
        .attr('height', 28)
        .attr('rx', 4)
        .attr('fill', '#070a12')
        .attr('fill-opacity', 0.9)
        .attr('stroke', isSelected ? site.color : '#1e293b')
        .attr('stroke-width', isSelected ? 1.8 : 0.8);

      // Settlement Name
      labelG.append('text')
        .attr('x', 4)
        .attr('y', 6)
        .attr('fill', isSelected ? '#ffffff' : '#f1f5f9')
        .attr('font-size', isSelected ? '11px' : '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(site.name);

      // Status & Population Badge
      labelG.append('text')
        .attr('x', 4)
        .attr('y', 17)
        .attr('fill', site.color)
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`Pop: ${site.population.toLocaleString()} · ${site.code}`);
    });

    // ------------------------------------------------------------------------
    // DRAG INTERACTION (SPIN OR PAN MARS GLOBE)
    // ------------------------------------------------------------------------
    let lastPos: [number, number] | null = null;

    const dragBehavior = d3.drag<SVGSVGElement, unknown>()
      .on('start', (event) => {
        lastPos = [event.x, event.y];
        setIsRotating(false);
      })
      .on('drag', (event) => {
        if (!lastPos) {
          lastPos = [event.x, event.y];
          return;
        }
        const dx = event.x - lastPos[0];
        const dy = event.y - lastPos[1];
        lastPos = [event.x, event.y];

        const sensitivity = 0.35;
        setRotation((prev) => {
          let newLambda = prev[0] + dx * sensitivity;
          let newPhi = prev[1] - dy * sensitivity;
          // Clamp latitude to [-85, 85] to avoid pole inversion flips
          newPhi = Math.max(-85, Math.min(85, newPhi));
          return [newLambda, newPhi, prev[2]];
        });
      })
      .on('end', () => {
        lastPos = null;
      });

    svg.call(dragBehavior);

    // Track Cursor Latitude / Longitude
    svg.on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event, svgRef.current);
      const inverted = projection.invert ? projection.invert([mx, my]) : null;
      if (inverted && !isNaN(inverted[0]) && !isNaN(inverted[1])) {
        setCursorCoords([
          parseFloat(inverted[0].toFixed(2)),
          parseFloat(inverted[1].toFixed(2)),
        ]);
      } else {
        setCursorCoords(null);
      }
    });

  }, [projectionType, rotation, scale, showMaglev, showStorms, showMagnetic, activePopupSite, hoveredSite]);

  // Auto-Spinning Animation Loop
  useEffect(() => {
    if (!isRotating || projectionType !== 'orthographic') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();
    const spin = (time: number) => {
      const delta = time - lastTime;
      if (delta > 32) { // ~30fps for background rotation efficiency
        setRotation((prev) => [prev[0] + 0.35, prev[1], prev[2]]);
        lastTime = time;
      }
      animRef.current = requestAnimationFrame(spin);
    };

    animRef.current = requestAnimationFrame(spin);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRotating, projectionType]);

  // Center Globe on a specific settlement site
  const centerOnSite = (site: SettlementSite) => {
    setIsRotating(false);
    // In D3 projection, rotating [-lon, -lat] places the coordinate dead center!
    const targetLambda = -site.coordinates[0];
    const targetPhi = -site.coordinates[1];
    setRotation([targetLambda, targetPhi, 0]);
    setActivePopupSite(site);
    if (onSelectSite) onSelectSite(site);
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Interactive Controls Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950/90 rounded-xl border border-slate-800 text-xs font-mono">
        {/* Settlement Quick-Fly Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>SETTLEMENT NODES:</span>
          </span>
          {SETTLEMENT_SITES.map((site) => {
            const isSelected = activePopupSite?.id === site.id;
            return (
              <button
                key={site.id}
                onClick={() => centerOnSite(site)}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
                title={`Inspect ${site.name} · Pop: ${site.population.toLocaleString()}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: site.color }}
                />
                <span className="font-sans font-medium">{site.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({site.code})</span>
              </button>
            );
          })}
        </div>

        {/* Projection Controls & Tools */}
        <div className="flex items-center gap-2">
          {/* Projection Toggle */}
          <div className="flex p-0.5 bg-slate-900 rounded border border-slate-800">
            <button
              onClick={() => {
                setProjectionType('orthographic');
                setScale(245);
              }}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                projectionType === 'orthographic'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Orthographic</span>
            </button>
            <button
              onClick={() => {
                setProjectionType('equirectangular');
                setScale(245);
                setIsRotating(false);
              }}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                projectionType === 'equirectangular'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>2D Panoramic</span>
            </button>
          </div>

          {/* Auto Spin Toggle */}
          {projectionType === 'orthographic' && (
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
                isRotating
                  ? 'bg-amber-950/70 border-amber-500/70 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle planetary orbital spin"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? 'Spinning' : 'Auto-Spin'}</span>
            </button>
          )}

          {/* Zoom Controls */}
          <button
            onClick={() => setScale((s) => Math.min(500, s + 40))}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(160, s - 40))}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Stage with Overlay Pop-up Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#030508] shadow-2xl">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 560"
          className="w-full h-auto max-h-[640px] select-none cursor-grab active:cursor-grabbing block"
        />

        {/* Live Coordinate Overlay HUD */}
        <div className="absolute top-4 left-4 pointer-events-none p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/80 backdrop-blur font-mono text-xs text-slate-300 flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Crosshair className="w-3.5 h-3.5" />
            <span>MOLA DATUM:</span>
          </div>
          {cursorCoords ? (
            <span className="tabular-nums text-slate-100 font-bold">
              {cursorCoords[1] >= 0 ? `${cursorCoords[1]}°N` : `${Math.abs(cursorCoords[1])}°S`} ·{' '}
              {cursorCoords[0] >= 0 ? `${cursorCoords[0]}°E` : `${Math.abs(cursorCoords[0])}°W`}
            </span>
          ) : (
            <span className="text-slate-400">
              Center: {(-rotation[0]).toFixed(1)}°E · {(-rotation[1]).toFixed(1)}°N
            </span>
          )}
        </div>

        {/* Interactive Drag Hint */}
        <div className="absolute bottom-4 left-4 pointer-events-none px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800/80 text-[11px] font-mono text-slate-400 backdrop-blur flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          <span>Click &amp; drag to rotate projection in 3D · Click any node marker to display economic card</span>
        </div>

        {/* Quick Hover Preview HUD over SVG */}
        {hoveredSite && hoverPos && !activePopupSite && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-lg border shadow-xl backdrop-blur-md bg-slate-950/95 max-w-xs text-xs font-mono"
            style={{
              left: Math.min(hoverPos.x + 16, 700),
              top: Math.min(hoverPos.y + 16, 400),
              borderColor: hoveredSite.color,
            }}
          >
            <div className="font-bold text-slate-100 font-sans">{hoveredSite.name} ({hoveredSite.code})</div>
            <div className="text-[11px] text-amber-400 mt-0.5">
              Pop: {hoveredSite.population.toLocaleString()} citizens
            </div>
            <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
              {hoveredSite.primaryRole}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* INTERACTIVE POP-UP CARD (ANCHORED/DOCKED OVER MAP VIEWPORT ON CLICK) */}
        {/* ==================================================================== */}
        {activePopupSite && (
          <div className="absolute top-4 right-4 z-30 w-full max-w-md p-5 rounded-2xl border shadow-2xl backdrop-blur-xl bg-slate-950/95 transition-all text-xs font-mono space-y-4 border-slate-700/80">
            {/* Pop-up Card Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-[10px] mb-1">
                  <span
                    className="px-2 py-0.5 rounded font-bold text-slate-950"
                    style={{ backgroundColor: activePopupSite.color }}
                  >
                    {activePopupSite.code}
                  </span>
                  <span className="text-slate-400">{activePopupSite.epoch}</span>
                  <span>·</span>
                  <span className="text-slate-500">Sol {activePopupSite.foundedSol.toString().padStart(4, '0')}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
                  {activePopupSite.name}
                </h3>
                <p className="text-[11px] text-slate-300 font-sans leading-snug mt-0.5">
                  {activePopupSite.primaryRole}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap"
                  style={{
                    backgroundColor: activePopupSite.accentBg,
                    color: activePopupSite.color,
                    border: `1px solid ${activePopupSite.color}`,
                  }}
                >
                  {activePopupSite.status}
                </span>
                <button
                  onClick={() => setActivePopupSite(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Population Section */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>CURRENT POPULATION</span>
                </span>
                <span className="text-slate-300 font-sans">
                  {((activePopupSite.populationBreakdown.areanNative / activePopupSite.population) * 100).toFixed(0)}% Native Born
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-100 tabular-nums">
                  {activePopupSite.population.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-sans">verified arean inhabitants</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                <div>
                  <div className="text-slate-500">Native Areans:</div>
                  <div className="text-slate-200 font-bold tabular-nums">
                    {activePopupSite.populationBreakdown.areanNative.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Earth Born:</div>
                  <div className="text-slate-200 font-bold tabular-nums">
                    {activePopupSite.populationBreakdown.earthBorn.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Core Daemons:</div>
                  <div className="text-cyan-400 font-bold tabular-nums">
                    {activePopupSite.populationBreakdown.syntheticCoreDaemons} AIs
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Specializations Section */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-orange-400" />
                <span>ECONOMIC SPECIALIZATIONS</span>
              </div>
              <div className="space-y-1.5">
                {activePopupSite.economicSpecializations.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-200 font-sans leading-relaxed"
                  >
                    <span className="text-amber-500 shrink-0 font-mono font-bold mt-0.5">0{idx + 1}.</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Economic Daily Production Outputs */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>PRIMARY PRODUCTION METRICS</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {activePopupSite.economicOutputs.map((out, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]"
                  >
                    <span className="text-slate-400 font-sans">{out.label}:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{out.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Exports Tags */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPORT COMMODITIES</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activePopupSite.primaryExports.map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-sans"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Environmental & Life-Support Datum */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div>
                <span>Elev: </span>
                <span className="text-cyan-400 font-bold tabular-nums">
                  {activePopupSite.elevationMolaKm > 0 ? `+${activePopupSite.elevationMolaKm}` : activePopupSite.elevationMolaKm} km MOLA
                </span>
                <span> · {activePopupSite.surfacePressurePa} Pa</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => centerOnSite(activePopupSite)}
                  className="px-2.5 py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1"
                >
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span>Center Globe</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Settlement Strategic Dossier (Below Canvas) */}
      {activePopupSite && (
        <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-mono mb-1">
                <span
                  className="px-2 py-0.5 rounded font-bold text-slate-950"
                  style={{ backgroundColor: activePopupSite.color }}
                >
                  {activePopupSite.code}
                </span>
                <span className="text-slate-400">{activePopupSite.epoch}</span>
                <span>·</span>
                <span className="text-slate-500">Established Sol {activePopupSite.foundedSol.toString().padStart(4, '0')}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">{activePopupSite.name} · Strategic Overview</h2>
              <p className="text-xs text-slate-300 mt-1 font-sans">{activePopupSite.primaryRole}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded text-xs font-mono font-bold uppercase"
                style={{
                  backgroundColor: activePopupSite.accentBg,
                  color: activePopupSite.color,
                  border: `1px solid ${activePopupSite.color}`,
                }}
              >
                {activePopupSite.status}
              </span>
              <button
                onClick={() => centerOnSite(activePopupSite)}
                className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Center Globe</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-500" />
                <span>Population</span>
              </div>
              <div className="text-xl font-bold text-slate-100 mt-1 tabular-nums">
                {activePopupSite.population.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                {activePopupSite.populationBreakdown.areanNative} Native Areans ({((activePopupSite.populationBreakdown.areanNative / activePopupSite.population) * 100).toFixed(0)}%)
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Elevation &amp; Pressure</span>
              </div>
              <div className="text-xl font-bold text-cyan-400 mt-1 tabular-nums">
                {activePopupSite.elevationMolaKm > 0 ? `+${activePopupSite.elevationMolaKm}` : activePopupSite.elevationMolaKm} km
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {activePopupSite.surfacePressurePa} Pa Ambient CO2
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span>Life-Support Autarky</span>
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                {activePopupSite.lifeSupportBufferDays} Sols
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Independent Emergency Reserve
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Autonomous Swarm</span>
              </div>
              <div className="text-xl font-bold text-slate-100 mt-1 tabular-nums">
                {activePopupSite.activeSwarmRovers} Units
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Excavators &amp; Sinterers Active
              </div>
            </div>
          </div>

          {/* Description & Critical Subsystems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
                Areological Context &amp; Strategic Role:
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activePopupSite.description}
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <h3 className="font-bold uppercase text-slate-400">Critical Engineered Subsystems:</h3>
              <ul className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                {activePopupSite.primarySubsystems.map((sub, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 shrink-0 font-mono font-bold">▶</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
