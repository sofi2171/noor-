
import React from 'react';
import { Search, Loader2, BookCheck, ShieldCheck, User, Filter, Share2, Copy, Check, Hash, Sparkles, AlertCircle, RotateCcw, Facebook, Twitter, MessageCircle, ExternalLink, WifiOff } from 'lucide-react';
import { Hadith, Language } from '../types';
import { searchHadith } from '../services/geminiService';

interface Props {
    lang: Language;
}

const HadithExplorer: React.FC<Props> = ({ lang }) => {
  const [query, setQuery] = React.useState('');
  const [sourceFilter, setSourceFilter] = React.useState('all');
  const [authFilter, setAuthFilter] = React.useState('all');
  const [results, setResults] = React.useState<Hadith[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activeShareId, setActiveShareId] = React.useState<number | null>(null);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const isUrdu = lang === 'ur';

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const resultList = await searchHadith(activeQuery, lang, sourceFilter, authFilter);
      if (!resultList || resultList.length === 0) {
        throw new Error("No results found");
      }
      setResults(resultList);
    } catch (e) {
      console.error("Search failed", e);
      setError(isUrdu 
        ? "تلاش کے دوران دشواری پیش آئی۔ براہ کرم اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔" 
        : "Hadith search failed. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const shareToPlatform = (h: Hadith, platform: 'wa' | 'tw' | 'fb' | 'copy') => {
    const hubLink = "https://noorislamichub.com/hadith-explorer";
    const text = `"${h.text}"\n\n${isUrdu ? 'ماخذ' : 'Source'}: ${h.source}\n${isUrdu ? 'راوی' : 'Narrator'}: ${h.narrator}\n\nShared via Noor Islamic Hub\nRead more: ${hubLink}`;

    switch (platform) {
      case 'wa':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'tw':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'fb':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(hubLink)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(text);
        setCopiedId(results.indexOf(h));
        setTimeout(() => setCopiedId(null), 2000);
        break;
    }
    setActiveShareId(null);
  };

  const sources = [
    { id: 'all', label: isUrdu ? 'تمام کتب' : 'All Books' },
    { id: 'Sahih Bukhari', label: isUrdu ? 'صحیح بخاری' : 'Sahih Bukhari' },
    { id: 'Sahih Muslim', label: isUrdu ? 'صحیح مسلم' : 'Sahih Muslim' },
    { id: 'Sunan Abi Dawud', label: isUrdu ? 'سنن ابی داؤد' : 'Sunan Abi Dawud' },
    { id: 'Sunan al-Tirmidhi', label: isUrdu ? 'جامع ترمذی' : 'Sunan al-Tirmidhi' },
  ];

  const authenticities = [
    { id: 'all', label: isUrdu ? 'تمام درجات' : 'All Status' },
    { id: 'Sahih', label: isUrdu ? 'صحیح' : 'Sahih' },
    { id: 'Hasan', label: isUrdu ? 'حسن' : 'Hasan' },
    { id: 'Da’if', label: isUrdu ? 'ضعیف' : 'Da’if' },
  ];

  const topics = [
    { name: isUrdu ? 'اخلاق' : 'Ethics', query: 'Etiquettes & Ethics' },
    { name: isUrdu ? 'والدین' : 'Parents', query: 'Rights of Parents' },
    { name: isUrdu ? 'صدقہ' : 'Charity', query: 'Virtues of Charity' },
    { name: isUrdu ? 'صبر' : 'Patience', query: 'Patience & Endurance' },
    { name: isUrdu ? 'علم' : 'Knowledge', query: 'Seeking Knowledge' },
    { name: isUrdu ? 'نماز' : 'Prayer', query: 'Virtues of Prayer' },
  ];

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{isUrdu ? 'حدیث انسائیکلوپیڈیا' : 'Hadith Encyclopedia'}</h2>
        <p className="text-slate-500 text-lg">
          {isUrdu ? 'ہزاروں مستند احادیث کے ذخیرے سے تلاشی لیں۔' : 'Explore a database of thousands of authentic traditions.'}
        </p>
        
        <div className="mt-12 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl space-y-6">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isUrdu ? 'موضوع تلاش کریں (مثال: روزہ، صدقہ، امانت)' : 'e.g., Trust, Honesty, Fasting...'}
              className={`w-full ${isUrdu ? 'pr-14 pl-40' : 'pl-14 pr-40'} py-6 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all rounded-[2rem] group-hover:border-slate-200 text-lg font-bold`}
            />
            <div className={`absolute ${isUrdu ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors`}>
              <Search size={28} />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className={`absolute ${isUrdu ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3.5 rounded-[1.5rem] font-black transition-all shadow-lg shadow-emerald-200 text-lg flex items-center gap-2`}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (isUrdu ? 'تلاش کریں' : 'Search')}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">{isUrdu ? 'فلٹرز' : 'Filters'}</span>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 text-sm"
              >
                {sources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <select 
                value={authFilter}
                onChange={(e) => setAuthFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 text-sm"
              >
                {authenticities.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {error && (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-red-50/50 border-2 border-red-100 rounded-[3rem] gap-6 text-center animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <WifiOff size={32} />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-black text-slate-800">{isUrdu ? 'معذرت، تلاش ناکام رہی' : 'Search Failed'}</h3>
                  <p className="font-bold text-slate-500 leading-relaxed">{error}</p>
                </div>
                <button 
                  onClick={() => handleSearch()} 
                  className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-red-200 active:scale-95"
                >
                    <RotateCcw size={20} /> {isUrdu ? 'دوبارہ کوشش کریں' : 'Try Again'}
                </button>
            </div>
        )}

        {!results.length && !loading && !error && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 justify-center text-slate-400 mb-4">
                <Hash size={20} />
                <h3 className="text-xl font-bold uppercase tracking-widest">{isUrdu ? 'مشہور موضوعات' : 'Trending Topics'}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {topics.map(topic => (
                <button 
                  key={topic.name}
                  onClick={() => {
                      setQuery(topic.name);
                      handleSearch(undefined, topic.query);
                  }}
                  className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Sparkles size={18} />
                  </div>
                  <span className="font-black text-slate-700 group-hover:text-emerald-700">{topic.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center relative shadow-inner">
                    <Loader2 size={48} className="animate-spin text-emerald-600" />
                </div>
                <p className="text-xl font-black text-slate-500 animate-pulse">{isUrdu ? 'احادیث تلاش کی جا رہی ہیں...' : 'Searching archives...'}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.map((h, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between relative overflow-visible"
                    >
                        <div className="space-y-6">
                            <div className="flex justify-between items-center relative">
                                <div className="flex gap-2">
                                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                                        <ShieldCheck size={14} />
                                        {h.authenticity}
                                    </span>
                                    <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                                        <BookCheck size={14} />
                                        {h.source}
                                    </span>
                                </div>
                                <div className="relative">
                                    <button 
                                      onClick={() => setActiveShareId(activeShareId === idx ? null : idx)}
                                      className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                                      aria-label="Share options"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                    
                                    {activeShareId === idx && (
                                        <div className={`absolute ${isUrdu ? 'left-0' : 'right-0'} top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[60] p-3 animate-in zoom-in-95 duration-200`}>
                                            <div className="text-[10px] font-black uppercase text-slate-400 mb-2 px-2 tracking-widest">
                                                {isUrdu ? 'شیئر کریں' : 'Share to'}
                                            </div>
                                            <button onClick={() => shareToPlatform(h, 'copy')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-sm font-bold text-slate-600">
                                                {copiedId === idx ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                                {isUrdu ? 'کاپی کریں' : 'Copy Text'}
                                            </button>
                                            <button onClick={() => shareToPlatform(h, 'wa')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-sm font-bold text-slate-600">
                                                <MessageCircle size={18} className="text-emerald-500" /> WhatsApp
                                            </button>
                                            <button onClick={() => shareToPlatform(h, 'tw')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-sm font-bold text-slate-600">
                                                <Twitter size={18} className="text-blue-400" /> X / Twitter
                                            </button>
                                            <button onClick={() => shareToPlatform(h, 'fb')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-sm font-bold text-slate-600">
                                                <Facebook size={18} className="text-blue-600" /> Facebook
                                            </button>
                                            <a 
                                              href="https://noorislamichub.com/hadith-explorer" 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="mt-2 block w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors text-sm font-bold"
                                            >
                                                <ExternalLink size={18} />
                                                {isUrdu ? 'ویب سائٹ لنک' : 'Hub Direct Link'}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className={`text-2xl text-slate-800 leading-relaxed font-bold italic ${isUrdu ? 'font-urdu' : ''}`}>
                                "{h.text}"
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-8 border-t border-slate-50 mt-8">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{isUrdu ? 'راوی' : 'Narrator'}</p>
                                <p className="font-bold text-slate-700 text-sm">{h.narrator}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default HadithExplorer;
