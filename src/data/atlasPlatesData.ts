/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AtlasPlate } from '../types/blueprint';

export const ATLAS_PLATES: AtlasPlate[] = [
  {
    id: 'plate-1',
    number: 'Plate I',
    title: 'Areographic Master Map & 50-Year Settlement Corridor',
    subtitle: 'Planetary Topography, 2,400km Vacuum Maglev Spine, and Critical Resource Sites',
    moduleRef: 'REF:[Areology-Geomorph] & REF:[Epoch-4-Network]',
    scale: '1 : 25,000,000 (Global)',
    datum: 'Areocentric Equirectangular (MOLA 0.0m Datum)',
    summary: 'The planetary strategic distribution of human presence across five 50-year epochs. Anchored across five core settlements: Arcadia Prime (Founding Beachhead & Cryo-Agri), Valles Beta (Deep Chasm Metallurgy), Utopia Gamma (Strategic Water Reserve), Jezero (Synod Capitol & Biosphere Commons), and Hellas Foundry (Atmospheric High-Pressure Smelting), connected via the vacuum maglev transit corridor.',
    keyAxioms: [
      'Site selection restricted to mid-to-high latitude subsurface glacial sheets (Arcadia Prime & Utopia Gamma).',
      'Atmospheric pressure differential (Hellas Foundry: 1,155 Pa vs. Olympus Caldera: 72 Pa) determines landing, gas harvesting, and launch trajectories.',
      'Corridor alignment connects the five industrial specializations: Agriculture, Metallurgy, Aquifer Reserves, Governance, and Smelting.',
    ],
  },
  {
    id: 'plate-2',
    number: 'Plate II',
    title: 'Subsurface Stratigraphic Cross-Section & Overburden Mechanics',
    subtitle: 'Z-Axis Lithostatic Equilibrium, Graded-Z Shielding, and Deep Cryosphere Stefan Cavity',
    moduleRef: 'REF:[Areology-Geomorph], REF:[Cryosphere-Hydrology] & REF:[Radiation-Physics]',
    scale: 'Vertical 1 : 500 (150m Column)',
    datum: 'Subsurface Local Areoid Datum (z = 0m Surface Regolith)',
    summary: 'Full geological column from surface regolith fines down to the deep glacial aquifer at -140m. Highlights the 10.04m minimum safe overburden for 70 kPa pressurized lava tubes, secondary neutron attenuation layers, and the Rodriguez Well melt cavity.',
    keyAxioms: [
      'Minimum Safe Overburden (H_burial >= 10.04m) mathematically prevents internal 70 kPa pressure blow-out through cooling joints.',
      'Secondary neutron spallation paradox in dry basalt requires an inner 35cm Graded-Z water/borated polyethylene moderator wall.',
      'Rodwell spherical phase-change cavity extracts 195K ancient glacial ice using secondary nuclear CHP heat shunts.',
    ],
  },
  {
    id: 'plate-3',
    number: 'Plate III',
    title: 'Lava Tube Primary Habitat Deck Floorplan (Level 1: Civic & Biosphere)',
    subtitle: 'Pressurized 40m Basalt Conduit, Spirulina Biosphere Commons, and Private Somatic Enclaves',
    moduleRef: 'REF:[Habitat-Proxemics], REF:[SynBio-Agri] & REF:[Spatial-Topologies]',
    scale: '1 : 200 (Architectural Metric)',
    datum: 'Arcadia Tube-1 Deck Datum (z = -18.5m Lithostatic Floor)',
    summary: 'The upper living level of the primary settlement module. Houses the 3-stage airlock dust curtain, vertical Arthrospira photobioreactor raceways, central Synod agora, acoustic-isolated sleep capsules with Personal Somatic Enclaves, and negative-pressure bio-containment.',
    keyAxioms: [
      'CONST-ETH: Life support is non-weaponizable; baseline air and water conduits are hard-piped with no billing throttle.',
      'Circadian phototherapy perimeter coving entrains inhabitants to the 24h 39m 35s Martian Sol cycle.',
      'Acoustic volcanic rock relief and active noise cancellation suppress high-frequency ECLSS pump drone to <42 dBA.',
    ],
  },
  {
    id: 'plate-4',
    number: 'Plate IV',
    title: 'Subterranean Infrastructure & Technical Kernel Floorplan (Level 2: Life Support & Power)',
    subtitle: 'Physicochemical Life Support, Sabatier/MOXIE Chemical Plant, and Tier-0 TMR Lockstep Compute Vault',
    moduleRef: 'REF:[Kernel-Architecture], REF:[ECLSS-Physico] & REF:[ISRU-Industrial]',
    scale: '1 : 200 (Engineering Metric)',
    datum: 'Arcadia Tube-1 Lower Trench (z = -24.0m Heavy Equipment Deck)',
    summary: 'The machine floor sustaining the civilization. Houses dual-amine vacuum-swing CO2 adsorption beds, water electrolysis, Sabatier methane synthesis, 400V/1000V DC power switchgear, and the radiation-shielded Tier-0 TMR computer vault.',
    keyAxioms: [
      'Tier-0 TMR lockstep processor is physically air-gapped via an optical galvanic bus from Tier-1 advisory silicon.',
      'Sabatier reactor operates exothermically at 673K, delivering waste heat into the habitat hydronic loop.',
      'Analog Lizard-Brain emergency sequencer maintains survivable life support even if all digital compute fails.',
    ],
  },
  {
    id: 'plate-5',
    number: 'Plate V',
    title: 'Meso-Scale Crater Paraterraforming Dome Structural Geometry',
    subtitle: '12-Hectare Jezero Geodesic Tension Net, Double-Glazed ETFE Aerogel Cushions, and Rock Anchors',
    moduleRef: 'REF:[Micro-Climates] & REF:[Arch-Aesthetics]',
    scale: '1 : 1,000 (Structural Engineering)',
    datum: 'Jezero Crater Terrace Datum (Delta Fan Perimeter Rim)',
    summary: 'Large-scale paraterraformed surface enclosure spanning 12 hectares. Utilizes basalt-fiber tension trusses balancing a 69.4 kPa internal upward thrust against bedrock post-tensioned anchors, glazed with silica aerogel for solid-state greenhouse warming.',
    keyAxioms: [
      'Aerogel core (k = 0.012 W/mK) reduces thermal conduction losses to the thin Martian atmosphere by 88%.',
      'Interdigitated transparent ITO electrodes supply 1.2 kV 3-phase traveling waves to electrostatically repel airborne dust.',
      'Cable net safety factor N >= 3.2 guarantees structural integrity even during -90K diurnal freeze cycles.',
    ],
  },
  {
    id: 'plate-6',
    number: 'Plate VI',
    title: 'Rodwell Cryo-Hydrology & Hydraulic Delivery Network',
    subtitle: 'Fission Trench CHP Heat Exchanger, Coaxial Vacuum Lift, and Automated Freeze-Burst Purge Valves',
    moduleRef: 'REF:[Cryosphere-Hydrology], REF:[Nuclear-Fission] & REF:[Failure-Cascades]',
    scale: 'Schematic Process & Instrumentation Diagram (P&ID)',
    datum: 'Glacial Wellhead Alpha to Core Vault Manifold',
    summary: 'Closed-loop thermo-hydraulic piping diagram detailing water extraction from -120m glacial permafrost. Demonstrates secondary glycol loop circulation, submerged extraction pumping, and automated CO2 dry-blow purge valves preventing pipe freezing.',
    keyAxioms: [
      'CBF-Pipe-Freeze: If delivery pipeline outlet temperature drops below 276.15K (+3°C), emergency pneumatic purge fires within 12 seconds.',
      'Continuous recirculation loop maintains turbulent flow (Re > 4,000) to prevent stagnant boundary-layer ice crystal seeding.',
      'Greywater distillation loop recovers 98% of metabolic effluent back into the potable reservoir.',
    ],
  },
  {
    id: 'plate-7',
    number: 'Plate VII',
    title: 'Mobile EV-City V2G / R2H Fleet Topology & Surface Corridor Logistics',
    subtitle: '32-Unit Autonomous Rover Swarm, 15m Voxel Reservation Grid, and Human EVA Safety Halo',
    moduleRef: 'REF:[Robotics-Swarm] & REF:[Rover-V2G-Grid]',
    scale: '1 : 1,000 (Surface Voxel Grid)',
    datum: 'Arcadia Beachhead Coordinate Datum (Easting/Northing Origin)',
    summary: 'The mobile bidirectional energy and logistics grid. Features heavy excavation haulers, microwave sinterers, and mobile phase-change salt thermal pods ferrying power and reject heat between remote solar fields, the nuclear trench, and habitat airlocks.',
    keyAxioms: [
      'Deterministic Time-Expanded Token Routing (TETR) mathematically guarantees zero rover-to-rover collisions.',
      'Mandatory 15m L-infinity exclusion halo around EVA humans enforced at the kernel level; rovers halt immediately if breach occurs.',
      'Mobile rover batteries act as an emergency 3.6 MWh virtual power plant (V2G) capable of sustaining the habitat for 14 Sols.',
    ],
  },
];
