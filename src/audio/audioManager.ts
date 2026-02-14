class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private activeSources: Map<string, AudioBufferSourceNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private engineNode: AudioBufferSourceNode | null = null;
  private engineGain: GainNode | null = null;

  async init() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private async loadSound(name: string, frequency: number): Promise<void> {
    if (!this.audioContext) await this.init();

    const duration = 2;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2);
    }

    this.sounds.set(name, buffer);
  }

  async loadEngineSound(): Promise<void> {
    if (!this.audioContext) await this.init();

    const duration = 2;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const noise = (Math.random() * 2 - 1) * 0.3;
      const rumble = Math.sin(2 * Math.PI * 50 * t) * 0.2;
      const highFreq = Math.sin(2 * Math.PI * 200 * t) * 0.1;
      data[i] = noise + rumble + highFreq;
    }

    this.sounds.set('engine', buffer);
  }

  async loadAllSounds() {
    await this.loadEngineSound();
    await this.loadSound('click', 800);
    await this.loadSound('warning', 440);
    await this.loadSound('success', 523.25);
    await this.loadSound('alarm', 880);
    await this.loadSound('thrust', 100);
  }

  play(name: string, volume: number = 1, loop: boolean = false): void {
    if (!this.audioContext || !this.sounds.has(name)) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds.get(name)!;
    source.loop = loop;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start();
    this.activeSources.set(name, source);
    this.gainNodes.set(name, gainNode);
  }

  stop(name: string): void {
    const source = this.activeSources.get(name);
    const gainNode = this.gainNodes.get(name);

    if (source && gainNode) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.1);
      setTimeout(() => {
        source.stop();
        this.activeSources.delete(name);
        this.gainNodes.delete(name);
      }, 100);
    }
  }

  startEngine(): void {
    if (!this.audioContext || !this.sounds.has('engine')) return;

    this.stopEngine();

    this.engineNode = this.audioContext.createBufferSource();
    this.engineNode.buffer = this.sounds.get('engine')!;
    this.engineNode.loop = true;

    this.engineGain = this.audioContext.createGain();
    this.engineGain.gain.value = 0;

    this.engineNode.connect(this.engineGain);
    this.engineGain.connect(this.audioContext.destination);

    this.engineNode.start();
  }

  stopEngine(): void {
    if (this.engineNode && this.engineGain) {
      this.engineGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.5);
      setTimeout(() => {
        if (this.engineNode) {
          this.engineNode.stop();
          this.engineNode = null;
        }
      }, 500);
    }
  }

  setEngineVolume(volume: number): void {
    if (this.engineGain && this.audioContext) {
      this.engineGain.gain.setTargetAtTime(volume * 0.3, this.audioContext.currentTime, 0.1);
    }
  }

  playClick(): void {
    this.play('click', 0.3);
  }

  playWarning(): void {
    this.play('warning', 0.2);
  }

  playSuccess(): void {
    this.play('success', 0.3);
  }

  playAlarm(): void {
    this.play('alarm', 0.15);
  }

  setMasterVolume(): void {
    if (!this.audioContext) return;
    this.audioContext.destination.connect(this.audioContext.destination as any);
  }

  dispose(): void {
    this.activeSources.forEach((source) => source.stop());
    this.stopEngine();
    this.sounds.clear();
    this.activeSources.clear();
    this.gainNodes.clear();
  }
}

export const audioManager = new AudioManager();
