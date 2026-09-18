// Procedural Web Audio API sound synthesizer for Dig & Diamond
// No external assets required, 100% reliable in mobile and desktop browsers

class SoundController {
  private ctx: AudioContext | null = null;
  public soundEnabled = true;
  public musicEnabled = true;
  private musicInterval: number | null = null;
  private musicStep = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Dirt digging sound with tool-specific procedural acoustic synthesis
  playDig(toolId?: string) {
    if (toolId === 'drill') {
      this.playDrillDig();
      return;
    }
    if (toolId === 'small_brush' || toolId === 'big_brush') {
      this.playBrushSweep(toolId === 'big_brush');
      return;
    }
    if (toolId === 'rake') {
      this.playRakeScrape();
      return;
    }
    if (toolId === 'pickaxe') {
      this.playPickaxeStrike();
      return;
    }
    if (toolId === 'excavator') {
      this.playExcavatorDig();
      return;
    }
    if (toolId === 'legendary_tool') {
      this.playLegendaryDig();
      return;
    }

    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // White noise buffer for soil crunch
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + Math.random() * 200, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);

      // Thud sub-oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      // Golden Shovel sparkle chime
      if (toolId === 'golden_shovel') {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(1200 + Math.random() * 400, now);
        chime.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
        chimeGain.gain.setValueAtTime(0.15, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now);
        chime.stop(now + 0.12);
      }
    } catch {
      // AudioContext catch
    }
  }

  // Brush sweeping sound (soft whispery bristle whoosh)
  playBrushSweep(isBig = false) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = isBig ? 0.15 : 0.09;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(isBig ? 1200 : 2200, now);
      bandpass.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isBig ? 0.35 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {}
  }

  // Garden Rake scrape sound (metallic multi-tine scratch)
  playRakeScrape() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.14;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const tineBurst = (i % 280 < 140) ? 1.0 : 0.4;
        output[i] = (Math.random() * 2 - 1) * tineBurst;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {}
  }

  // Heavy Pickaxe Strike (sharp metallic ping + fractured rock thud)
  playPickaxeStrike() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Metallic ping
      const ping = ctx.createOscillator();
      const pingGain = ctx.createGain();
      ping.type = 'triangle';
      ping.frequency.setValueAtTime(880 + Math.random() * 120, now);
      ping.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      pingGain.gain.setValueAtTime(0.5, now);
      pingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      ping.connect(pingGain);
      pingGain.connect(ctx.destination);
      ping.start(now);
      ping.stop(now + 0.12);

      // Heavy rock crack
      const crackOsc = ctx.createOscillator();
      const crackGain = ctx.createGain();
      crackOsc.type = 'sawtooth';
      crackOsc.frequency.setValueAtTime(140, now);
      crackOsc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

      crackGain.gain.setValueAtTime(0.45, now);
      crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      crackOsc.connect(crackGain);
      crackGain.connect(ctx.destination);
      crackOsc.start(now);
      crackOsc.stop(now + 0.15);
    } catch {}
  }

  // Giant Excavator Scoop sound (heavy diesel rumble + massive hydraulic crunch)
  playExcavatorDig() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.22;

      // 1. Deep sub engine rumble
      const engine = ctx.createOscillator();
      const engineGain = ctx.createGain();
      engine.type = 'sawtooth';
      engine.frequency.setValueAtTime(65, now);
      engine.frequency.exponentialRampToValueAtTime(35, now + duration);

      engineGain.gain.setValueAtTime(0.6, now);
      engineGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      engine.connect(engineGain);
      engineGain.connect(ctx.destination);
      engine.start(now);
      engine.stop(now + duration);

      // 2. Heavy dirt avalanche noise
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + duration);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.55, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Legendary Celestial Tool Dig sound (harmonic resonant chime + shockwave)
  playLegendaryDig() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chord = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.2);

        gain.gain.setValueAtTime(0.18, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.02);
        osc.stop(now + 0.26);
      });
    } catch {}
  }

  // Specialized mechanical Drill digging sound (high-torque motor hum + rapid pneumatic bit vibration & metallic chatter)
  playDrillDig() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. High-frequency pneumatic motor whine (sawtooth)
      const motorOsc = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motorOsc.type = 'sawtooth';
      motorOsc.frequency.setValueAtTime(320 + Math.random() * 40, now);
      motorOsc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      motorGain.gain.setValueAtTime(0.32, now);
      motorGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      // 2. Deep mechanical rumble / vibration (square wave sub)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'square';
      subOsc.frequency.setValueAtTime(95, now);
      subOsc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      subGain.gain.setValueAtTime(0.22, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      // 3. Metallic drill bit chatter / grind noise
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // rapid teeth grind pattern
        const bitPulse = (i % 24 < 12) ? 1.0 : 0.2;
        output[i] = (Math.random() * 2 - 1) * bitPulse * Math.exp(-i / (bufferSize * 0.5));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1600, now);
      bandpass.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      motorOsc.connect(motorGain);
      motorGain.connect(ctx.destination);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      motorOsc.start(now);
      motorOsc.stop(now + 0.12);
      subOsc.start(now);
      subOsc.stop(now + 0.12);
      noise.start(now);
    } catch {}
  }

  // Rock hit sound (hard metallic/stone clink)
  playRockHit() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Sparkling diamond reveal sound
  playDiamondFound() {
    this.playDiamondBigReveal();
  }

  // Sparkling diamond hint shimmer
  playDiamondShimmer() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02]; // C6, E6, G6, C7, E7
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.01, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.3);
      });
    } catch {}
  }

  // Grand cinematic diamond discovery crescendo
  playDiamondBigReveal() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [587.33, 739.99, 880, 1174.66, 1479.98, 1760.0, 2217.46]; // D5 to C#7 shimmering fanfare
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        gain.gain.setValueAtTime(0.01, now + idx * 0.045);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.045 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.38);
      });
    } catch {}
  }

  // Diamond flying swoosh towards counter
  playDiamondSwoop() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Diamond collected chime
  playDiamondCollect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [880, 1318.51, 1760]; // A5, E6, A6
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.05);

        gain.gain.setValueAtTime(0.25, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.22);
      });
    } catch {}
  }

  // Creature surprise (funny cartoon boing / pop)
  playCreatureSurprise() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // Heart life lost (comical uh-oh thud)
  playLifeLost() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Shovel snaps & breaks (sharp wood snap crunch + metal shatter)
  playShovelBreak() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 1. Sharp wooden snap / crunch
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.2);
      gain1.gain.setValueAtTime(0.45, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.24);

      // 2. Metallic snap clang
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      gain2.gain.setValueAtTime(0.4, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.4);
    } catch {}
  }

  // Shovel planted firmly in ground with celebratory stars
  playShovelPlant() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 1. Resonant earth impact thud
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.22);
      gain1.gain.setValueAtTime(0.55, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.26);

      // 2. Metallic blade ring
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(740, now);
      osc2.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.4);

      // 3. Magical starry chime cascade
      const starPitches = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      starPitches.forEach((freq, i) => {
        const starOsc = ctx.createOscillator();
        const starGain = ctx.createGain();
        starOsc.type = 'triangle';
        starOsc.frequency.setValueAtTime(freq, now + 0.08 + i * 0.06);
        starGain.gain.setValueAtTime(0.2, now + 0.08 + i * 0.06);
        starGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + i * 0.06 + 0.3);
        starOsc.connect(starGain);
        starGain.connect(ctx.destination);
        starOsc.start(now + 0.08 + i * 0.06);
        starOsc.stop(now + 0.08 + i * 0.06 + 0.32);
      });
    } catch {}
  }

  // Level complete victory fanfare!
  playLevelComplete() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.12, t: 0 },    // C5
        { f: 659.25, d: 0.12, t: 0.12 }, // E5
        { f: 783.99, d: 0.12, t: 0.24 }, // G5
        { f: 1046.50, d: 0.35, t: 0.36 }, // C6
        { f: 880, d: 0.15, t: 0.72 },    // A5
        { f: 1046.50, d: 0.45, t: 0.88 }, // C6
      ];

      fanfare.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, now + item.t);

        gain.gain.setValueAtTime(0.28, now + item.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + item.t);
        osc.stop(now + item.t + item.d + 0.02);
      });
    } catch {}
  }

  // Game over gentle cartoon sad sequence
  playGameOver() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 440, t: 0 },
        { f: 415.3, t: 0.2 },
        { f: 392, t: 0.4 },
        { f: 349.23, t: 0.65 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.25, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.3);
      });
    } catch {}
  }

  // Wooden button click pop
  playButtonClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  // Shop purchase sound (cash register / bell chime)
  playShopPurchase() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [987.77, 1318.51, 1975.53].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.3, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch {}
  }

  // Equip sound
  playEquip() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // Energetic, upbeat, long 64-step adventure music loop (Marimba lead, bouncing bass & rhythm)
  startMusic() {
    if (this.musicInterval !== null) return;
    if (!this.musicEnabled) return;

    // 64-step cheerful adventure melody (4 distinct phrases: A, B, C, D)
    const melody: Array<{ note: number; bass?: number }> = [
      // Phrase A - Upbeat Main Theme
      { note: 523.25, bass: 130.81 }, // C5, C3
      { note: 659.25 },               // E5
      { note: 783.99 },               // G5
      { note: 1046.50 },              // C6
      { note: 987.77, bass: 196.00 },  // B5, G3
      { note: 783.99 },               // G5
      { note: 880.00 },               // A5
      { note: 783.99 },               // G5
      { note: 659.25, bass: 220.00 },  // E5, A3
      { note: 523.25 },               // C5
      { note: 587.33 },               // D5
      { note: 659.25 },               // E5
      { note: 783.99, bass: 174.61 },  // G5, F3
      { note: 698.46 },               // F5
      { note: 659.25 },               // E5
      { note: 587.33 },               // D5

      // Phrase B - Joyful Climbing Rise
      { note: 659.25, bass: 130.81 }, // E5, C3
      { note: 783.99 },               // G5
      { note: 1046.50 },              // C6
      { note: 1318.51 },              // E6
      { note: 1174.66, bass: 196.00 }, // D6, G3
      { note: 987.77 },               // B5
      { note: 1046.50 },              // C6
      { note: 880.00 },               // A5
      { note: 698.46, bass: 174.61 },  // F5, F3
      { note: 880.00 },               // A5
      { note: 1046.50 },              // C6
      { note: 987.77 },               // B5
      { note: 783.99, bass: 196.00 },  // G5, G3
      { note: 659.25 },               // E5
      { note: 587.33 },               // D5
      { note: 523.25 },               // C5

      // Phrase C - Playful Syncopated Bounce
      { note: 783.99, bass: 220.00 }, // G5, A3
      { note: 783.99 },               // G5
      { note: 880.00 },               // A5
      { note: 783.99 },               // G5
      { note: 1046.50, bass: 174.61 },// C6, F3
      { note: 659.25 },               // E5
      { note: 783.99 },               // G5
      { note: 659.25 },               // E5
      { note: 698.46, bass: 130.81 }, // F5, C3
      { note: 698.46 },               // F5
      { note: 783.99 },               // G5
      { note: 698.46 },               // F5
      { note: 880.00, bass: 196.00 }, // A5, G3
      { note: 698.46 },               // F5
      { note: 587.33 },               // D5
      { note: 493.88 },               // B4

      // Phrase D - Triumphant Turnaround
      { note: 523.25, bass: 130.81 }, // C5, C3
      { note: 659.25 },               // E5
      { note: 783.99 },               // G5
      { note: 987.77 },               // B5
      { note: 1046.50, bass: 220.00 },// C6, A3
      { note: 1318.51 },              // E6
      { note: 1174.66 },              // D6
      { note: 1046.50 },              // C6
      { note: 987.77, bass: 174.61 }, // B5, F3
      { note: 880.00 },               // A5
      { note: 783.99 },               // G5
      { note: 698.46 },               // F5
      { note: 659.25, bass: 196.00 }, // E5, G3
      { note: 587.33 },               // D5
      { note: 392.00 },               // G4
      { note: 523.25 },               // C5
    ];

    this.musicStep = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled) {
        this.stopMusic();
        return;
      }
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      try {
        const now = ctx.currentTime;
        const current = melody[this.musicStep % melody.length];
        this.musicStep++;

        // Upbeat Marimba Lead Tone
        if (current.note) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle'; // Warm, resonant wooden marimba timbre
          osc.frequency.setValueAtTime(current.note, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.038, now + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.24);
        }

        // Bouncing Bass Note
        if (current.bass) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();

          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(current.bass, now);

          bassGain.gain.setValueAtTime(0.0001, now);
          bassGain.gain.linearRampToValueAtTime(0.048, now + 0.015);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.38);
        }

        // Soft perc tick on alternating beats for lively marching rhythm
        if (this.musicStep % 2 === 0) {
          const percOsc = ctx.createOscillator();
          const percGain = ctx.createGain();
          percOsc.type = 'sine';
          percOsc.frequency.setValueAtTime(1200, now);
          percOsc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

          percGain.gain.setValueAtTime(0.008, now);
          percGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

          percOsc.connect(percGain);
          percGain.connect(ctx.destination);
          percOsc.start(now);
          percOsc.stop(now + 0.04);
        }
      } catch {}
    }, 190);
  }

  playPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Dynamite fuse sizzling sound
  playDynamiteFuse() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.6);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1 : 0.2);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2500, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Massive Dynamite explosion sound
  playDynamiteExplosion() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // 1. Heavy noise blast
      const bufferSize = Math.floor(ctx.sampleRate * 0.8);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.7);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      // 2. Sub-bass boom
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

      oscGain.gain.setValueAtTime(0.9, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  }

  // Hint magic discovery shimmer
  playHintShine() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.55);
      });
    } catch {}
  }

  // Mole defeated comical cartoon sound
  playMoleDefeat() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Slide down whistle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);

      // Poof noise
      const bufferSize = Math.floor(ctx.sampleRate * 0.2);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const out = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) out[i] = (Math.random() * 2 - 1);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.2, now);
      nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      noise.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Diamond escaping / fleeing cartoon whoosh
  playGemEscape() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundController();
