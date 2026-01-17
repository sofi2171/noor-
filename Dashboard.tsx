
import React from 'react';
import { Clock, MapPin, CalendarDays, Quote, ChevronRight, BookOpenCheck, X, CheckCircle2, BookOpen, ScrollText, History, Landmark, Sparkles } from 'lucide-react';
import { PrayerTimes, QuranVerse, Language, Adhkar } from '../types';
import { getDailyVerse, getDailyAzkar } from '../services/geminiService';

interface DashboardProps {
  prayerTimes: PrayerTimes | null;
  locationName: string;
  lang: Language;
}

interface Article {
  id: string;
  title: string;
  desc: string;
  content: string;
  icon: React.ReactNode;
  category: string;
}

const Dashboard: React.FC<DashboardProps> = ({ prayerTimes, locationName, lang }) => {
  const [verse, setVerse] = React.useState<QuranVerse | null>(null);
  const [azkar, setAzkar] = React.useState<Adhkar[]>([]);
  const [loadingVerse, setLoadingVerse] = React.useState(true);
  const [loadingAzkar, setLoadingAzkar] = React.useState(true);
  const [showAzkarModal, setShowAzkarModal] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [completedAzkar, setCompletedAzkar] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('completed_azkar');
    return saved ? JSON.parse(saved) : [];
  });

  const isUrdu = lang === 'ur';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [v, a] = await Promise.all([
          getDailyVerse(lang),
          getDailyAzkar(lang)
        ]);
        setVerse(v);
        setAzkar(a);
      } catch (e) {
        console.error("Failed to fetch daily content", e);
      } finally {
        setLoadingVerse(false);
        setLoadingAzkar(false);
      }
    };
    fetchData();
  }, [lang]);

  const toggleDhikr = (id: number) => {
    const newCompleted = completedAzkar.includes(id)
      ? completedAzkar.filter(item => item !== id)
      : [...completedAzkar, id];
    setCompletedAzkar(newCompleted);
    localStorage.setItem('completed_azkar', JSON.stringify(newCompleted));
  };

  const prayerNames: Record<string, string> = isUrdu ? {
    Fajr: 'فجر',
    Sunrise: 'طلوعِ آفتاب',
    Dhuhr: 'ظہر',
    Asr: 'عصر',
    Maghrib: 'مغرب',
    Isha: 'عشاء'
  } : {
    Fajr: 'Fajr',
    Sunrise: 'Sunrise',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha'
  };

  const articles: Article[] = [
    { 
        id: '1',
        title: isUrdu ? 'غزوہ بدر: حق و باطل کا پہلا معرکہ' : 'The Battle of Badr', 
        desc: isUrdu ? 'اسلام کی تاریخ کا وہ عظیم موڑ جس نے مسلمانوں کو ایک نئی قوت بخشی۔' : 'The pivotal moment in Islamic history that empowered the early Muslims.', 
        category: isUrdu ? 'اسلامی تاریخ' : 'Islamic History',
        icon: <Landmark className="text-emerald-600" />,
        content: isUrdu 
            ? "۱۷ رمضان المبارک ۲ ہجری کو مدینہ سے باہر بدر کے مقام پر ایک ایسا معرکہ پیش آیا جس نے رہتی دنیا تک یہ پیغام دیا کہ فتح تعداد کی نہیں بلکہ ایمان کی ہوتی ہے۔ ۳۱۳ نہتے مسلمانوں نے ابوجہل کے ایک ہزار مسلح لشکر کو اللہ کی نصرت سے شکست فاش دی۔ اس معرکے میں اللہ تعالیٰ نے فرشتوں کے ذریعے مسلمانوں کی مدد فرمائی۔ یہ معرکہ اسلام کی بقا کا ضامن بنا اور اس کے نتیجے میں قریش کی طاقت کا غرور خاک میں مل گیا۔"
            : "The Battle of Badr, fought on 17 Ramadan 2 AH, was a defining moment in the history of Islam. A small army of 313 Muslims, ill-equipped but fueled by faith, faced a formidable force of 1,000 Meccan pagans. Against all odds, the Muslims emerged victorious with Divine assistance. This battle established the Muslim community as a significant power in the Arabian Peninsula and marked the triumph of truth over falsehood."
    },
    { 
        id: '2',
        title: isUrdu ? 'حضرت عمر فاروقؓ اور عدل و انصاف' : 'Hazrat Umar (RA) & Justice', 
        desc: isUrdu ? 'خلیفہ دوم کے دور حکومت میں عدل کی وہ داستانیں جو آج بھی مثال ہیں۔' : 'The legendary stories of justice from the reign of the second Caliph.', 
        category: isUrdu ? 'سیرت صحابہ' : 'Companion Stories',
        icon: <History className="text-emerald-600" />,
        content: isUrdu
            ? "حضرت عمر فاروقؓ کا دورِ خلافت انصاف کی علامت سمجھا جاتا ہے۔ آپؓ نے ایک بار فرمایا: 'اگر دریائے فرات کے کنارے کوئی کتا بھی بھوکا مر جائے تو عمر اس کا جوابدہ ہوگا۔' آپؓ کے دور میں ایک عام شہری بھی خلیفہ وقت سے سوال کرنے کی جرات رکھتا تھا۔ آپؓ نے ریاستی اداروں کی بنیاد رکھی اور ایک ایسے نظام کو پروان چڑھایا جہاں امیر اور غریب قانون کی نظر میں برابر تھے۔ آپؓ کی زندگی سادگی اور للہیت کا بہترین نمونہ تھی۔"
            : "Hazrat Umar Farooq (RA) is renowned for his unwavering commitment to justice. During his Caliphate, he once famously said, 'If a dog dies of hunger on the banks of the Euphrates, Umar will be accountable for it.' He established a welfare state where even the poorest citizens could hold the Caliph accountable. His era saw the expansion of the Islamic empire and the establishment of sophisticated administrative systems based on equity and Shariah."
    },
    { 
        id: '3',
        title: isUrdu ? 'فتح مکہ: عفو و درگزر کی عظیم مثال' : 'The Conquest of Makkah', 
        desc: isUrdu ? 'رسول اللہ ﷺ کی وہ عظیم فتح جس میں دشمنوں کے لیے عام معافی کا اعلان ہوا۔' : 'The glorious victory of the Prophet (PBUH) characterized by ultimate mercy.', 
        category: isUrdu ? 'سیرت نبوی ﷺ' : 'Seerah',
        icon: <ScrollText className="text-emerald-600" />,
        content: isUrdu
            ? "۸ ہجری میں جب رسول اللہ ﷺ ۱۰ ہزار قدوسیوں کے ساتھ مکہ میں داخل ہوئے، تو آپ ﷺ نے خونریزی کے بجائے امن اور سلامتی کا پیغام دیا۔ کعبہ کو بتوں سے پاک کیا گیا اور وہ لوگ جنہوں نے مسلمانوں پر ظلم کے پہاڑ توڑے تھے، آپ ﷺ کے سامنے کھڑے تھے۔ آپ ﷺ نے فرمایا: 'آج تم پر کوئی گرفت نہیں، جاؤ تم سب آزاد ہو۔' یہ تاریخ انسانی میں معافی اور انسانیت کی وہ مثال ہے جس کی نظیر کہیں نہیں ملتی۔"
            : "In 8 AH, the Prophet Muhammad (PBUH) returned to Makkah with an army of 10,000. Instead of taking revenge on those who had persecuted the Muslims for years, he declared a general amnesty. He entered the city with humility, cleared the Kaaba of idols, and addressed his former enemies with the words: 'Go, for you are free.' The Conquest of Makkah stands as the greatest lesson in forgiveness and nobility in human history."
    }
  ];

  return (
    <div className="space-y-8 lg:space-y-16 animate-in fade-in duration-700">
      {/* Top Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Welcome & Verse - Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Hero Card */}
          <div className="bg-emerald-950 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 opacity-80">
                <Sparkles size={20} className="text-amber-400" />
                <span className="text-xs font-black uppercase tracking-[0.4em]">{isUrdu ? 'خوش آمدید' : 'Welcome to Noor Hub'}</span>
              </div>
              <h2 className={`text-4xl lg:text-6xl font-black mb-6 leading-tight ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'السلام علیکم ورحمتہ اللہ' : 'As-salamu Alaykum'}
              </h2>
              <p className="text-emerald-100/70 text-lg lg:text-xl max-w-2xl leading-relaxed font-medium">
                {isUrdu 
                  ? 'آپ کی روحانی ترقی اور اسلامی تعلیمات تک آسان رسائی کے لیے ایک جدید ڈیجیٹل مرکز۔' 
                  : 'Your modern digital hub for spiritual growth and effortless access to Islamic wisdom.'}
              </p>
              
              <div className="mt-12 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-inner group-hover:bg-white/15 transition-all">
                  <MapPin size={20} className="text-amber-400" />
                  <span className="text-sm font-black tracking-wide">{locationName}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-inner group-hover:bg-white/15 transition-all">
                  <CalendarDays size={20} className="text-amber-400" />
                  <span className="text-sm font-black tracking-wide">
                    {new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-GB', { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Background Graphic */}
            <div className={`absolute -bottom-10 -right-10 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000`}>
                <i className="fa-solid fa-kaaba text-[300px]"></i>
            </div>
          </div>

          {/* Verse Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-12 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shadow-inner border border-amber-100">
                  <Quote size={28} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">{isUrdu ? 'آج کی آیت' : 'Daily Verse'}</h3>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{isUrdu ? 'قرآنِ مجید سے ہدایت' : 'Guidance from Holy Quran'}</p>
                </div>
              </div>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100">
                 <i className="fa-solid fa-share-nodes"></i>
              </button>
            </div>

            {loadingVerse ? (
              <div className="animate-pulse space-y-8">
                <div className="h-16 bg-slate-50 rounded-2xl w-full"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
                </div>
              </div>
            ) : verse ? (
              <div className="space-y-10">
                <p className="font-arabic text-4xl lg:text-5xl text-right leading-[1.8] text-emerald-950 tracking-wide font-bold">{verse.text}</p>
                <div className={`relative ${isUrdu ? 'text-right' : 'text-left'} pl-12 pr-12`}>
                   <div className={`absolute top-0 ${isUrdu ? 'right-0' : 'left-0'} bottom-0 w-1.5 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]`}></div>
                   <p className={`text-slate-600 italic text-xl lg:text-2xl leading-relaxed font-medium ${isUrdu ? 'font-urdu' : ''}`}>{verse.translation}</p>
                   <p className="text-xs font-black text-emerald-600/50 mt-6 uppercase tracking-[0.3em] inline-block px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                     {verse.surah} • {verse.number}
                   </p>
                </div>
              </div>
            ) : (
                <div className="py-12 text-center text-slate-400 font-bold italic">Connection issue. Try refreshing.</div>
            )}
          </div>
        </div>

        {/* Sidebar Column - Prayer & Azkar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Prayer Times Panel */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Clock size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800">{isUrdu ? 'اوقاتِ نماز' : 'Prayer Times'}</h3>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            <div className="space-y-3">
              {prayerTimes ? (
                Object.entries(prayerTimes).map(([key, time]) => (
                  <div key={key} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 border border-transparent hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group/item">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-emerald-500 transition-colors"></div>
                        <span className="font-black text-slate-600 text-lg group-hover/item:text-emerald-900">{prayerNames[key]}</span>
                    </div>
                    <span className="font-black tabular-nums text-emerald-900 text-lg bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100">{time}</span>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                  <div className="animate-spin h-10 w-10 border-[4px] border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tracking Sun...</p>
                </div>
              )}
            </div>
          </div>

          {/* Adhkar Progress Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group/adhkar">
             <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-lg">
                        <BookOpenCheck size={28} />
                    </div>
                    <h4 className="font-black text-xl tracking-tight">{isUrdu ? 'روزانہ کے اذکار' : 'Daily Adhkar'}</h4>
                 </div>
                 <p className="text-emerald-100/70 leading-relaxed font-bold text-lg mb-8">
                    {isUrdu 
                      ? `${completedAzkar.length} اذکار مکمل` 
                      : `${completedAzkar.length} of 10 Completed`}
                 </p>
               </div>

               <div>
                 <div className="w-full bg-white/10 rounded-full h-2 mb-8 shadow-inner overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ width: `${(completedAzkar.length / 10) * 100}%` }}></div>
                 </div>
                 <button 
                  onClick={() => setShowAzkarModal(true)}
                  className="w-full py-5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black rounded-3xl transition-all shadow-xl shadow-amber-400/20 active:scale-95 text-lg"
                 >
                    {isUrdu ? 'ذکر شروع کریں' : 'Start Dhikr Session'}
                 </button>
               </div>
             </div>
             
             <i className="fa-solid fa-moon absolute -bottom-10 -right-10 text-white/5 text-[200px] rotate-12 group-hover/adhkar:scale-110 transition-transform duration-1000"></i>
          </div>
        </div>
      </div>

      {/* Stories & Articles Section */}
      <section className="space-y-10 pt-8 lg:pt-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{isUrdu ? 'اسلامی مضامین اور تاریخ' : 'History & Seerah'}</h3>
                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">{isUrdu ? 'حقیقی واقعات اور اسباق' : 'Real Stories & Lessons'}</p>
            </div>
            <button className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-emerald-700 font-black hover:border-emerald-500 hover:shadow-lg transition-all active:scale-95 group">
                {isUrdu ? 'تمام مضامین' : 'View Library'}
                <ChevronRight size={18} className={`transition-transform group-hover:translate-x-1 ${isUrdu ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
                <div 
                    key={article.id} 
                    onClick={() => setSelectedArticle(article)}
                    className="article-card bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm cursor-pointer group hover:border-emerald-400 transition-all flex flex-col h-[400px] justify-between relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl shadow-inner group-hover:scale-110 group-hover:bg-emerald-50 transition-all border border-transparent group-hover:border-emerald-100">
                                {article.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full border border-emerald-200 shadow-sm">
                                {article.category}
                            </span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-emerald-950 transition-colors leading-tight">{article.title}</h4>
                        <p className="text-slate-500 text-base leading-relaxed font-medium line-clamp-3">{article.desc}</p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 text-emerald-700 font-black text-xs uppercase tracking-[0.2em] pt-8 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                        {isUrdu ? 'مکمل پڑھیں' : 'Explore Full Story'}
                        <ChevronRight size={16} className={isUrdu ? 'rotate-180' : ''} />
                    </div>

                    {/* Faint Background Text */}
                    <div className="absolute -bottom-4 -right-4 text-[120px] font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                        {article.id}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Reusable Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
            <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setSelectedArticle(null)}></div>
            <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="p-8 lg:p-12 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
                            <BookOpen size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] mb-1">{selectedArticle.category}</p>
                            <h3 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">{selectedArticle.title}</h3>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedArticle(null)}
                        className="p-4 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-all active:scale-90"
                    >
                        <X size={32} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-16 space-y-12 no-scrollbar">
                    <div className="p-10 lg:p-16 bg-slate-50/50 rounded-[3rem] border-x-8 border-emerald-900 shadow-inner group relative">
                        <p className={`text-2xl lg:text-3xl text-slate-800 leading-[2.2] lg:leading-[2.4] font-bold ${isUrdu ? 'font-urdu' : ''}`}>
                            {selectedArticle.content}
                        </p>
                        <Quote className="absolute top-8 left-8 text-emerald-100" size={64} />
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 py-12 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-800 rounded-3xl text-sm font-black border border-emerald-100 shadow-sm">
                            <Sparkles size={24} className="text-amber-500" />
                            {isUrdu ? 'حقیقی اسلامی تاریخ' : 'Verified Islamic History'}
                        </div>
                        <button className="flex items-center gap-3 px-8 py-4 bg-emerald-900 text-white rounded-3xl text-sm font-black hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                            <i className="fa-solid fa-file-pdf"></i>
                            {isUrdu ? 'ڈاؤن لوڈ کریں' : 'Download Story'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col items-center justify-center gap-3">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">{isUrdu ? 'نور اسلامک ہب لائبریری' : 'Noor Islamic Hub Library'}</p>
                    <div className="w-12 h-1 bg-emerald-200 rounded-full"></div>
                </div>
            </div>
        </div>
      )}

      {/* Adhkar Session Modal */}
      {showAzkarModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setShowAzkarModal(false)}></div>
          <div className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-12 duration-500">
            <div className="p-8 lg:p-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm">
                    <BookOpenCheck size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800">{isUrdu ? 'آج کے برکت والے اذکار' : 'Blessed Daily Adhkar'}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{isUrdu ? 'روحانی تسکین کے لیے' : 'For Spiritual Elevation'}</p>
                 </div>
              </div>
              <button 
                onClick={() => setShowAzkarModal(false)}
                className="p-4 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8 no-scrollbar bg-slate-50/30">
               {loadingAzkar ? (
                 <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                    <div className="relative">
                        <div className="animate-spin h-16 w-16 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" size={24} />
                    </div>
                    <p className="font-black text-xl text-slate-500 tracking-tight">{isUrdu ? 'آسمانی خزانے تلاش کیے جا رہے ہیں...' : 'Refreshing your daily spiritual diet...'}</p>
                 </div>
               ) : azkar.map((dhikr, idx) => (
                 <div 
                  key={dhikr.id || idx} 
                  onClick={() => toggleDhikr(dhikr.id || idx)}
                  className={`p-10 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98] ${
                    completedAzkar.includes(dhikr.id || idx) 
                      ? 'bg-emerald-50 border-emerald-300 shadow-lg shadow-emerald-500/5' 
                      : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl'
                  }`}
                 >
                    <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                       <span className={`w-12 h-12 shrink-0 flex items-center justify-center font-black text-lg rounded-2xl shadow-inner ${completedAzkar.includes(dhikr.id || idx) ? 'bg-emerald-200 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                         {idx + 1}
                       </span>
                       <p className="font-arabic text-4xl lg:text-5xl text-right leading-[1.8] text-emerald-950 flex-1 font-bold">
                         {dhikr.arabic}
                       </p>
                    </div>
                    <div className={`space-y-4 ${isUrdu ? 'text-right' : 'text-left'} border-t border-slate-100 pt-8`}>
                       <p className={`text-slate-600 text-xl lg:text-2xl leading-relaxed font-bold ${isUrdu ? 'font-urdu' : ''}`}>
                         {dhikr.translation}
                       </p>
                       {dhikr.benefit && (
                         <div className={`mt-6 p-6 rounded-2xl bg-amber-50/50 border border-amber-100 border-dashed`}>
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em] mb-2">{isUrdu ? 'عظیم فضیلت' : 'The Benefit'}</p>
                            <p className="text-slate-500 text-sm font-bold italic leading-relaxed">{dhikr.benefit}</p>
                         </div>
                       )}
                    </div>
                    
                    {/* Status Icon */}
                    <div className={`absolute top-10 ${isUrdu ? 'left-10' : 'right-10'} transition-all transform ${completedAzkar.includes(dhikr.id || idx) ? 'scale-125' : 'scale-75 opacity-20'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completedAzkar.includes(dhikr.id || idx) ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-white'}`}>
                           <CheckCircle2 size={24} />
                        </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-10 bg-white border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-32 lg:w-48 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                     <div className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(completedAzkar.length / 10) * 100}%` }}></div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-black text-emerald-900">{completedAzkar.length}</span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">/ 10 {isUrdu ? 'مکمل' : 'Progress'}</span>
                  </div>
               </div>
               <button 
                onClick={() => setShowAzkarModal(false)}
                className="w-full md:w-auto px-12 py-5 bg-emerald-950 text-white font-black rounded-3xl transition-all shadow-xl shadow-emerald-950/20 active:scale-95 text-lg"
               >
                 {isUrdu ? 'سبحان اللہ! مکمل ہوا' : 'Alhamdulillah! Done'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
