type AudioListener = () => void

class AudioEngine {
  private readonly audio = new Audio()

  constructor() {
    this.audio.preload = 'metadata'
  }

  get element(): HTMLAudioElement {
    return this.audio
  }

  load(src: string) {
    if (this.audio.src !== src) {
      this.audio.src = src
      this.audio.load()
    }
  }

  async play() {
    await this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  seek(seconds: number) {
    this.audio.currentTime = Math.max(0, seconds)
  }

  setVolume(volume: number) {
    this.audio.volume = Math.min(1, Math.max(0, volume))
  }

  on(event: keyof HTMLMediaElementEventMap, listener: AudioListener): () => void {
    this.audio.addEventListener(event, listener)
    return () => this.audio.removeEventListener(event, listener)
  }
}

export const audioEngine = new AudioEngine()
