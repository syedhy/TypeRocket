import { SoundProfile } from "../contexts/GameSettingsContext";

class SoundPlayer {
  private audioContext: AudioContext | null = null;
  private keypressBuffer: AudioBuffer | null = null;

  async init() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch("/keypress.mp3");
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        this.keypressBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      }
    } catch (e) {
      console.warn("Could not initialize audio file, falling back to WebAudio synthesis:", e);
    }
  }

  playKeypress(profile: SoundProfile = "default") {
    if (profile === "silent") return;

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    if (this.keypressBuffer && profile === "default") {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.keypressBuffer;
      source.playbackRate.value = 0.9 + Math.random() * 0.2;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.3;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
      return;
    }

    // Synthesize key sound using Web Audio API oscillators and noise burst
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    switch (profile) {
      case "clicky":
        osc.type = "square";
        osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        break;
      case "typewriter":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(1200 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        break;
      case "soft":
        osc.type = "sine";
        osc.frequency.setValueAtTime(400 + Math.random() * 100, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        break;
      default:
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        break;
    }

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }
}

export const soundPlayer = new SoundPlayer();
