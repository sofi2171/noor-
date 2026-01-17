
import React from 'react';
import { RotateCcw, Fingerprint, ListMusic, Volume2, VolumeX, Sparkles, History, Check } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const TasbeehCounter: React.FC<Props> = ({ lang }) => {
  const isUrdu = lang === 'ur';
  const [count, setCount] = React.useState(0);
  const [target, setTarget] = React.useState(33);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [selectedDhikr, setSelectedDhikr] = React.useState(0);
  const [history, setHistory] = React.useState<{ dhikr: string, count: number, date: string }[]>(() => {
    const saved = localStorage.getItem('tasbeeh_history');
    return saved ? JSON.parse(saved) : [];
  });

  const dhikrs = [
    { ar: 'سُبْحَانَ ٱللَّٰهِ', en: 'SubhanAllah', translation: isUrdu ? 'اللہ پاک ہے' : 'Glory be to Allah' },
    { ar: 'ٱلْحَمْدُ لِلَّٰهِ', en: 'Alhamdulillah', translation: isUrdu ? 'تمام تعریفیں اللہ کے لیے ہیں' : 'Praise be to Allah' },
    { ar: 'ٱللَّٰهُ أَكْبَرُ', en: 'Allahu Akbar', translation: isUrdu ? 'اللہ سب سے بڑا ہے' : 'Allah is the Greatest' },
    { ar: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', en: 'La ilaha illallah', translation: isUrdu ? 'اللہ کے سوا کوئی معبود نہیں' : 'There is no god but Allah' },
    { ar: 'أَسْتَغْفِرُ ٱللَّٰهَ', en: 'Astaghfirullah', translation: isUrdu ? 'میں اللہ سے معافی مانگتا ہوں' : 'I seek forgiveness from Allah' },
  ];

  const handleIncrement = () => {
    if (soundEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setCount(prev => prev + 1);
  };

  const resetCount = () => {
    if (count > 0) {
      const entry = {
        dhikr: dhikrs[selectedDhikr].en,
        count: count,
        date: new Date().toLocaleString(isUrdu ? 'ur-PK' : 'en-GB')
      };
      const newHistory = [entry, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('tasbeeh_history', JSON.stringify(newHistory));
    }
    setCount(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800">{isUrdu ? 'ڈیجیٹل تسبیح' : 'Digital Tasbeeh'}</h2>
        <p className="text-slate-500 text-lg">
          {isUrdu ? 'اپنے روزانہ کے ذکر کا حساب رکھیں اور روحانی سکون پائیں۔' : 'Keep track of your daily dhikr and find spiritual peace.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Main Counter UI */}
        <div className="flex flex-col items-center gap-10">
          <div 
            onClick={handleIncrement}
            className="relative w-72 h-72 md:w-80 md:h-80 bg-white border-[12px] border-emerald-900 rounded-full shadow-[0_30px_60px_-15px_rgba(5,150,105,0.3)] flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-2">{isUrdu ? 'تعداد' : 'Count'}</span>
              <span className="text-7xl md:text-8xl font-black text-emerald-950 tabular-nums select-none">{count}</span>
              <div className="mt-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{isUrdu ? 'ٹیپ کریں' : 'Tap to Count'}</span>
              </div>
            </div>

            {/* Circular Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (count % target / target) * 1000}
                className="text-amber-400 transition-all duration-300"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4">
             <button 
              onClick={resetCount}
              className="p-4 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm"
              title="Reset"
             >
                <RotateCcw size={24} />
             </button>
             <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-4 rounded-2xl transition-all shadow-sm ${soundEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
              title="Toggle Sound"
             >
                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
             </button>
          </div>
        </div>

        {/* Configuration & History */}
        <div className="space-y-8">
          {/* Dhikr Selection */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <ListMusic size={20} className="text-emerald-600" />
              <h3 className="font-black text-slate-800">{isUrdu ? 'ذکر کا انتخاب' : 'Select Dhikr'}</h3>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {dhikrs.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDhikr(i); resetCount(); }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    selectedDhikr === i ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  <div className="text-right">
                    <p className="font-arabic text-xl text-emerald-950 font-bold">{d.ar}</p>
                    <p className="text-xs text-slate-500">{d.en}</p>
                  </div>
                  {selectedDhikr === i && <Check size={20} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Target Selection */}
          <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <Sparkles size={20} className="text-amber-400" />
                <h3 className="font-bold">{isUrdu ? 'ہدف مقرر کریں' : 'Set Target'}</h3>
             </div>
             <div className="flex gap-3">
                {[33, 100, 1000].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setTarget(t); resetCount(); }}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all border ${
                      target === t ? 'bg-amber-400 text-emerald-900 border-amber-400 shadow-lg' : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6 text-slate-400">
                  <History size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest">{isUrdu ? 'حالیہ ریکارڈ' : 'Recent History'}</h3>
               </div>
               <div className="space-y-4">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                       <div>
                          <p className="font-bold text-slate-700">{h.dhikr}</p>
                          <p className="text-[10px] text-slate-400">{h.date}</p>
                       </div>
                       <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{h.count}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasbeehCounter;
