
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Radio, Loader2, AlertCircle, Skull, Zap, Waves } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { soundService } from '../services/soundService';
import { decode, decodeAudioData, createBlob } from '../services/audioHelper';

interface VoiceControllerProps {
  onTranscription?: (text: string, isUser: boolean) => void;
  onTriggerAnalysis?: () => void;
  isUnfiltered?: boolean;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({ 
  onTranscription, 
  onTriggerAnalysis,
  isUnfiltered = false 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  
  const outCtxRef = useRef<AudioContext | null>(null);
  const inCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const toggleVoice = async () => {
    if (isActive) {
      cleanup();
      return;
    }

    setIsConnecting(true);
    setError(null);
    soundService.playPowerUp();

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
          if (message.serverContent?.outputTranscription) {
            onTranscription?.(message.serverContent.outputTranscription.text, false);
          } else if (message.serverContent?.inputTranscription) {
            onTranscription?.(message.serverContent.inputTranscription.text, true);
          }

          if (message.serverContent?.interrupted) {
            activeSourcesRef.current.forEach(s => {
              try { s.stop(); } catch(e) {}
            });
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }

          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && outCtxRef.current) {
            const buffer = await decodeAudioData(decode(audioData), outCtxRef.current, 24000, 1);
            const source = outCtxRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outCtxRef.current.destination);
            
            // Critical scheduling for raw PCM streams
            const start = Math.max(nextStartTimeRef.current, outCtxRef.current.currentTime);
            source.start(start);
            nextStartTimeRef.current = start + buffer.duration;
            
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);
          }
        },
        onclose: () => cleanup(),
        onerror: (e: any) => {
          console.error("Live API Error:", e);
          setError("Neural link severed.");
          cleanup();
        }
      }, isUnfiltered);
    } catch (e) {
      setError("Permissions denied.");
      setIsConnecting(false);
    }
  };

  const startStreamingInput = (ctx: AudioContext, stream: MediaStream) => {
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm = createBlob(input);
      sessionPromiseRef.current?.then(session => {
        session.sendRealtimeInput({ media: pcm });
      });

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(average);
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
    setVolume(0);
    soundService.playDigitalClick();
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={toggleVoice}
        className={`w-full p-8 rounded-2xl transition-all border flex items-center justify-between font-dk font-black text-[10px] uppercase tracking-widest shadow-2xl relative overflow-hidden group ${
          isActive ? (isUnfiltered ? 'bg-red-600 border-white text-white' : 'bg-[#00f51d] border-black text-black') : 
          isConnecting ? 'bg-white/5 border-white/10 text-slate-500' :
          'bg-white/5 border-white/10 text-slate-400 hover:text-[#00f51d] hover:border-[#00f51d]'
        }`}
      >
        <div className="flex items-center gap-6 relative z-10">
          {isConnecting ? <Loader2 size={24} className="animate-spin" /> : 
           isActive ? (isUnfiltered ? <Skull size={24} className="animate-pulse" /> : <Zap size={24} className="animate-pulse" />) : <Mic size={24} />}
          <span>{isActive ? (isUnfiltered ? 'DARK_CHANNEL_OPEN' : 'NEURAL_LINK_OK') : isConnecting ? 'SYNCING...' : 'OPEN VOICE CHANNEL'}</span>
        </div>
        
        {isActive && (
          <div className="flex gap-1.5 items-end h-6">
             {[...Array(12)].map((_, i) => (
               <div 
                 key={i} 
                 className={`w-1 rounded-full transition-all duration-75 ${isUnfiltered ? 'bg-white' : 'bg-black'}`}
                 style={{ 
                   height: `${Math.max(4, Math.random() * volume * 0.8)}px`, 
                   opacity: 0.8
                 }}
               />
             ))}
          </div>
        )}
      </button>
      {error && <div className="text-[10px] text-red-500 font-tech font-black uppercase text-center flex items-center justify-center gap-2"><AlertCircle size={14} /> {error}</div>}
    </div>
  );
};
