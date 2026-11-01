/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Unified Planetary Physics, Biopsychosocial Coupling & VCG Auction Engine
 * Single deterministic source of truth for Argon Mars OS 5.0
 */

import {
  HomeostaticTensor,
  SanctuaryMode,
  SettlementId,
} from '../types/blueprint';

export interface PlanetaryPhysicsInput {
  opticalDepthTau: number;
  solarZenithDeg: number;
  reactorCoreTempK: number;
  chpShuntKw: number;
  pipeFlowRateLpm: number;
  shieldingType: 'dry_basalt' | 'graded_z';
  arealDepthGcm2: number;
  speProtonFlux: number;
  settlementPopulation?: number;
}

export interface PlanetaryPhysicsOutput {
  cosZenith: number;
  toaFlux: number;
  directFlux: number;
  diffuseRatio: number;
  diffuseFlux: number;
  totalSurfaceFlux: number;
  pvEfficiency: number;
  pvYieldWattsPerM2: number;
  pvArrayOutputKw: number;
  fissionBaseKw: number;
  chpElectricalPenaltyKw: number;
  totalPowerSupplyKw: number;
  ethPowerFloorKw: number;
  contestablePowerKw: number;
  conductiveLossKw: number;
  netMeltKw: number;
  meltRateKgPerHour: number;
  meltRateLitersPerSol: number;
  isPipeFreezing: boolean;
  effectiveDoseMsvYear: number;
  isRadiationHazard: boolean;
  seuBitFlipRatePerMsol: number;
}

/**
 * Settlement-specific baseline homeostatic tensors reflecting habitat geometry,
 * population density, MOLA elevation, and social composition.
 */
export const SETTLEMENT_TENSOR_BASELINES: Record<SettlementId, HomeostaticTensor> = {
  'arcadia-prime': {
    circadianDesync: 0.18,
    allostaticLoad: 0.35,
    cognitiveFatigue: 0.28,
    proxemicCrowding: 0.22,
    vestibularStrain: 0.08,
  },
  'valles-beta': {
    circadianDesync: 0.24,
    allostaticLoad: 0.40,
    cognitiveFatigue: 0.32,
    proxemicCrowding: 0.29,
    vestibularStrain: 0.11,
  },
  'utopia-gamma': {
    circadianDesync: 0.16,
    allostaticLoad: 0.31,
    cognitiveFatigue: 0.24,
    proxemicCrowding: 0.19,
    vestibularStrain: 0.06,
  },
  'jezero': {
    circadianDesync: 0.14,
    allostaticLoad: 0.33,
    cognitiveFatigue: 0.26,
    proxemicCrowding: 0.20,
    vestibularStrain: 0.07,
  },
  'hellas-foundry': {
    circadianDesync: 0.22,
    allostaticLoad: 0.39,
    cognitiveFatigue: 0.31,
    proxemicCrowding: 0.27,
    vestibularStrain: 0.10,
  },
};

/**
 * Single shared planetary physics engine (DEF-02).
 * Eliminates all duplicate Delta-Eddington, Rodwell Stefan, and HZETRN calculations.
 */
