
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sustainabilityChat } from '../services/geminiService';

interface GroundingLink {
  uri: string;
  title: string;
}

interface ExtendedChatMessage extends ChatMessage {
  sources?: GroundingLink[];
}

interface SustainabilityAssistantProps {
  onBack: () => void;
}

const SustainabilityAssistant: React.FC<SustainabilityAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    { role: 'model', text: "Salut ! Je suis ton Assistant Sentinelle Verte. Pose-moi n'importe quelle question sur le recyclage ou l'environnement en Côte d'Ivoire." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await sustainabilityChat(messages, userMsg);
      
      const groundingSources: GroundingLink[] = [];
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach(chunk => {
        if (chunk.web) {
          groundingSources.push({
            uri: chunk.web.uri,
            title: chunk.web.title
          });
        }
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "", 
        sources: groundingSources.length > 0 ? groundingSources : undefined 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, j'ai eu un petit souci technique. Réessaie plus tard !" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark font-display text-white overflow-hidden">
      <header className="px-6 py-6 border-b border-white/5 flex items-center gap-4 bg-background-dark/80 backdrop-blur-xl z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-lg font-black italic tracking-tighter uppercase">Assistant <span className="text-primary">Sentinelle</span></h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">En Ligne • Search Actif</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] space-y-3`}>
              <div className={`px-6 py-4 rounded-[32px] text-sm shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-primary text-background-dark font-bold rounded-tr-none' 
                  : 'bg-surface-dark text-slate-200 font-medium rounded-tl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
              
              {msg.sources && (
                <div className="flex flex-wrap gap-2 px-2">
                  {msg.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[10px] text-primary">link</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[120px]">{source.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-dark px-6 py-4 rounded-[32px] rounded-tl-none border border-white/5 flex gap-1 items-center">
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></span>
              <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Recherche en cours...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      <div className="p-6 pb-10 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
        <div className="flex gap-3 bg-surface-dark p-2 rounded-[32px] border border-white/10 shadow-2xl items-center">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Trouve un centre à Cocody..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 placeholder:text-slate-600 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="size-12 rounded-full bg-primary text-background-dark flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all shadow-lg"
          >
            <span className="material-symbols-outlined font-black">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityAssistant;
