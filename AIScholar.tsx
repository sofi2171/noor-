
import React from 'react';
import { Send, User, Bot, Loader2, Sparkles, Plus, Mic, AudioLines, Image as ImageIcon, Code, FileText, ChevronRight, Share2, Copy, Check } from 'lucide-react';
import { getAIscholarResponse } from '../services/geminiService';
import { Language } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
    lang: Language;
}

const AIScholar: React.FC<Props> = ({ lang }) => {
  const isUrdu = lang === 'ur';
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const quickPrompts = [
    { text: isUrdu ? 'تصویر کی وضاحت' : 'Image Prompt', icon: <ImageIcon size={18} />, query: 'Generate a description for an Islamic geometric art' },
    { text: isUrdu ? 'حدیث کی معلومات' : 'Hadith Info', icon: <Code size={18} />, query: 'Tell me a Hadith about kindness to neighbors.' },
    { text: isUrdu ? 'خلاصہ کریں' : 'Summarize', icon: <FileText size={18} />, query: 'Summarize the Five Pillars of Islam briefly.' },
    { text: isUrdu ? 'تاریخی واقعہ' : 'History', icon: <ChevronRight size={18} />, query: 'Tell me about the Battle of Badr' },
  ];

  React.useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSubmit = customQuery || input;
    if (!queryToSubmit.trim() || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: queryToSubmit }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await getAIscholarResponse(queryToSubmit, lang);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: isUrdu ? "معذرت، سسٹم میں دشواری ہے۔" : "Sorry, I encountered an error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl">
      
      {/* Scrollable Message History */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-4 md:px-10 py-10 space-y-12 no-scrollbar"
      >
        {messages.length === 0 ? (
          /* Welcome Central Screen */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
             <div className="w-20 h-20 bg-emerald-900 rounded-3xl flex items-center justify-center text-amber-400 shadow-2xl ring-8 ring-emerald-50">
                <Bot size={40} />
             </div>
             <div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
                  {isUrdu ? 'میں آپ کی کیا مدد کر سکتا ہوں؟' : 'What can I help with?'}
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                    {isUrdu ? 'آپ کا ڈیجیٹل اسلامی عالم' : 'Your Digital Islamic Scholar'}
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(undefined, p.query)}
                    className="flex items-center gap-3 px-6 py-5 bg-white border border-slate-200 rounded-3xl text-sm font-black text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-right md:text-left shadow-sm group"
                  >
                    <span className="text-emerald-600 group-hover:scale-110 transition-transform">{p.icon}</span>
                    <span className="flex-1">{p.text}</span>
                  </button>
                ))}
             </div>
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="space-y-12">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${m.role === 'user' ? (isUrdu ? 'flex-row' : 'flex-row-reverse') : (isUrdu ? 'flex-row-reverse' : 'flex-row')}`}
              >
                <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-md ${
                  m.role === 'user' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-900 text-white'
                }`}>
                  {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`group flex flex-col ${m.role === 'user' ? (isUrdu ? 'items-start' : 'items-end') : (isUrdu ? 'items-end' : 'items-start')} max-w-[85%] md:max-w-[80%]`}>
                  <div className={`px-6 py-4 md:px-8 md:py-6 rounded-[2rem] ${
                    m.role === 'user' 
                      ? 'bg-amber-400 text-emerald-950 rounded-tr-none shadow-lg shadow-amber-400/10' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    <p className={`text-base md:text-xl leading-relaxed md:leading-[1.8] ${isUrdu ? 'font-urdu' : 'font-medium'}`}>
                      {m.content}
                    </p>
                  </div>
                  
                  {m.role === 'assistant' && (
                    <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => copyToClipboard(m.content, i)} 
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Copy"
                        >
                            {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Share">
                            <Share2 size={16} />
                        </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`flex gap-4 md:gap-8 animate-in fade-in duration-300 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-900 text-white flex items-center justify-center shadow-lg">
                  <Bot size={20} />
                </div>
                <div className="bg-white border border-slate-100 px-8 py-6 rounded-[2rem] rounded-tl-none flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Bar */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-100 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setMessages([])}
                className="shrink-0 p-4 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-all active:scale-90"
              >
                <Plus size={24} />
              </button>
              
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isUrdu ? 'اے آئی عالم سے پوچھیں...' : 'Ask AI Scholar...'}
                  className={`w-full ${isUrdu ? 'pr-8 pl-24' : 'pl-8 pr-24'} py-5 md:py-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-[2.5rem] outline-none transition-all text-base md:text-lg font-bold placeholder:text-slate-300 shadow-inner`}
                />
                
                <div className={`absolute ${isUrdu ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 flex items-center gap-1`}>
                   <button type="button" className="p-3 text-slate-400 hover:text-emerald-600 transition-colors hidden md:block">
                      <Mic size={24} />
                   </button>
                   <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-3.5 md:p-4 rounded-full transition-all ${
                      input.trim() ? 'bg-emerald-900 text-white shadow-xl scale-110' : 'text-slate-300'
                    }`}
                   >
                     {isLoading ? <Loader2 size={24} className="animate-spin" /> : <AudioLines size={24} />}
                   </button>
                </div>
              </div>
            </form>
            
            <p className="mt-4 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-amber-500" />
                {isUrdu ? 'اے آئی عالم آپ کی رہنمائی کے لیے تیار ہے' : 'AI Scholar can make mistakes. Verify important info.'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AIScholar;
