
import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import StatusDisplay from './components/StatusDisplay';
import { transcribeAudio, correctText } from './services/groqService';
import { textToSpeech } from './services/elevenLabsService';
import { AudioLines, Keyboard, Volume2, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false, colorClass = "text-indigo-600" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-card glass-card-hover overflow-hidden ring-1 ring-white/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 border-b border-white/40 bg-white/30 flex items-center justify-between hover:bg-white/50 transition-colors group"
      >
        <div className="flex items-center gap-3 text-slate-700">
          <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${isOpen ? 'bg-white shadow-md' : 'bg-white/50'}`}>
            {Icon && <Icon size={20} className={colorClass} />}
          </div>
          <span className="text-base font-bold tracking-tight">{title}</span>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-slate-400 group-hover:text-indigo-500" />
        </div>
      </button>

      <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 border-t border-white/20 bg-white/20">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [transcribedText, setTranscribedText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [correctedAudioUrl, setCorrectedAudioUrl] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleRecordingComplete = async (blob) => {
    setError(null);
    setTranscribedText('');
    setCorrectedText('');
    setCorrectedAudioUrl(null);
    setStatus('transcribing');

    try {
      const text = await transcribeAudio(blob);
      setTranscribedText(text);
      setStatus('correcting');

      const corrected = await correctText(text);
      setCorrectedText(corrected);

      setStatus('generating_audio');
      const audioUrl = await textToSpeech(corrected);
      setCorrectedAudioUrl(audioUrl);
      setStatus('completed');

      // Auto-hide status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);

    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden bg-slate-50">

      {/* Vibrant Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-300/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-70" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-300/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-70" />

      <div className="w-full max-w-6xl space-y-10 z-10">

        {/* Header - Minimal but colorful icon */}
        <div className="flex flex-col items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-indigo-200/50 ring-4 ring-indigo-50 transform hover:scale-105 transition-transform duration-300">
            <AudioLines className="text-indigo-600" size={32} />
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Input & Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-1.5 ring-1 ring-white/60 bg-gradient-to-br from-white/80 to-indigo-50/50">
              <div className="p-8 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Input Source
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">Capture or upload your audio.</p>
                </div>
                <div className="flex justify-center py-4">
                  <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                </div>
              </div>
            </div>

            <StatusDisplay status={status} error={error} />

            {/* Audio Player Card */}
            {correctedAudioUrl && (
              <div className="glass-card p-6 animate-in fade-in slide-in-from-top-4 duration-500 ring-1 ring-white/60 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Refined Speech</h3>
                      <p className="text-xs text-indigo-100 font-medium opacity-80">ElevenLabs Generation</p>
                    </div>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                </div>
                <div className="bg-black/20 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                  <audio src={correctedAudioUrl} controls className="w-full h-8 accent-white invert-[.1]" />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Output (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. Transcribed Text */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${transcribedText ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'}`}>
              <AccordionItem title="Raw Transcription" icon={Keyboard} defaultOpen={false} colorClass="text-slate-500">
                <p className="text-slate-600 leading-relaxed font-mono text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {transcribedText || "Waiting for audio input..."}
                </p>
              </AccordionItem>
            </div>

            {/* 2. Corrected Text */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${correctedText ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'}`}>
              <AccordionItem title="Refined Output" icon={Sparkles} defaultOpen={true} colorClass="text-fuchsia-500">
                <div className="leading-relaxed text-lg font-medium text-slate-800">
                  {correctedText ? (
                    <div className="relative">
                      <span className="absolute -left-4 -top-4 text-6xl text-indigo-100 font-serif quote opacity-50 z-0">“</span>
                      <p className="relative z-10">{correctedText}</p>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Refined text will appear here...</span>
                  )}
                </div>
              </AccordionItem>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
