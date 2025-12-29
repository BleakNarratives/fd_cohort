
import React, { useState, useRef } from 'react';
import { Mic, Radio, Loader2, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface VoiceControllerProps {
  onTranscription?: (text: string, isUser: boolean) => void;
  onTriggerAnalysis?: () => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({ onTranscription, onTriggerAnalysis }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const outCtxRef = useRef<AudioContext | null>(null);
  const inCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const toggleVoice = async () => {
    if (isActive) {
      cleanup();
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      await outCtx.resume();
      await inCtx.resume();
      
      outCtxRef.current = outCtx;
      inCtxRef.current = inCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      sessionPromiseRef.current = geminiService.connectVoice({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          startStreamingInput(inCtx, stream);
        },
        onmessage: async (message: any) => {
          if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
              if (fc.name === 'trigger_analysis') {
                onTriggerAnalysis?.();
                sessionPromiseRef.current?.then(session => {
                  session.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: { result: "Market analysis updated." },
                    }
                  });
                });
              }
            }
          }

          if (message.serverContent?.outputTranscription) {
            onTranscription?.(message.serverContent.outputTranscription.text, false);
          } else if (message.serverContent?.inputTranscription) {
            onTranscription?.(message.serverContent.inputTranscription.text, true);
          }

          if (message.serverContent?.interrupted) {
            activeSourcesRef.current.forEach(s => s.stop());
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }

          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && outCtxRef.current) {
            /**
             * FIX: Use guideline-compliant audio decoding method.
             */
            const buffer = await decodeAudioData(decode(audioData), outCtxRef.current, 24000, 1);
            const source = outCtxRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outCtxRef.current.destination);
            
            const start = Math.max(nextStartTimeRef.current, outCtxRef.current.currentTime);
            source.start(start);
            nextStartTimeRef.current = start + buffer.duration;
            
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);
          }
        },
        onclose: () => cleanup(),
        onerror: (e: any) => {
          console.error("VOICE_SESSION_ERROR:", e);
          setError("Connection failed.");
          cleanup();
        }
      });
    } catch (e) {
      console.error("VOICE_BOOT_FAILURE:", e);
      setError("Microphone required.");
      setIsConnecting(false);
    }
  };

  const startStreamingInput = (ctx: AudioContext, stream: MediaStream) => {
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm = createBlob(input);
      /**
       * FIX: Strictly rely on sessionPromise resolution for sending input.
       */
      sessionPromiseRef.current?.then(session => {
        session.sendRealtimeInput({ media: pcm });
      });
    };
    source.connect(processor);
    processor.connect(ctx.destination);
  };

  const cleanup = () => {
    setIsActive(false);
    setIsConnecting(false);
    outCtxRef.current?.close();
    inCtxRef.current?.close();
    sessionPromiseRef.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      <button 
        onClick={toggleVoice}
        className={`w-full p-4 rounded-2xl transition-all border flex items-center justify-between font-bold text-[12px] uppercase tracking-wide shadow-xl relative overflow-hidden group ${
          isActive ? 'bg-emerald-600 border-emerald-500 text-white' : 
          isConnecting ? 'bg-slate-800 border-slate-700 text-slate-500' :
          'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-blue-500/50'
        }`}
      >
        <div className="flex items-center gap-3 relative z-10">
          {isConnecting ? <Loader2 size={18} className="animate-spin" /> : 
           isActive ? <Radio size={18} className="animate-pulse" /> : <Mic size={18} />}
          <span>{isActive ? 'Analysis Online' : isConnecting ? 'Connecting...' : 'Voice Command'}</span>
        </div>
        {isActive && <div className="flex gap-1.5 px-2">
          <div className="size-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="size-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="size-1.5 bg-white rounded-full animate-bounce" />
        </div>}
      </button>
      {error && <div className="text-[10px] text-red-500 font-bold uppercase flex items-center justify-center gap-1.5"><AlertCircle size={12} /> {error}</div>}
      {isActive && (
        <p className="text-[9px] text-center font-bold text-emerald-400/80 uppercase tracking-widest animate-pulse">
          Listening for analysis request...
        </p>
      )}
    </div>
  );
};

// --- Binary & Audio Processing Utils (Follows Gemini API Guidelines) ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
