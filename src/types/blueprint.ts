/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AutonomyLevel =
  | 'AL0_MANUAL_DIRECT'
  | 'AL1_CREW_SUPERVISED'
  | 'AL2_NOMINAL_AUTONOMOUS'
  | 'AL3_CONJUNCTION_LOCK'
  | 'AL4_ACUTE_EMERGENCY'
  | 'AL5_LIZARD_BRAIN';

export type AgentId =
  | 'AGT-TKA' // Technical Kernel Architect
  | 'AGT-PSS' // Planetary Simulation Scientist
  | 'AGT-EMA' // Emotional Architect
  | 'AGT-CUD' // Cinematic Universe Designer
  | 'AGT-GMA'; // Generative Mathematician

export interface AgentDescriptor {
  id: AgentId;
  name: string;
  daemon: string;
  tier: 'Tier-0' | 'Tier-1' | 'Tier-0 & Tier-1';
  epistemicLens: string;
  mandate: string;
  consumes: string[];
  produces: string[];
}

export interface HomeostaticTensor {
  circadianDesync: number;   // phi_circ [0.0 - 1.0]
  allostaticLoad: number;    // sigma_allost [0.0 - 1.0]
  cognitiveFatigue: number;  // kappa_cog [0.0 - 1.0]
  proxemicCrowding: number;  // rho_prox [0.0 - 1.0]
  vestibularStrain: number;  // nu_vestib [0.0 - 1.0]
}

export interface FACSActionUnit {
  auCode: string;
  name: string;
  muscle: string;
  intensity: number; // 0.0 - 1.0
  emotionalCorrelation: string;
}

export interface SyntheticDaemonTelemetry {
  daemonName: string;
  entropyDivergence: number;
  seuBitCorrectionRate: number;
  vcgDeficitPressure: number;
  syntheticEmpathyIndex: number;
}

export interface FilmCanonEntry {
  id: string; // e.g. F-01
  title: string;
  epoch: string; // Epoch I - V
  solsTimeline: string;
  directorStyle: string;
  cameraLanguage: string;
  colorGrade: string;
  logline: string;
  narrativeConflict: string;
  emotionalArc: string;
  primaryCharacters: string[];
  soundtrackMotif: string;
  technicalCoupling: string;
  image?: string;
}

export interface SeriesCanonEntry {
  id: string; // e.g. S-01
  title: string;
  format: string;
  epochSpan: string;
  premise: string;
  keyThemes: string[];
  seasons: {
    seasonNum: number;
    title: string;
    focus: string;
    climaxEvent: string;
  }[];
  diegeticImpact: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  origin: 'Earth-Born' | 'Mars-Native (Arean)' | 'Hybrid Synthetic';
  birthSol: number;
  activeEpochs: string[];
  psychProfile: string;
  homeostaticBaseline: HomeostaticTensor;
  narrativeArc: string;
  signatureQuote: string;
}

export interface ResourceState {
  powerWatts: number;
  thermalWatts: number;
  waterGramsPerMsol: number;
  oxygenGramsPerMsol: number;
}

export interface BlueprintSection {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  subsections?: { id: string; title: string; summary: string }[];
  summary: string;
  governingEquations?: string[];
  keyInvariants?: string[];
  crossRefs: string[];
  agentOwnership: AgentId[];
}
