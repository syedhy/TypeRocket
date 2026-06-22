class SoundPlayer {
  private audioContext: AudioContext | null = null;
  private keypressBuffer: AudioBuffer | null = null;

  async init() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch('/keypress.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.keypressBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn('Could not initialize audio:', e);
    }
  }

  playKeypress() {
    if (!this.audioContext || !this.keypressBuffer) return;
    
    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.keypressBuffer;
    
    // Add a little pitch variation to make it sound natural
    source.playbackRate.value = 0.9 + Math.random() * 0.2;
    
    // Slight gain reduction so it's not too loud
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.3;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(0);
  }
}

export const soundPlayer = new SoundPlayer();
