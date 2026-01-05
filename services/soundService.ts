
export class SoundService {
  private ctx: AudioContext | null = null;
  private shift = 1.0;

  public async resume() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  public playIntroSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Low rumble
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(30 * this.shift, now);
    sub.frequency.exponentialRampToValueAtTime(60 * this.shift, now + 3);
    
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
    subGain.gain.linearRampToValueAtTime(0, now + 4);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 4);

    // Electronic shuffle sparkles
    for(let i=0; i<20; i++) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random()*2000, now + i*0.1);
        g.gain.setValueAtTime(0.02, now + i*0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.05);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + i*0.1);
        osc.stop(now + i*0.1 + 0.05);
    }
  }

  public playHover() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 * this.shift, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playDataCrunch() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Rapid electronic clicks (simulating chip stacking)
    for (let i = 0; i < 12; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime((1200 + Math.random() * 400) * this.shift, now + i * 0.03);
      gain.gain.setValueAtTime(0.01, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.02);
    }
  }

  public playJackpot() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50].map(f => f * this.shift); // C Major
    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 1.0);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 1.0);
    });
  }

  public playDigitalClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 * this.shift, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300 * this.shift, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playPowerUp() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100 * this.shift, now);
    osc.frequency.exponentialRampToValueAtTime(1000 * this.shift, now + 0.5);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.5);
  }
}

export const soundService = new SoundService();
