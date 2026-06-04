/**
 * Deepgram Real-Time Speech-to-Text Client for RETREIVE
 *
 * Manages a WebSocket connection to Deepgram's live transcription API.
 * The browser fetches an ephemeral key from /api/deepgram/token, then
 * opens a WebSocket directly to Deepgram — the master API key is never
 * exposed to the client.
 *
 * Usage:
 *   const client = new DeepgramSTTClient();
 *   await client.start(onTranscript, onError);
 *   // ... later:
 *   client.stop();
 */

export type TranscriptCallback = (words: string[], isFinal: boolean) => void;
export type ErrorCallback = (error: string) => void;
export type StatusCallback = (status: DeepgramStatus) => void;

export type DeepgramStatus =
  | 'idle'
  | 'requesting-token'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'stopping'
  | 'error'
  | 'stopped';

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

interface DeepgramTranscriptResult {
  channel: {
    alternatives: Array<{
      transcript: string;
      words: DeepgramWord[];
      confidence: number;
    }>;
  };
  is_final: boolean;
  speech_final?: boolean;
}

const DEEPGRAM_WS_URL = 'wss://api.deepgram.com/v1/listen';

const DEFAULT_OPTIONS = {
  model: 'nova-2',
  language: 'en-US',
  smart_format: true,
  interim_results: true,
  endpointing: 300,        // ms of silence before speech_final=true
  utterance_end_ms: 1000,  // ms of silence before sending utterance_end
  vad_events: true,
  encoding: 'linear16',
  sample_rate: 16000,
  channels: 1,
};

export class DeepgramSTTClient {
  private ws: WebSocket | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private status: DeepgramStatus = 'idle';
  private onStatusChange: StatusCallback | null = null;

  private setStatus(s: DeepgramStatus) {
    this.status = s;
    this.onStatusChange?.(s);
  }

  getStatus(): DeepgramStatus {
    return this.status;
  }

  onStatus(cb: StatusCallback) {
    this.onStatusChange = cb;
  }

  /**
   * Fetch an ephemeral Deepgram token from the server.
   * The server uses the master API key to generate a short-lived token.
   */
  private async fetchEphemeralToken(idToken: string): Promise<string> {
    this.setStatus('requesting-token');

    const response = await fetch('/api/deepgram/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Token request failed' }));
      throw new Error(error.error || 'Failed to get Deepgram token');
    }

    const { key } = await response.json();
    return key;
  }

  /**
   * Start recording and transcription.
   *
   * @param idToken   - Firebase ID token for auth
   * @param onTranscript - Called with each batch of transcribed words
   * @param onError   - Called if a fatal error occurs
   */
  async start(
    idToken: string,
    onTranscript: TranscriptCallback,
    onError: ErrorCallback
  ): Promise<void> {
    if (this.status !== 'idle' && this.status !== 'stopped' && this.status !== 'error') {
      console.warn('DeepgramSTTClient: already running');
      return;
    }

    try {
      // Step 1: Get ephemeral API token
      const ephemeralKey = await this.fetchEphemeralToken(idToken);

      // Step 2: Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Step 3: Build WebSocket URL with query params
      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(DEFAULT_OPTIONS).map(([k, v]) => [k, String(v)])
        ),
      });

      const wsUrl = `${DEEPGRAM_WS_URL}?${params.toString()}`;

      // Step 4: Open WebSocket
      this.setStatus('connecting');
      this.ws = new WebSocket(wsUrl, ['token', ephemeralKey]);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        this.setStatus('connected');
        this._startAudioCapture(onError);
        this.setStatus('listening');
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data as string) as DeepgramTranscriptResult;

          if (message.channel?.alternatives?.[0]) {
            const alt = message.channel.alternatives[0];
            if (alt.transcript && alt.transcript.trim().length > 0) {
              const words = alt.words?.map((w) => w.word) ?? alt.transcript.split(' ');
              onTranscript(words, message.is_final);
            }
          }
        } catch {
          // Non-JSON message (e.g. metadata), ignore
        }
      };

      this.ws.onerror = (event) => {
        console.error('Deepgram WebSocket error:', event);
        this.setStatus('error');
        onError('Speech recognition connection error. Please check your microphone and try again.');
        this.stop();
      };

      this.ws.onclose = (event) => {
        if (this.status !== 'stopping' && this.status !== 'stopped') {
          if (event.code === 1008) {
            onError('Authentication failed. Please refresh and try again.');
          } else if (event.code === 1011) {
            onError('Deepgram server error. Please try again.');
          } else if (!event.wasClean) {
            onError('Speech recognition disconnected unexpectedly.');
          }
        }
        this.setStatus('stopped');
        this._cleanup();
      };
    } catch (err) {
      this.setStatus('error');
      const message = err instanceof Error ? err.message : 'Unknown error';

      if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
        onError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (message.includes('NotFoundError') || message.includes('DevicesNotFoundError')) {
        onError('No microphone found. Please connect a microphone and try again.');
      } else {
        onError(`Speech recognition failed: ${message}`);
      }

      this._cleanup();
      throw err;
    }
  }

  /**
   * Start capturing audio from the microphone and send PCM data to Deepgram.
   */
  private _startAudioCapture(onError: ErrorCallback) {
    if (!this.mediaStream) return;

    try {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Use ScriptProcessorNode for broad browser compatibility
      // (future: replace with AudioWorklet for better performance)
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (event) => {
        if (this.ws?.readyState !== WebSocket.OPEN) return;

        // Get mono PCM float32 data
        const inputData = event.inputBuffer.getChannelData(0);

        // Convert float32 to int16 (linear16 encoding expected by Deepgram)
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }

        this.ws.send(int16Data.buffer);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (err) {
      onError('Failed to capture audio. Please try again.');
      console.error('Audio capture error:', err);
    }
  }

  /**
   * Stop recording and close the WebSocket connection.
   */
  stop() {
    this.setStatus('stopping');

    // Send close message to Deepgram (signals end of audio stream)
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'CloseStream' }));
      // Give Deepgram time to process remaining audio
      setTimeout(() => {
        this.ws?.close(1000, 'User stopped recording');
      }, 500);
    }

    this._cleanup();
    this.setStatus('stopped');
  }

  private _cleanup() {
    // Disconnect audio processor
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    // Stop all microphone tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }
}

/**
 * Singleton instance for use in the reader screen.
 * Prevents multiple concurrent WebSocket connections.
 */
let _singletonClient: DeepgramSTTClient | null = null;

export function getDeepgramClient(): DeepgramSTTClient {
  if (!_singletonClient) {
    _singletonClient = new DeepgramSTTClient();
  }
  return _singletonClient;
}

export function destroyDeepgramClient() {
  if (_singletonClient) {
    _singletonClient.stop();
    _singletonClient = null;
  }
}