export function computePlanetaryPhysics(input: PlanetaryPhysicsInput): PlanetaryPhysicsOutput {
  const {
    opticalDepthTau,
    solarZenithDeg,
    reactorCoreTempK,
    chpShuntKw,
    pipeFlowRateLpm,
    shieldingType,
    arealDepthGcm2,
    speProtonFlux,
  } = input;

  // 1. Delta-Eddington Radiative Transfer Model
  const cosZenith = Math.max(0.01, Math.cos((solarZenithDeg * Math.PI) / 180));
  const toaFlux = 589.2; // W/m^2 mean Mars orbital irradiance
  const directFlux = toaFlux * cosZenith * Math.exp(-opticalDepthTau / cosZenith);
  const diffuseRatio = 0.58 * (1 - Math.exp(-0.65 * opticalDepthTau));
  const diffuseFlux = (toaFlux * cosZenith - directFlux) * diffuseRatio;
  const totalSurfaceFlux = Math.max(0, directFlux + diffuseFlux);
  const pvEfficiency = 0.28; // Triple-junction InGaP/GaAs/Ge
  const pvYieldWattsPerM2 = totalSurfaceFlux * pvEfficiency;
  const pvArrayOutputKw = Math.round(pvYieldWattsPerM2 * 3.2);

  // 2. Kilopower Fission + CHP Thermal-Electric Coupling
  const fissionBaseKw = reactorCoreTempK > 1100 ? 320 : 580;
  // High thermal extraction above nominal 320 kW_th reduces Stirling electrical conversion slightly
  const chpElectricalPenaltyKw = Math.round((chpShuntKw - 320) * 0.05);
  const totalPowerSupplyKw = Math.max(350, fissionBaseKw + pvArrayOutputKw - chpElectricalPenaltyKw);
  const ethPowerFloorKw = 350; // CONST-ETH Art. III un-contestable life-support reserve
  const contestablePowerKw = Math.max(0, totalPowerSupplyKw - ethPowerFloorKw);

  // 3. Rodwell Glacial Stefan Moving-Boundary Cavity
  const conductiveLossKw = 45;
  const netMeltKw = Math.max(0, chpShuntKw - conductiveLossKw);
  const meltRateKgPerHour = (netMeltKw * 3600) / 499;
  const meltRateLitersPerSol = Math.round(meltRateKgPerHour * 24.66);
  const isPipeFreezing = pipeFlowRateLpm < 8;

  // 4. HZETRN Boltzmann Radiation Transport & Secondary Neutron Paradox
  let baseGcrDoseMsvYear = 240;
  if (shieldingType === 'dry_basalt') {
    if (arealDepthGcm2 < 45) {
      // Secondary fast neutron spallation buildup peak (15 - 45 g/cm^2)
      baseGcrDoseMsvYear = 240 * (1 + 0.35 * Math.sin((arealDepthGcm2 / 45) * Math.PI));
    } else {
      baseGcrDoseMsvYear = 240 * Math.exp(-(arealDepthGcm2 - 45) / 120);
    }
  } else {
    // Graded-Z with H2O/polyethylene + 1.5 wt% Boron-10 neutron moderator wall
    baseGcrDoseMsvYear = 240 * Math.exp(-arealDepthGcm2 / 55);
  }

  const speDoseContribution =
    speProtonFlux >= 10
      ? speProtonFlux * (shieldingType === 'dry_basalt' ? 0.95 : 0.25)
      : 0;

  const effectiveDoseMsvYear = +(baseGcrDoseMsvYear + speDoseContribution).toFixed(1);
  const isRadiationHazard = effectiveDoseMsvYear > 50;
  const seuBitFlipRatePerMsol = Math.max(
    2,
    Math.round(effectiveDoseMsvYear / 16 + (speProtonFlux >= 10 ? 18 : 0))
  );

  return {
    cosZenith,
    toaFlux,
    directFlux,
    diffuseRatio,
    diffuseFlux,
    totalSurfaceFlux,
    pvEfficiency,
    pvYieldWattsPerM2,
    pvArrayOutputKw,
    fissionBaseKw,
    chpElectricalPenaltyKw,
    totalPowerSupplyKw,
    ethPowerFloorKw,
    contestablePowerKw,
    conductiveLossKw,
    netMeltKw,
    meltRateKgPerHour,
    meltRateLitersPerSol,
    isPipeFreezing,
    effectiveDoseMsvYear,
    isRadiationHazard,
    seuBitFlipRatePerMsol,
  };
}

/**
 * Reversible, bidirectional Planetary Lab -> Emotional Twins coupling (DEF-01).
 * Recovers smoothly to the settlement's nominal baseline when environmental hazards normalize.
 */
export function computeEnvironmentalTensor(params: {
  settlementId: SettlementId;
  opticalDepthTau: number;
  co2PartialPressurePa: number;
  speProtonFlux: number;
  hullPressurePa: number;
  effectiveDoseMsvYear: number;
  pipeFlowRateLpm: number;
}): HomeostaticTensor {
  const base = SETTLEMENT_TENSOR_BASELINES[params.settlementId] || SETTLEMENT_TENSOR_BASELINES['arcadia-prime'];

  // Normalized environmental stressors [0.0 - 1.0], zero at nominal conditions (tau <= 0.45)
  const dustFactor = Math.max(0, (params.opticalDepthTau - 0.45) / 5.55);
  const co2Factor = Math.max(0, (params.co2PartialPressurePa - 240) / 410);
  const speFactor = params.speProtonFlux >= 10 ? Math.min(0.32, params.speProtonFlux / 260) : 0;
  const hullFactor = params.hullPressurePa < 68000 ? 0.34 : 0;
  const radFactor =
    params.effectiveDoseMsvYear > 50
      ? Math.min(0.22, (params.effectiveDoseMsvYear - 50) / 1100)
      : 0;
  const pipeFactor = params.pipeFlowRateLpm < 8 ? 0.12 : 0;

  return {
    circadianDesync: Math.min(
      0.99,
      +(base.circadianDesync + dustFactor * 0.56 + hullFactor * 0.12).toFixed(2)
    ),
    allostaticLoad: Math.min(
      0.99,
      +(
        base.allostaticLoad +
        dustFactor * 0.54 +
        co2Factor * 0.22 +
        speFactor +
        hullFactor +
        radFactor +
        pipeFactor
      ).toFixed(2)
    ),
    cognitiveFatigue: Math.min(
      0.99,
      +(
        base.cognitiveFatigue +
        dustFactor * 0.36 +
        co2Factor * 0.52 +
        speFactor * 0.45 +
        radFactor * 0.5
      ).toFixed(2)
    ),
    proxemicCrowding: Math.min(
      0.99,
      +(
        base.proxemicCrowding +
        dustFactor * 0.55 +
        speFactor * 1.1 +
        hullFactor * 0.45
      ).toFixed(2)
    ),
    vestibularStrain: Math.min(
      0.99,
      +(base.vestibularStrain + dustFactor * 0.12 + co2Factor * 0.18 + radFactor * 0.35).toFixed(2)
    ),
  };
}

