/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for Diegetic Martian Soundtrack Motifs
class MarsAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentMotifId: string | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private analyser: AnalyserNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeNodes = [];
    this.currentMotifId = null;
  }

  public isPlaying(motifId?: string): boolean {
    if (!motifId) return this.activeNodes.length > 0;
    return this.currentMotifId === motifId && this.activeNodes.length > 0;
  }

  public playMotif(motifId: string) {
    this.initContext();
    this.stop();

    if (!this.ctx || !this.analyser) return;

    this.currentMotifId = motifId;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.35, now + 1.5);
    masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    switch (motifId) {
      case 'sol-0-drone': {
        // Deep sub-bass F#1 drone (46.25 Hz) + slow harmonic beat
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(46.25, now);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(46.65, now); // Slight detune for pulsing Sol beat

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);
        filter.Q.setValueAtTime(4.0, now);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start(now);
        osc2.start(now);

        this.activeNodes.push({
          stop: () => {
            masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.5);
            setTimeout(() => {
              osc1.stop();
              osc2.stop();
            }, 600);
          },
        });
        break;
      }

      case 'basalt-ostinato': {
        // Resonant rock strikes and rhythmic metallic industrial pulse
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now); // A2 fundamental
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(8.0, now);

        // Periodic gain modulation for rhythmic heartbeat (7/8 rhythm)
        pGain.gain.setValueAtTime(0.1, now);

        let step = 0;
        const intervalId = window.setInterval(() => {
          if (!this.ctx || this.currentMotifId !== 'basalt-ostinato') {
            clearInterval(intervalId);
            return;
          }
          const t = this.ctx.currentTime;
          step = (step + 1) % 7;
          if (step === 0 || step === 2 || step === 4) {
            pGain.gain.setValueAtTime(0.6, t);
            pGain.gain.exponentialRampToValueAtTime(0.05, t + 0.15);
          }
        }, 220);

        osc.connect(filter);
        filter.connect(pGain);
        pGain.connect(masterGain);
        osc.start(now);

        this.activeNodes.push({
          stop: () => {
            clearInterval(intervalId);
            osc.stop();
          },
        });
        break;
      }

      case 'earth-whisper': {
        // Melancholic harmonic chord pad with slow vibrato (D minor / F major)
        const freqs = [146.83, 174.61, 220.0, 261.63]; // D3, F3, A3, C4
        const oscs: OscillatorNode[] = [];

        freqs.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq + (idx * 0.2), now);

          gain.gain.setValueAtTime(0.15 / freqs.length, now);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          oscs.push(osc);
        });

        this.activeNodes.push({
          stop: () => {
            oscs.forEach((o) => o.stop());
          },
        });
        break;
      }

      case '038g-drift': {
        // Ascending microtonal ethereal glissandi mimicking low gravity
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 4);
        osc.frequency.exponentialRampToValueAtTime(220, now + 8);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start(now);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, now);
        lfoGain.gain.setValueAtTime(25, now);
        lfo.connect(osc.frequency);
        lfo.start(now);

        this.activeNodes.push({
          stop: () => {
            osc.stop();
            lfo.stop();
          },
        });
        break;
      }

      case 'conjunction-silence': {
        // White/pink noise through high-Q resonant filter mimicking deep space silence
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(380, now);
        filter.Q.setValueAtTime(14.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        whiteNoise.start(now);

        this.activeNodes.push({
          stop: () => {
            whiteNoise.stop();
          },
        });
        break;
      }

      default:
        break;
    }
  }
}

export const audioSynth = new MarsAudioSynthesizer();
