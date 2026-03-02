import * as Tone from 'tone';

class AudioEngine {
  private nodes: Map<string, Tone.ToneAudioNode> = new Map();
  private masterOut: any = Tone.getDestination();
  private isStarted: boolean = false;
  private analyser: Tone.Analyser = new Tone.Analyser('waveform', 128);

  async start() {
    if (this.isStarted) return;
    await Tone.start();
    this.isStarted = true;
    console.log('Audio engine started');
  }

  createNode(id: string, type: string, data: any) {
    if (this.nodes.has(id)) return;

    let node: Tone.ToneAudioNode;
    switch (type) {
      case 'oscillator':
        node = new Tone.Oscillator(data.frequency || 440, data.type || 'sine').start();
        break;
      case 'filter':
        node = new Tone.Filter(data.frequency || 1000, data.filterType || 'lowpass');
        break;
      case 'delay':
        node = new Tone.FeedbackDelay(data.delayTime || '8n', data.feedback || 0.5);
        break;
      case 'reverb':
        node = new Tone.Reverb(data.decay || 2);
        break;
      case 'neuralSaturator':
        node = new Tone.Distortion(data.distortion || 0.4);
        break;
      case 'output':
        // Output is special, we don't create a new Tone node for it, 
        // we use the master destination. But we need a Gain node as a proxy.
        node = new Tone.Gain(1).toDestination();
        node.connect(this.analyser);
        break;
      default:
        return;
    }

    this.nodes.set(id, node);
  }

  getWaveform() {
    return this.analyser.getValue();
  }

  updateNode(id: string, data: any) {
    const node = this.nodes.get(id);
    if (!node) return;

    if (node instanceof Tone.Oscillator) {
      if (data.frequency !== undefined) node.frequency.rampTo(data.frequency, 0.1);
      if (data.type !== undefined) node.type = data.type;
    }
  }

  removeNode(id: string) {
    const node = this.nodes.get(id);
    if (node) {
      node.disconnect();
      if (node instanceof Tone.Oscillator) {
        node.stop();
        node.dispose();
      }
      this.nodes.delete(id);
    }
  }

  connect(sourceId: string, targetId: string) {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);

    if (source && target) {
      source.connect(target);
    }
  }

  disconnect(sourceId: string, targetId: string) {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);

    if (source && target) {
      source.disconnect(target);
    }
  }

  stop() {
    this.nodes.forEach(node => {
      if (node instanceof Tone.Oscillator) {
        node.stop();
      }
    });
    Tone.getTransport().stop();
  }
}

export const audioEngine = new AudioEngine();