export interface VcgBidAllocation {
  agent: 'AGT-TKA' | 'AGT-PSS' | 'AGT-EMA' | 'AGT-CUD';
  task: string;
  blueprintClause: string;
  minKW: number;
  optKW: number;
  allocatedKW: number;
}

export interface KernelVcgResult {
  wTka: number;
  wPss: number;
  wEma: number;
  wCud: number;
  weightSum: number;
  normTka: number;
  normPss: number;
  normEma: number;
  normCud: number;
  isSpeEmergency: boolean;
  isDustStorm: boolean;
  isAllostaticPreemption: boolean;
  isCognitiveThrottle: boolean;
  isCircadianBoost: boolean;
  isSanctuaryRedacted: boolean;
  bids: VcgBidAllocation[];
}

/**
 * Harmonized Multi-Agent Kernel VCG Weighting & Bid Solver (DEF-03, DEF-04, DEF-06).
 * Preserves AGT-EMA Allostatic Preemption during Dust Storms & SPE emergencies,
 * couples CHP shunt, pipe freeze, radiation shielding, and circadian drift,
 * and enforces Sanctuary Mode zero-leakage air-gapping.
 */
export function computeKernelVcgAuction(params: {
  opticalDepthTau: number;
  speProtonFlux: number;
  chpShuntKw: number;
  pipeFlowRateLpm: number;
  effectiveDoseMsvYear: number;
  contestablePowerKw: number;
  humanTensor: HomeostaticTensor;
  sanctuaryMode?: SanctuaryMode;
}): KernelVcgResult {
  const {
    opticalDepthTau,
    speProtonFlux,
    chpShuntKw,
    pipeFlowRateLpm,
    effectiveDoseMsvYear,
    contestablePowerKw,
    humanTensor,
    sanctuaryMode = 'ACTIVE_COHORT_SYNC',
  } = params;

  const isSanctuaryRedacted = sanctuaryMode === 'SANCTUARY_BLACKOUT';

  // Under SANCTUARY_BLACKOUT, personal & cohort biometric streams are cryptographically paused;
  // Kernel operates on safe constitutional default priors without reading live biometric values.
  const effectiveAllostatic = isSanctuaryRedacted ? 0.35 : humanTensor.allostaticLoad;
  const effectiveCognitive = isSanctuaryRedacted ? 0.28 : humanTensor.cognitiveFatigue;
  const effectiveCircadian = isSanctuaryRedacted ? 0.18 : humanTensor.circadianDesync;

  const isSpeEmergency = speProtonFlux >= 10;
  const isDustStorm = opticalDepthTau >= 3.5;
  const isAllostaticPreemption = !isSanctuaryRedacted && effectiveAllostatic >= 0.72;
  const isCognitiveThrottle = !isSanctuaryRedacted && effectiveCognitive >= 0.65;
  const isCircadianBoost = !isSanctuaryRedacted && effectiveCircadian >= 0.70;
  const isPipeFreezing = pipeFlowRateLpm < 8;
  const isRadiationHazard = effectiveDoseMsvYear > 50;

  let wTka = 0.35;
  let wPss = 0.20;
  let wEma = 0.35;
  let wCud = 0.10;

  // Base regime weights with harmonized Allostatic Preemption override (DEF-03)
  if (isSpeEmergency) {
    if (isAllostaticPreemption) {
      wTka = 0.28;
      wPss = 0.28;
      wEma = 0.44;
      wCud = 0.00;
    } else {
      wTka = 0.50;
      wPss = 0.30;
      wEma = 0.20;
      wCud = 0.00;
    }
  } else if (isDustStorm) {
    if (isAllostaticPreemption) {
      // Allostatic Preemption remains active under Dust Storm conditions!
      wTka = 0.26;
      wPss = 0.28;
      wEma = 0.46;
      wCud = 0.00;
    } else {
      wTka = 0.45;
      wPss = 0.30;
      wEma = 0.25;
      wCud = 0.00;
    }
  } else if (isAllostaticPreemption) {
    wTka = 0.24;
    wPss = 0.19;
    wEma = 0.47;
    wCud = 0.10;
  }

  // Circadian drift > 70% directly boosts AGT-EMA melanopic sky-dome allocation (DEF-06)
  if (isCircadianBoost) {
    wEma += 0.07;
    wTka = Math.max(0.15, wTka - 0.05);
    wCud = Math.max(0, wCud - 0.02);
  }

  // Physical couplings from Planetary Lab into AGT-PSS weight (DEF-06)
  if (isPipeFreezing) {
    wPss += 0.08;
    wTka = Math.max(0.15, wTka - 0.06);
  }
  if (isRadiationHazard) {
    wPss += 0.05;
    wTka = Math.max(0.15, wTka - 0.04);
  }
  if (chpShuntKw !== 320) {
    const chpDeltaWeight = ((chpShuntKw - 320) / 480) * 0.06;
    wPss = Math.max(0.12, +(wPss + chpDeltaWeight).toFixed(3));
  }

  const weightSum = wTka + wPss + wEma + wCud;
  const normTka = wTka / weightSum;
  const normPss = wPss / weightSum;
  const normEma = wEma / weightSum;
  const normCud = wCud / weightSum;

  // Dynamic subsystem demand bounds coupled to CHP shunt, pipe freeze, and circadian boost
  const pssMinKw = Math.round(50 + chpShuntKw * 0.04 + (isPipeFreezing ? 30 : 0) + (isRadiationHazard ? 15 : 0));
  const pssOptKw = Math.round(115 + chpShuntKw * 0.14 + (isPipeFreezing ? 45 : 0) + (isRadiationHazard ? 25 : 0));

  const emaMinKw = 40 + (isAllostaticPreemption ? 35 : 0) + (isCircadianBoost ? 20 : 0);
  const emaOptKw = 120 + (isAllostaticPreemption ? 45 : 0) + (isCircadianBoost ? 30 : 0);

  const bids: VcgBidAllocation[] = [
    {
      agent: 'AGT-TKA',
      task: isAllostaticPreemption
        ? 'Sabatier & Sintering (THROTTLED FOR BIOPHILIA)'
        : 'Electrolysis & Sabatier Sintering',
      blueprintClause: 'REF:[ISRU-Industrial]',
      minKW: 180,
      optKW: 400,
      allocatedKW: Math.round(contestablePowerKw * normTka),
    },
    {
      agent: 'AGT-PSS',
      task: `Rodwell Cryo-Melt (${chpShuntKw} kW_th Shunt${isPipeFreezing ? ' · PIPE PURGE' : ''}${
        isRadiationHazard ? ' · RAD WALL' : ''
      })`,
      blueprintClause: 'REF:[Cryosphere-Hydrology]',
      minKW: pssMinKw,
      optKW: pssOptKw,
      allocatedKW: Math.round(contestablePowerKw * normPss),
    },
    {
      agent: 'AGT-EMA',
      task: isSanctuaryRedacted
        ? 'Sanctuary Protected Baseline Phototherapy'
        : isAllostaticPreemption
        ? 'PREEMPTION: 6500K Phototherapy & Biophilia Surge'
        : isCircadianBoost
        ? '6500K Melanopic Entrainment Surge (ϕ_circ > 70%)'
        : 'Circadian Phototherapy & Biophilia',
      blueprintClause: 'CONST-ETH Art. III',
      minKW: emaMinKw,
      optKW: emaOptKw,
      allocatedKW: Math.round(contestablePowerKw * normEma),
    },
    {
      agent: 'AGT-CUD',
      task: 'Diegetic Atmospheric Projections',
      blueprintClause: 'REF:[Visual-Semiotics]',
      minKW: 0,
      optKW: 45,
      allocatedKW: Math.round(contestablePowerKw * normCud),
    },
  ];

  return {
    wTka,
    wPss,
    wEma,
    wCud,
    weightSum,
    normTka,
    normPss,
    normEma,
    normCud,
    isSpeEmergency,
    isDustStorm,
    isAllostaticPreemption,
    isCognitiveThrottle,
    isCircadianBoost,
    isSanctuaryRedacted,
    bids,
  };
}
