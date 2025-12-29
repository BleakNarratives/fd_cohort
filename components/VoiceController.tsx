
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, Radio } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export const VoiceController: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContext = useRef<AudioContext | null>(null);
  const nextStartTime = useRef(0);
  const sessionPromise = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleVoice = async () => {
    if (isActive) {
      setIsActive(false);
      window.location.reload(); // Hard reset for audio stream cleanup
      return;
    }

    setIsConnecting(true);
    try {
      // 1. Initialize Audio Contexts
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContext.current = outCtx;

      // 2. Request Mic Permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Setup Live Session
      sessionPromise.current = geminiService.connectVoice({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          startStreamingInput(inCtx, stream);
        },
        onmessage: async (message: any) => {
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioContext.current) {
            const buffer = await decodeAudioData(decode(audioData), audioContext.current);
            const source = audioContext.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.current.destination);
            const start = Math.max(nextStartTime.current, audioContext.current.currentTime);
            source.start(start);
            nextStartTime.current = start + buffer.duration;
          }
        },
        onclose: () => setIsActive(false),
        onerror: () => setIsActive(false)
      });
    } catch (e) {
      console.error("VOICE_CORE_FAILURE:", e);
      setIsConnecting(false);
    }
  };

  const startStreamingInput = (ctx: AudioContext, stream: MediaStream) => {
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm = createPcmBlob(input);
      sessionPromise.current?.then(session => {
        session.sendRealtimeInput({ media: pcm });
      });
    };
    source.connect(processor);
    processor.connect(ctx.destination);
  };

  return (
    <div className="flex flex-col gap-2">
      <button 
        onClick={toggleVoice}
        className={`w-full p-4 rounded-2xl transition-all border flex items-center justify-between font-black text-[10px] uppercase tracking-widest shadow-2xl relative overflow-hidden group ${
          isActive ? 'bg-emerald-500 border-emerald-400 text-white' : 
          isConnecting ? 'bg-slate-800 border-slate-700 text-slate-400' :
          'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-3 relative z-10">
          {isConnecting ? <Loader2 size={16} className="animate-spin" /> : isActive ? <Radio size={16} className="animate-pulse" /> : <Mic size={16} />}
          <span>{isActive ? 'Live Comms Active' : isConnecting ? 'Establishing Link' : 'Tactical Audio'}</span>
        </div>
        {isActive && <div className="size-2 bg-white rounded-full animate-ping" />}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      {isActive && (
        <p className="text-[9px] text-center font-bold text-emerald-500/50 uppercase tracking-tighter">
          JaneBot is listening... speak your strategy queries.
        </p>
      )}
    </div>
  );
};

// --- Low Level Audio Utils ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
}

function createPcmBlob(data: Float32Array) {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
