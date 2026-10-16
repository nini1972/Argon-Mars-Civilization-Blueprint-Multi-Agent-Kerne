/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CANON_FILMS,
  CANON_SERIES,
  CANON_CHARACTERS,
  AREAN_CREOLE_GLOSSARY,
} from '../data/blueprintData';
import { FilmCanonEntry, SeriesCanonEntry, CharacterProfile } from '../types/blueprint';
import { audioSynth } from '../utils/audioSynth';
import {
  Film,
  Tv,
  Users,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Camera,
  Palette,
  Music,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const CinematicUniverseExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'films' | 'series' | 'characters' | 'glossary'>('films');
  const [selectedEpoch, setSelectedEpoch] = useState<string>('all');
  const [selectedFilm, setSelectedFilm] = useState<FilmCanonEntry | null>(CANON_FILMS[0]);
  const [playingMotif, setPlayingMotif] = useState<string | null>(null);

  const epochs = [
    { id: 'all', label: 'All 50 Years' },
    { id: 'Epoch I', label: 'Epoch I: Beachhead (Y01–10)' },
    { id: 'Epoch II', label: 'Epoch II: Autarky (Y11–20)' },
    { id: 'Epoch III', label: 'Epoch III: Nativity (Y21–30)' },
    { id: 'Epoch IV', label: 'Epoch IV: Network (Y31–40)' },
    { id: 'Epoch V', label: 'Epoch V: Horizon (Y41–50)' },
  ];

  const filteredFilms =
    selectedEpoch === 'all'
      ? CANON_FILMS
      : CANON_FILMS.filter((f) => f.epoch.includes(selectedEpoch));

  const handleToggleAudio = (motifId: string) => {
    if (playingMotif === motifId) {
      audioSynth.stop();
      setPlayingMotif(null);
    } else {
      audioSynth.playMotif(motifId);
      setPlayingMotif(motifId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-1">
            <span>MODULE 4</span>
            <span>·</span>
            <span>SECTION [Cinematic-Bible]</span>
            <span>·</span>
            <span>DIEGETIC WORLD &amp; 50-YEAR CANON</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Cinematic Universe &amp; Diegetic Bible
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            A 50-year narrative tapestry of 12 canonical feature films and 3 prestige long-form series, capturing the visceral sensory, physiological, and linguistic evolution of Martian civilization.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('films')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'films'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>12 Films</span>
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'series'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>3 TV Series</span>
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'characters'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Key Characters</span>
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'glossary'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Arean Creole</span>
          </button>
        </div>
      </div>

      {/* Diegetic Audio Leitmotif Synthesizer Bar */}
      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Music className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-200">
              Diegetic Martian Soundtrack Synthesizer (Web Audio API)
            </div>
            <div className="text-[11px] text-slate-400">
              Live harmonic oscillator synthesis tuned to the Martian Sol frequency (46.25 Hz F#1 fundamental)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'sol-0-drone', label: 'The Sol 0 Drone' },
            { id: 'basalt-ostinato', label: 'Basalt Ostinato (7/8)' },
            { id: 'earth-whisper', label: 'Earth Whisper Requiem' },
            { id: '038g-drift', label: '0.38g Drift' },
            { id: 'conjunction-silence', label: 'Conjunction Silence' },
          ].map((motif) => {
            const isPlaying = playingMotif === motif.id;
            return (
              <button
                key={motif.id}
                onClick={() => handleToggleAudio(motif.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{motif.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content: 12 Films */}
      {activeTab === 'films' && (
        <div className="space-y-6">
          {/* Epoch Selector Filter */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {epochs.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelectedEpoch(ep.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                  selectedEpoch === ep.id
                    ? 'bg-slate-100 text-slate-900 border-white font-bold'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {ep.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Film List Column */}
            <div className="lg:col-span-1 space-y-3">
              {filteredFilms.map((film) => {
                const isSelected = selectedFilm?.id === film.id;
                return (
                  <button
                    key={film.id}
                    onClick={() => setSelectedFilm(film)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/80 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-amber-500 font-bold">{film.id}</span>
                      <span className="text-slate-400">{film.solsTimeline}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">{film.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{film.logline}</p>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      {film.epoch}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Film Detailed Dossier */}
            {selectedFilm && (
              <div className="lg:col-span-2 p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
                {/* Hero Still or Poster */}
                {selectedFilm.image && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800">
                    <img
                      src={selectedFilm.image}
                      alt={selectedFilm.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <div className="text-xs font-mono text-amber-400 font-bold mb-1">
                          CANON FEATURE {selectedFilm.id} · {selectedFilm.epoch}
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          {selectedFilm.title}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-700">
                        {selectedFilm.solsTimeline}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Logline
                    </h4>
                    <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                      {selectedFilm.logline}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="text-xs font-mono text-amber-500 font-semibold flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Camera Language &amp; Optics</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedFilm.cameraLanguage}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Color Grading &amp; Lighting</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedFilm.colorGrade}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-xs font-mono text-purple-400 font-semibold">
                      Narrative Conflict &amp; Psychological Arc
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Conflict:</strong> {selectedFilm.narrativeConflict}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Emotional Arc:</strong> {selectedFilm.emotionalArc}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 border-t border-slate-800">
                    <div>
                      <span>CHARACTERS: </span>
                      <span className="text-slate-200">
                        {selectedFilm.primaryCharacters.join(' · ')}
                      </span>
                    </div>
                    <div>
                      <span>TECHNICAL COUPLING: </span>
                      <span className="text-amber-400">{selectedFilm.technicalCoupling}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: 3 TV Series */}
      {activeTab === 'series' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CANON_SERIES.map((series) => (
            <div
              key={series.id}
              className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-500 font-bold">{series.id}</span>
                  <span className="text-slate-400">{series.epochSpan}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{series.title}</h3>
                <div className="text-xs font-mono text-cyan-400">{series.format}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{series.premise}</p>

                <div className="pt-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Season Arcs:
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {series.seasons.map((s) => (
                      <div key={s.seasonNum} className="p-2.5 bg-slate-950 rounded border border-slate-800">
                        <div className="font-bold text-slate-200">
                          Season {s.seasonNum}: {s.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {s.focus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <strong>Historical Impact:</strong> {series.diegeticImpact}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Key Characters */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CANON_CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{char.name}</h3>
                  <div className="text-xs text-amber-500 font-mono mt-0.5">{char.role}</div>
                </div>
                <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
                  {char.origin}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{char.narrativeArc}</p>

              <blockquote className="p-3 bg-slate-950 rounded border border-slate-800 text-xs italic text-slate-200">
                “{char.signatureQuote}”
              </blockquote>

              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[10px] text-center">
                <div>
                  <div className="text-slate-500">Circadian Desync</div>
                  <div className="text-slate-200 font-bold mt-0.5">
                    {(char.homeostaticBaseline.circadianDesync * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Allostatic Load</div>
                  <div className="text-amber-400 font-bold mt-0.5">
                    {(char.homeostaticBaseline.allostaticLoad * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Vestibular Strain</div>
                  <div className="text-slate-200 font-bold mt-0.5">
                    {(char.homeostaticBaseline.vestibularStrain * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Arean Creole Glossary */}
      {activeTab === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AREAN_CREOLE_GLOSSARY.map((term) => (
            <div
              key={term.term}
              className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-bold text-amber-400 font-mono">{term.term}</h3>
                <span className="text-xs text-slate-500 font-mono">{term.phonetic}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{term.definition}</p>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs italic text-slate-400">
                {term.usage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
