/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CivilizationLens,
  DashboardTab,
  FACSActionUnit,
  HomeostaticTensor,
  SanctuaryMode,
  SettlementId,
  SyntheticDaemonTelemetry,
} from '../types/blueprint';
import { SETTLEMENT_SITES } from './D3MarsMap';
import { CANON_FILMS } from '../data/blueprintData';
import { SETTLEMENT_TENSOR_BASELINES } from '../utils/physicsEngine';
import {
  ShieldCheck,
  Lock,
  Eye,
  Cpu,
  User,
  Sun,
  Wind,
  Film,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface EmotionalTwinsLabProps {
  activeLens?: CivilizationLens;
  activeSettlementId?: SettlementId;
  opticalDepthTau?: number;
  co2PartialPressurePa?: number;
  humanTensor?: HomeostaticTensor;
  setHumanTensor?: React.Dispatch<React.SetStateAction<HomeostaticTensor>>;
  syntheticDaemon?: SyntheticDaemonTelemetry;
  setSyntheticDaemon?: React.Dispatch<React.SetStateAction<SyntheticDaemonTelemetry>>;
  sanctuaryMode?: SanctuaryMode;
  setSanctuaryMode?: (mode: SanctuaryMode) => void;
  onNavigateTab?: (tab: DashboardTab) => void;
}

export const EmotionalTwinsLab: React.FC<EmotionalTwinsLabProps> = ({
  activeLens = 'ALL',
  activeSettlementId = 'arcadia-prime',
  opticalDepthTau = 0.45,
  co2PartialPressurePa = 240,
  humanTensor: propTensor,
  setHumanTensor: propSetTensor,
  syntheticDaemon: propDaemon,
  setSyntheticDaemon: propSetDaemon,
  sanctuaryMode: propSanctuary,
  setSanctuaryMode: propSetSanctuary,
  onNavigateTab,
}) => {
  // Fallback local state if rendered standalone
  const [localTensor, setLocalTensor] = useState<HomeostaticTensor>({
    circadianDesync: 0.22,
    allostaticLoad: 0.45,
    cognitiveFatigue: 0.38,
    proxemicCrowding: 0.30,
    vestibularStrain: 0.12,
  });

  const [localDaemon, setLocalDaemon] = useState<SyntheticDaemonTelemetry>({
    daemonName: 'tka_kernel_d (RAD750 TMR)',
    entropyDivergence: 0.08,
    seuBitCorrectionRate: 14,
    vcgDeficitPressure: 0.18,
    syntheticEmpathyIndex: 0.88,
  });

  const [localSanctuary, setLocalSanctuary] = useState<SanctuaryMode>('ACTIVE_COHORT_SYNC');

  const humanTensor = propTensor || localTensor;
  const setHumanTensor = propSetTensor || setLocalTensor;
  const syntheticDaemon = propDaemon || localDaemon;
  const setSyntheticDaemon = propSetDaemon || setLocalDaemon;
  const sanctuaryMode = propSanctuary || localSanctuary;
  const setSanctuaryMode = propSetSanctuary || setLocalSanctuary;

  const currentSettlement =
    SETTLEMENT_SITES.find((s) => s.id === activeSettlementId) || SETTLEMENT_SITES[0];

  const isSanctuaryBlackout = sanctuaryMode === 'SANCTUARY_BLACKOUT';

  // Settlement-synchronized Zero-Knowledge PSE State (DEF-05)
  const dynamicCohortSize = Math.max(28, Math.round(currentSettlement.population / 52));
  const zkStatus = {
    sramWipeCountdown: 42,
    cohortSize: dynamicCohortSize,
    privacyEpsilon: sanctuaryMode === 'DIFFERENTIAL_ONLY' ? 0.04 : 0.08,
    zkProofVerified: true,
    nullifierHash: `0x${currentSettlement.code.toLowerCase().replace('-', '')}...4b12`,
  };

  // FACS Action Units computed from Homeostatic Tensor
  const actionUnits: FACSActionUnit[] = [
    {
      auCode: 'AU01',
      name: 'Inner Brow Raiser',
      muscle: 'Frontalis pars medialis',
      intensity: Math.min(1.0, humanTensor.allostaticLoad * 1.2),
      emotionalCorrelation: 'Apprehension / Surprise / Vigilance',
    },
    {
      auCode: 'AU04',
      name: 'Brow Lowerer',
      muscle: 'Corrugator supercilii',
      intensity: Math.min(1.0, (humanTensor.allostaticLoad + humanTensor.cognitiveFatigue) * 0.7),
      emotionalCorrelation: 'Concentration / Frustration / Pain',
    },
    {
      auCode: 'AU07',
      name: 'Lid Tightener',
      muscle: 'Orbicularis oculi',
      intensity: Math.min(1.0, humanTensor.cognitiveFatigue * 1.1),
      emotionalCorrelation: 'Eye Strain / Saccadic Slowing / Photophobia',
    },
    {
      auCode: 'AU15',
      name: 'Lip Corner Depressor',
      muscle: 'Depressor anguli oris',
      intensity: Math.min(1.0, humanTensor.circadianDesync * 0.9),
      emotionalCorrelation: 'Sol-Lag Melancholy / Earth-Grief',
    },
    {
      auCode: 'AU20',
      name: 'Lip Stretcher',
      muscle: 'Risorius',
      intensity: Math.min(1.0, humanTensor.proxemicCrowding * 0.85),
      emotionalCorrelation: 'Crowding Stress / Subconscious Defensive Reflex',
    },
  ];

  // Simulation Triggers for Emotional Drift Dynamics
  const triggerScenario = (scenario: 'dust_storm' | 'conjunction' | 'sol_drift' | 'nominal') => {
    switch (scenario) {
      case 'dust_storm':
        setHumanTensor({
          circadianDesync: 0.65,
          allostaticLoad: 0.78,
          cognitiveFatigue: 0.72,
          proxemicCrowding: 0.85,
          vestibularStrain: 0.15,
        });
        setSyntheticDaemon((prev) => ({
          ...prev,
          vcgDeficitPressure: 0.82,
          entropyDivergence: 0.35,
          syntheticEmpathyIndex: 0.96,
        }));
        break;
      case 'conjunction':
        setHumanTensor({
          circadianDesync: 0.35,
          allostaticLoad: 0.82, // Earth cut-off anxiety
          cognitiveFatigue: 0.55,
          proxemicCrowding: 0.40,
          vestibularStrain: 0.10,
        });
        setSyntheticDaemon((prev) => ({
          ...prev,
          vcgDeficitPressure: 0.45,
          entropyDivergence: 0.12,
          syntheticEmpathyIndex: 0.95,
        }));
        break;
      case 'sol_drift':
        setHumanTensor({
          circadianDesync: 0.88, // 39m Sol phase slip
          allostaticLoad: 0.60,
          cognitiveFatigue: 0.80,
          proxemicCrowding: 0.35,
          vestibularStrain: 0.25,
        });
        break;
      case 'nominal': {
        const base =
          SETTLEMENT_TENSOR_BASELINES[activeSettlementId] ||
          SETTLEMENT_TENSOR_BASELINES['arcadia-prime'];
        setHumanTensor({ ...base });
        setSyntheticDaemon({
          daemonName: 'tka_kernel_d (RAD750 TMR)',
          entropyDivergence: 0.04,
          seuBitCorrectionRate: 2,
          vcgDeficitPressure: 0.12,
          syntheticEmpathyIndex: 0.92,
        });
        break;
      }
    }
  };

  const isAllostaticPreemption = !isSanctuaryBlackout && humanTensor.allostaticLoad >= 0.72;

  // Cultural Catharsis Recommendation based on dominant stressor
  const recommendedCanonFilm =
    humanTensor.proxemicCrowding > 0.65 || opticalDepthTau >= 3.5
      ? CANON_FILMS[2] // F-03: The Great Ochre
      : humanTensor.circadianDesync > 0.6
      ? CANON_FILMS[0] // F-01: The Unforgiving Sol
      : humanTensor.allostaticLoad > 0.7
      ? CANON_FILMS[7] // F-08: Conjunction Cut
      : CANON_FILMS[4]; // F-05: Native Born

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>MODULE 3</span>
            <span>·</span>
            <span>SECTION [Emotional-Ontology] &amp; [Digital-Twins]</span>
            <span>·</span>
            <span>COHORT: {currentSettlement.name.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Emotional Digital Twins &amp; Digital Dignity Enclave
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Flagship biopsychosocial telemetry engine. Couples environmental physics (τ={opticalDepthTau.toFixed(2)}, CO2={co2PartialPressurePa} Pa) with 5D homeostatic state vectors, architectural bio-feedback, and Zero-Knowledge Personal Somatic Enclaves.
          </p>
        </div>

        {/* Preset Drift Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerScenario('dust_storm')}
            className="px-2.5 py-1 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded transition-colors"
          >
            40-Sol Lockout
          </button>
          <button
            onClick={() => triggerScenario('conjunction')}
            className="px-2.5 py-1 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded transition-colors"
          >
            Conjunction Dead-Sync
          </button>
          <button
            onClick={() => triggerScenario('sol_drift')}
            className="px-2.5 py-1 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded transition-colors"
          >
            Sol-Lag Desync
          </button>
          <button
            onClick={() => triggerScenario('nominal')}
            className="px-2.5 py-1 text-xs font-mono bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/50 text-purple-200 rounded transition-colors"
          >
            Reset Nominal
          </button>
        </div>
      </div>

      {/* Three Pillars of Martian Affective Architecture Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
        {/* Pillar I: Digital Dignity & Sanctuary Control */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-emerald-500/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>PILLAR I · DIGITAL DIGNITY LEDGER</span>
            </span>
            <span className="text-[10px] text-slate-400">Opt-In: 96.4%</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'ACTIVE_COHORT_SYNC', label: 'Cohort Sync' },
                { id: 'DIFFERENTIAL_ONLY', label: 'Diff-Noise' },
                { id: 'SANCTUARY_BLACKOUT', label: 'Sanctuary' },
              ] as { id: SanctuaryMode; label: string }[]
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSanctuaryMode(mode.id)}
                className={`py-1.5 px-2 rounded text-[10px] border transition-all ${
                  sanctuaryMode === mode.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            {sanctuaryMode === 'SANCTUARY_BLACKOUT'
              ? 'Sanctuary Opacity Active: Raw & cohort telemetry paused with zero resource penalty.'
              : 'Zero-Surveillance Guarantee: Only K≥28 Laplace-noised cohort weather reaches governance.'}
          </div>
        </div>

        {/* Pillar II: Biopsychosocial Habitat Coupling */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-purple-500/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-purple-300 font-bold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>PILLAR II · ARCHITECTURAL BIO-FEEDBACK</span>
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('kernel')}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>Kernel Bus</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Kernel AGT-EMA Preemption:</span>
              <span
                className={
                  isSanctuaryBlackout
                    ? 'text-emerald-400 font-bold'
                    : isAllostaticPreemption
                    ? 'text-rose-400 font-bold'
                    : 'text-emerald-400 font-bold'
                }
              >
                {isSanctuaryBlackout
                  ? 'REDACTED [SANCTUARY]'
                  : isAllostaticPreemption
                  ? 'ACTIVE (w_EMA = 46–47%)'
                  : 'STANDBY (w_EMA = 35%)'}
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Sky-Dome Spectrum:</span>
              <span className="text-cyan-300">
                {isSanctuaryBlackout
                  ? 'REDACTED [SANCTUARY]'
                  : humanTensor.circadianDesync > 0.5
                  ? '6500K Melanopic Entrainment'
                  : '4200K Nominal Sol'}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Coupled to Planetary Lab τ={opticalDepthTau.toFixed(2)} and Habitat CO2={co2PartialPressurePa} Pa.
          </div>
        </div>

        {/* Pillar III: Cultural & Narrative Catharsis */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-500/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>PILLAR III · DIEGETIC CATHARSIS PROTOCOL</span>
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('cinematic')}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>Open Canon</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
            <div className="text-amber-400 font-bold text-[11px]">
              [{recommendedCanonFilm.id}] {recommendedCanonFilm.title}
            </div>
            <div className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1">
              {recommendedCanonFilm.emotionalArc}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Matches current cohort affective profile to historical Martian survival precedents.
          </div>
        </div>
      </div>

      {/* Grid: 5D Human Homeostatic Vector & Synthetic Daemon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Human 5D Homeostatic State Vector */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-5 transition-all ${
            activeLens === 'PSYCHOLOGY'
              ? 'border-purple-500/80 ring-1 ring-purple-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Human 5D Homeostatic Tensor Vector h_i(t)</span>
            </h2>
            <span className="text-xs font-mono text-purple-400">REF:[Psych-Isolation]</span>
          </div>

          <div className="space-y-4">
            {/* Slider 1: phi_circ */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">ϕ_circ (Circadian Phase Desync):</span>
                <span className="text-purple-300 font-bold tabular-nums">
                  {sanctuaryMode === 'SANCTUARY_BLACKOUT'
                    ? 'SANCTUARY OPACITY'
                    : `${(humanTensor.circadianDesync * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={humanTensor.circadianDesync}
                onChange={(e) =>
                  setHumanTensor((prev) => ({ ...prev, circadianDesync: parseFloat(e.target.value) }))
                }
                className="w-full accent-purple-500"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                Driven by 24h 39m 35s Martian Sol drift &amp; surface dust optical depth (τ = {opticalDepthTau.toFixed(2)})
              </div>
            </div>

            {/* Slider 2: sigma_allost */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">σ_allost (Allostatic Autonomic Load):</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {sanctuaryMode === 'SANCTUARY_BLACKOUT'
                    ? 'SANCTUARY OPACITY'
                    : `${(humanTensor.allostaticLoad * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={humanTensor.allostaticLoad}
                onChange={(e) =>
                  setHumanTensor((prev) => ({ ...prev, allostaticLoad: parseFloat(e.target.value) }))
                }
                className="w-full accent-amber-500"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                Sympathetic/parasympathetic balance; triggers AGT-EMA life-support preemption above 72%
              </div>
            </div>

            {/* Slider 3: kappa_cog */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">κ_cog (Cognitive Fatigue Index):</span>
                <span className="text-slate-300 font-bold tabular-nums">
                  {sanctuaryMode === 'SANCTUARY_BLACKOUT'
                    ? 'SANCTUARY OPACITY'
                    : `${(humanTensor.cognitiveFatigue * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={humanTensor.cognitiveFatigue}
                onChange={(e) =>
                  setHumanTensor((prev) => ({ ...prev, cognitiveFatigue: parseFloat(e.target.value) }))
                }
                className="w-full accent-purple-500"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                Saccadic velocity degradation in ambient CO2 ({co2PartialPressurePa} Pa); offloads EVA to rovers &gt;65%
              </div>
            </div>

            {/* Slider 4: rho_prox */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">ρ_prox (Proxemic Crowding Saturation):</span>
                <span className="text-slate-300 font-bold tabular-nums">
                  {sanctuaryMode === 'SANCTUARY_BLACKOUT'
                    ? 'SANCTUARY OPACITY'
                    : `${(humanTensor.proxemicCrowding * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={humanTensor.proxemicCrowding}
                onChange={(e) =>
                  setHumanTensor((prev) => ({ ...prev, proxemicCrowding: parseFloat(e.target.value) }))
                }
                className="w-full accent-purple-500"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                Subterranean lava tube volumetric confinement vs. acoustic dampening threshold
              </div>
            </div>

            {/* Slider 5: nu_vestib */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">ν_vestib (Vestibular 0.376g Strain):</span>
                <span className="text-cyan-300 font-bold tabular-nums">
                  {sanctuaryMode === 'SANCTUARY_BLACKOUT'
                    ? 'SANCTUARY OPACITY'
                    : `${(humanTensor.vestibularStrain * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={humanTensor.vestibularStrain}
                onChange={(e) =>
                  setHumanTensor((prev) => ({ ...prev, vestibularStrain: parseFloat(e.target.value) }))
                }
                className="w-full accent-cyan-500"
              />
              <div className="text-[10px] text-slate-500 font-mono">
                Otolith &amp; proprioceptive adaptation to Martian hypogravity (3.721 m/s²)
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Synthetic Agent Daemon State Machine */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-5 transition-all ${
            activeLens === 'INFRASTRUCTURE' || activeLens === 'RESILIENCE'
              ? 'border-cyan-500/80 ring-1 ring-cyan-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Synthetic Daemon Cognition &amp; Telemetry</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400">{syntheticDaemon.daemonName}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-slate-950 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Entropy Divergence</div>
              <div className="text-xl font-bold text-slate-100 mt-1 tabular-nums">
                {(syntheticDaemon.entropyDivergence * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Drift from Tier-0 formal invariant spec
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">SEU Correction Load</div>
              <div className="text-xl font-bold text-amber-400 mt-1 tabular-nums">
                {syntheticDaemon.seuBitCorrectionRate} <span className="text-xs font-normal">flips/mSol</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Absorbed radiation bit-flips
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">VCG Deficit Pressure</div>
              <div className="text-xl font-bold text-rose-400 mt-1 tabular-nums">
                {(syntheticDaemon.vcgDeficitPressure * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Underfunded subsystem tasks
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Synthetic Empathy Index</div>
              <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                {(syntheticDaemon.syntheticEmpathyIndex * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Alignment with human allostatic load
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong>Synthetic Emotional Resonance:</strong> Unlike cold rule-based systems, Tier-1 daemons continuously adjust their optimization loss functions to reduce human allostatic load, sacrificing industrial sintering throughput to expand lighting and water rations when human stress breaches 72%.
          </div>
        </div>
      </div>

      {/* Bottom Grid: FACS Facial Action Coding & Zero-Knowledge Enclave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FACS Action Units Table */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-4 transition-all ${
            activeLens === 'PSYCHOLOGY' || activeLens === 'CULTURE' || activeLens === 'NARRATIVE'
              ? 'border-purple-500/70 ring-1 ring-purple-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Facial Action Coding System (FACS) Mappings</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Ekman AU Taxonomy</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {actionUnits.map((au) => (
              <div key={au.auCode} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-400">{au.auCode}</span>
                    <span className="text-slate-200">{au.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                    {au.muscle} · {au.emotionalCorrelation}
                  </div>
                </div>

                <div className="w-32 text-right">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{
                        width: isSanctuaryBlackout ? '100%' : `${au.intensity * 100}%`,
                        opacity: isSanctuaryBlackout ? 0.15 : 1,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isSanctuaryBlackout
                      ? 'REDACTED [SANCTUARY]'
                      : `${(au.intensity * 100).toFixed(0)}% Tension`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zero-Knowledge Personal Somatic Enclave (PSE) */}
        <div
          className={`p-6 bg-slate-900/60 rounded-xl border space-y-4 transition-all ${
            activeLens === 'CULTURE' || activeLens === 'RESILIENCE' || activeLens === 'GEOGRAPHY'
              ? 'border-emerald-500/70 ring-1 ring-emerald-500/20'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero-Knowledge Somatic Enclave (PSE) Air-Gap</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400">CONST-ETH Air-Gap</span>
          </div>

          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Volatile SRAM Ephemeral Buffer:</span>
              <span className="text-emerald-400 font-bold">Zeroed every 60s (Active)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">K-Anonymity Cohort Size:</span>
              <span className="text-slate-200 font-bold">K = {zkStatus.cohortSize} (Min ≥ 25)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Differential Privacy ε:</span>
              <span className="text-slate-200 font-bold">ε = {zkStatus.privacyEpsilon} (Laplace Noise)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nullifier Replay Shield:</span>
              <span className="text-purple-400 font-bold">{zkStatus.nullifierHash}</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-950/30 rounded border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Cryptographic Privacy Guarantee:</strong> Raw heart rate, voice pitch, pupillometry, and cortisol sweat telemetry NEVER leave the colonist’s wearable enclave. Political governance only receives zero-knowledge mathematical proofs of cohort distress, preventing behavioral surveillance or coercion.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
