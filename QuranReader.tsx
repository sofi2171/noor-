
import React from 'react';
import { Book, Play, Pause, Search, Bookmark, BookmarkCheck, Star, ArrowRight, ArrowLeft, Loader2, Info, Sparkles, BookCheck, LayoutGrid, List, AlertCircle, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Language, Surah } from '../types';

interface Props {
  lang: Language;
}

interface VerseData {
  number: number;
  text: string;
  translation: string;
  surahName?: string;
  surahNameUrdu?: string;
  audio?: string;
}

type ViewMode = 'surah' | 'juz';

const QuranReader: React.FC<Props> = ({ lang }) => {
  const isUrdu = lang === 'ur';
  const [viewMode, setViewMode] = React.useState<ViewMode>('surah');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSurah, setSelectedSurah] = React.useState<Surah | null>(null);
  const [selectedJuz, setSelectedJuz] = React.useState<number | null>(null);
  const [verses, setVerses] = React.useState<VerseData[]>([]);
  const [loadingVerses, setLoadingVerses] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Surah Audio State
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Verse Audio State
  const [playingVerseId, setPlayingVerseId] = React.useState<number | null>(null);
  const verseAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const [bookmarks, setBookmarks] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('quran_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const allSurahs: Surah[] = [
    { id: 1, name: "Al-Fatihah", english: "The Opening", verses: 7, type: "Meccan" },
    { id: 2, name: "Al-Baqarah", english: "The Cow", verses: 286, type: "Medinan" },
    { id: 3, name: "Ali 'Imran", english: "Family of Imran", verses: 200, type: "Medinan" },
    { id: 4, name: "An-Nisa", english: "The Women", verses: 176, type: "Medinan" },
    { id: 5, name: "Al-Ma'idah", english: "The Table Spread", verses: 120, type: "Medinan" },
    { id: 6, name: "Al-An'am", english: "The Cattle", verses: 165, type: "Meccan" },
    { id: 7, name: "Al-A'raf", english: "The Heights", verses: 206, type: "Meccan" },
    { id: 8, name: "Al-Anfal", english: "The Spoils of War", verses: 75, type: "Medinan" },
    { id: 9, name: "At-Tawbah", english: "The Repentance", verses: 129, type: "Medinan" },
    { id: 10, name: "Yunus", english: "Jonah", verses: 109, type: "Meccan" },
    { id: 11, name: "Hud", english: "Hud", verses: 123, type: "Meccan" },
    { id: 12, name: "Yusuf", english: "Joseph", verses: 111, type: "Meccan" },
    { id: 13, name: "Ar-Ra'd", english: "The Thunder", verses: 43, type: "Medinan" },
    { id: 14, name: "Ibrahim", english: "Abraham", verses: 52, type: "Meccan" },
    { id: 15, name: "Al-Hijr", english: "The Rocky Tract", verses: 99, type: "Meccan" },
    { id: 16, name: "An-Nahl", english: "The Bee", verses: 128, type: "Meccan" },
    { id: 17, name: "Al-Isra", english: "The Night Journey", verses: 111, type: "Meccan" },
    { id: 18, name: "Al-Kahf", english: "The Cave", verses: 110, type: "Meccan" },
    { id: 19, name: "Maryam", english: "Mary", verses: 98, type: "Meccan" },
    { id: 20, name: "Ta-Ha", english: "Ta-Ha", verses: 135, type: "Meccan" },
    { id: 21, name: "Al-Anbiya", english: "The Prophets", verses: 112, type: "Meccan" },
    { id: 22, name: "Al-Hajj", english: "The Pilgrimage", verses: 78, type: "Medinan" },
    { id: 23, name: "Al-Mu'minun", english: "The Believers", verses: 118, type: "Meccan" },
    { id: 24, name: "An-Nur", english: "The Light", verses: 64, type: "Medinan" },
    { id: 25, name: "Al-Furqan", english: "The Criterion", verses: 77, type: "Meccan" },
    { id: 26, name: "Ash-Shu'ara", english: "The Poets", verses: 227, type: "Meccan" },
    { id: 27, name: "An-Naml", english: "The Ant", verses: 93, type: "Meccan" },
    { id: 28, name: "Al-Qasas", english: "The Stories", verses: 88, type: "Meccan" },
    { id: 29, name: "Al-Ankabut", english: "The Spider", verses: 69, type: "Meccan" },
    { id: 30, name: "Ar-Rum", english: "The Romans", verses: 60, type: "Meccan" },
    { id: 31, name: "Luqman", english: "Luqman", verses: 34, type: "Meccan" },
    { id: 32, name: "As-Sajdah", english: "The Prostration", verses: 30, type: "Meccan" },
    { id: 33, name: "Al-Ahzab", english: "The Combined Forces", verses: 73, type: "Medinan" },
    { id: 34, name: "Saba", english: "Sheba", verses: 54, type: "Meccan" },
    { id: 35, name: "Fatir", english: "The Originator", verses: 45, type: "Meccan" },
    { id: 36, name: "Ya-Sin", english: "Ya Sin", verses: 83, type: "Meccan" },
    { id: 37, name: "As-Saffat", english: "Those who set the Ranks", verses: 182, type: "Meccan" },
    { id: 38, name: "Sad", english: "The Letter Sad", verses: 88, type: "Meccan" },
    { id: 39, name: "Az-Zumar", english: "The Troops", verses: 75, type: "Meccan" },
    { id: 40, name: "Ghafir", english: "The Forgiver", verses: 85, type: "Meccan" },
    { id: 41, name: "Fussilat", english: "Explained in Detail", verses: 54, type: "Meccan" },
    { id: 42, name: "Ash-Shura", english: "The Consultation", verses: 53, type: "Meccan" },
    { id: 43, name: "Az-Zukhruf", english: "The Ornaments of Gold", verses: 89, type: "Meccan" },
    { id: 44, name: "Ad-Dukhan", english: "The Smoke", verses: 59, type: "Meccan" },
    { id: 45, name: "Al-Jathiyah", english: "The Crouching", verses: 37, type: "Meccan" },
    { id: 46, name: "Al-Ahqaf", english: "The Wind-Curved Sandhills", verses: 35, type: "Meccan" },
    { id: 47, name: "Muhammad", english: "Muhammad", verses: 38, type: "Medinan" },
    { id: 48, name: "Al-Fath", english: "The Victory", verses: 29, type: "Medinan" },
    { id: 49, name: "Al-Hujurat", english: "The Rooms", verses: 18, type: "Medinan" },
    { id: 50, name: "Qaf", english: "The Letter Qaf", verses: 45, type: "Meccan" },
    { id: 51, name: "Adh-Dhariyat", english: "The Winnowing Winds", verses: 60, type: "Meccan" },
    { id: 52, name: "At-Tur", english: "The Mount", verses: 49, type: "Meccan" },
    { id: 53, name: "An-Najm", english: "The Star", verses: 62, type: "Meccan" },
    { id: 54, name: "Al-Qamar", english: "The Moon", verses: 55, type: "Meccan" },
    { id: 55, name: "Ar-Rahman", english: "The Beneficent", verses: 78, type: "Medinan" },
    { id: 56, name: "Al-Waqi'ah", english: "The Inevitable", verses: 96, type: "Meccan" },
    { id: 57, name: "Al-Hadid", english: "The Iron", verses: 29, type: "Medinan" },
    { id: 58, name: "Al-Mujadila", english: "The Pleading Woman", verses: 22, type: "Medinan" },
    { id: 59, name: "Al-Hashr", english: "The Exile", verses: 24, type: "Medinan" },
    { id: 60, name: "Al-Mumtahanah", english: "She that is to be examined", verses: 13, type: "Medinan" },
    { id: 61, name: "As-Saff", english: "The Ranks", verses: 14, type: "Medinan" },
    { id: 62, name: "Al-Jumu'ah", english: "The Congregation", verses: 11, type: "Medinan" },
    { id: 63, name: "Al-Munafiqun", english: "The Hypocrites", verses: 11, type: "Medinan" },
    { id: 64, name: "At-Taghabun", english: "The Mutual Disillusion", verses: 18, type: "Medinan" },
    { id: 65, name: "At-Talaq", english: "The Divorce", verses: 12, type: "Medinan" },
    { id: 66, name: "At-Tahrim", english: "The Prohibition", verses: 12, type: "Medinan" },
    { id: 67, name: "Al-Mulk", english: "The Sovereignty", verses: 30, type: "Meccan" },
    { id: 68, name: "Al-Qalam", english: "The Pen", verses: 52, type: "Meccan" },
    { id: 69, name: "Al-Haqqah", english: "The Reality", verses: 52, type: "Meccan" },
    { id: 70, name: "Al-Ma'arij", english: "The Ascending Stairways", verses: 44, type: "Meccan" },
    { id: 71, name: "Nuh", english: "Noah", verses: 28, type: "Meccan" },
    { id: 72, name: "Al-Jinn", english: "The Jinn", verses: 28, type: "Meccan" },
    { id: 73, name: "Al-Muzzammil", english: "The Enshrouded One", verses: 20, type: "Meccan" },
    { id: 74, name: "Al-Muddaththir", english: "The Cloaked One", verses: 56, type: "Meccan" },
    { id: 75, name: "Al-Qiyamah", english: "The Resurrection", verses: 40, type: "Meccan" },
    { id: 76, name: "Al-Insan", english: "The Man", verses: 31, type: "Medinan" },
    { id: 77, name: "Al-Mursalat", english: "Those sent forth", verses: 50, type: "Meccan" },
    { id: 78, name: "An-Naba", english: "The Tidings", verses: 40, type: "Meccan" },
    { id: 79, name: "An-Nazi'at", english: "Those who drag forth", verses: 46, type: "Meccan" },
    { id: 80, name: "'Abasa", english: "He Frowned", verses: 42, type: "Meccan" },
    { id: 81, name: "At-Takwir", english: "The Overthrowing", verses: 29, type: "Meccan" },
    { id: 82, name: "Al-Infitar", english: "The Cleaving", verses: 19, type: "Meccan" },
    { id: 83, name: "Al-Mutaffifin", english: "The Defrauding", verses: 36, type: "Meccan" },
    { id: 84, name: "Al-Inshiqaq", english: "The Sundering", verses: 25, type: "Meccan" },
    { id: 85, name: "Al-Buruj", english: "The Mansions of the Stars", verses: 22, type: "Meccan" },
    { id: 86, name: "At-Tariq", english: "The Nightcomer", verses: 17, type: "Meccan" },
    { id: 87, name: "Al-A'la", english: "The Most High", verses: 19, type: "Meccan" },
    { id: 88, name: "Al-Ghashiyah", english: "The Overwhelming", verses: 26, type: "Meccan" },
    { id: 89, name: "Al-Fajr", english: "The Dawn", verses: 30, type: "Meccan" },
    { id: 90, name: "Al-Balad", english: "The City", verses: 20, type: "Meccan" },
    { id: 91, name: "Ash-Shams", english: "The Sun", verses: 15, type: "Meccan" },
    { id: 92, name: "Al-Layl", english: "The Night", verses: 21, type: "Meccan" },
    { id: 93, name: "Ad-Duha", english: "The Morning Hours", verses: 11, type: "Meccan" },
    { id: 94, name: "Ash-Sharh", english: "The Relief", verses: 8, type: "Meccan" },
    { id: 95, name: "At-Tin", english: "The Fig", verses: 8, type: "Meccan" },
    { id: 96, name: "Al-'Alaq", english: "The Clot", verses: 19, type: "Meccan" },
    { id: 97, name: "Al-Qadr", english: "The Power", verses: 5, type: "Meccan" },
    { id: 98, name: "Al-Bayyinah", english: "The Clear Proof", verses: 8, type: "Medinan" },
    { id: 99, name: "Az-Zalzalah", english: "The Earthquake", verses: 8, type: "Medinan" },
    { id: 100, name: "Al-'Adiyat", english: "The Courser", verses: 11, type: "Meccan" },
    { id: 101, name: "Al-Qari'ah", english: "The Calamity", verses: 11, type: "Meccan" },
    { id: 102, name: "At-Takathur", english: "The Rivalry in World Increase", verses: 8, type: "Meccan" },
    { id: 103, name: "Al-'Asr", english: "The Declining Day", verses: 3, type: "Meccan" },
    { id: 104, name: "Al-Humazah", english: "The Traducer", verses: 9, type: "Meccan" },
    { id: 105, name: "Al-Fil", english: "The Elephant", verses: 5, type: "Meccan" },
    { id: 106, name: "Quraysh", english: "Quraysh", verses: 4, type: "Meccan" },
    { id: 107, name: "Al-Ma'un", english: "The Small Kindnesses", verses: 7, type: "Meccan" },
    { id: 108, name: "Al-Kawthar", english: "The Abundance", verses: 3, type: "Meccan" },
    { id: 109, name: "Al-Kafirun", english: "The Disbelievers", verses: 6, type: "Meccan" },
    { id: 110, name: "An-Nasr", english: "The Divine Support", verses: 3, type: "Medinan" },
    { id: 111, name: "Al-Masad", english: "The Palm Fiber", verses: 5, type: "Meccan" },
    { id: 112, name: "Al-Ikhlas", english: "The Purity", verses: 4, type: "Meccan" },
    { id: 113, name: "Al-Falaq", english: "The Daybreak", verses: 5, type: "Meccan" },
    { id: 114, name: "An-Nas", english: "Mankind", verses: 6, type: "Meccan" },
  ];

  const quranArticles = [
    {
      title: isUrdu ? "تلاوت قرآن کے آداب" : "Etiquettes of Quran Recitation",
      content: isUrdu 
        ? "قرآن پاک کی تلاوت کے لیے باوضو ہونا، خاموشی سے سننا اور تدبر کے ساتھ پڑھنا ضروری آداب میں شامل ہے۔"
        : "Reciting the Quran requires physical purity (Wudu), attentive listening, and reflecting upon the verses with a calm heart.",
      icon: <BookCheck size={20} />
    },
    {
      title: isUrdu ? "مکی اور مدنی سورتوں کا فرق" : "Meccan vs Medinan Surahs",
      content: isUrdu
        ? "مکی سورتیں عموماً عقائد اور توحید پر زور دیتی ہیں جبکہ مدنی سورتوں میں احکامات اور سماجی قوانین بیان ہوئے ہیں۔"
        : "Meccan Surahs generally focus on faith and monotheism, while Medinan Surahs detail laws and social guidelines for the community.",
      icon: <Sparkles size={20} />
    }
  ];

  const toggleBookmark = (id: number) => {
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('quran_bookmarks', JSON.stringify(newBookmarks));
  };

  const fetchVersesBySurah = async (surahId: number) => {
    setLoadingVerses(true);
    setError(null);
    try {
      const [arabicRes, urduRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`).then(r => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ur.jalandhry`).then(r => r.json())
      ]);

      if (arabicRes.code !== 200 || urduRes.code !== 200 || !arabicRes.data?.ayahs) {
        throw new Error("Invalid API Response");
      }

      const combined: VerseData[] = arabicRes.data.ayahs.map((v: any, index: number) => ({
        number: v.numberInSurah,
        text: v.text,
        translation: urduRes.data.ayahs[index]?.text || "Translation not available.",
        audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.number}.mp3` // Absolute ayah number
      }));

      setVerses(combined);
    } catch (err) {
      console.error("Failed to fetch verses", err);
      setError(isUrdu ? "معلومات لوڈ کرنے میں دشواری پیش آئی۔" : "Failed to load verses.");
    } finally {
      setLoadingVerses(false);
    }
  };

  const fetchVersesByJuz = async (juzId: number) => {
    setLoadingVerses(true);
    setError(null);
    try {
      const [arabicRes, urduRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/juz/${juzId}/quran-uthmani`).then(r => r.json()),
        fetch(`https://api.alquran.cloud/v1/juz/${juzId}/ur.jalandhry`).then(r => r.json())
      ]);

      if (arabicRes.code !== 200 || urduRes.code !== 200 || !arabicRes.data?.ayahs) {
        throw new Error("Invalid API Response");
      }
      
      const combined: VerseData[] = arabicRes.data.ayahs.map((v: any, index: number) => ({
        number: v.numberInSurah,
        text: v.text,
        translation: urduRes.data.ayahs[index]?.text || "Translation not available.",
        surahName: v.surah?.name || "Unknown Surah",
        audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.number}.mp3`
      }));

      setVerses(combined);
    } catch (err) {
      console.error("Failed to fetch juz ayahs", err);
      setError(isUrdu ? "پارہ لوڈ کرنے میں دشواری پیش آئی۔" : "Failed to load Para (Juz).");
    } finally {
      setLoadingVerses(false);
    }
  };

  const handleSurahClick = (surah: Surah) => {
    stopAllAudio();
    setSelectedSurah(surah);
    setSelectedJuz(null);
    fetchVersesBySurah(surah.id);
  };

  const handleJuzClick = (juzNum: number) => {
    stopAllAudio();
    setSelectedJuz(juzNum);
    setSelectedSurah(null);
    fetchVersesByJuz(juzNum);
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }
    if (verseAudioRef.current) {
        verseAudioRef.current.pause();
        verseAudioRef.current.src = "";
    }
    setIsPlaying(false);
    setPlayingVerseId(null);
  };

  const toggleSurahPlay = () => {
    if (!audioRef.current) return;
    
    // Stop individual verse audio if playing
    if (verseAudioRef.current) {
        verseAudioRef.current.pause();
        setPlayingVerseId(null);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.warn("Playback interrupted or prevented:", e);
          setIsPlaying(false);
        });
      }
    }
  };

  const toggleVersePlay = (verse: VerseData, index: number) => {
    if (!verseAudioRef.current || !verse.audio) return;

    // Stop surah audio if playing
    if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
    }

    if (playingVerseId === index) {
        verseAudioRef.current.pause();
        setPlayingVerseId(null);
    } else {
        verseAudioRef.current.src = verse.audio;
        verseAudioRef.current.play().then(() => {
            setPlayingVerseId(index);
        }).catch(err => {
            console.error("Verse audio failed", err);
        });
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredSurahs = allSurahs.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString() === searchQuery
  );

  const bookmarkedSurahList = allSurahs.filter(s => bookmarks.includes(s.id));

  if (selectedSurah || selectedJuz) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
        <button 
          onClick={() => {
            stopAllAudio();
            setSelectedSurah(null);
            setSelectedJuz(null);
            setError(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 text-emerald-700 font-bold transition-all shadow-sm"
        >
          {isUrdu ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {isUrdu ? 'واپس فہرست پر' : 'Back to List'}
        </button>

        <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-right">
              <h2 className="text-4xl font-black mb-2">
                {selectedSurah ? selectedSurah.name : `${isUrdu ? 'پارہ' : 'Juz'} ${selectedJuz}`}
              </h2>
              <p className="text-emerald-100/80 text-lg">
                {selectedSurah ? `${selectedSurah.english} • ${selectedSurah.verses} ${isUrdu ? 'آیات' : 'Verses'}` : `${isUrdu ? 'قرآن مجید کا حصہ' : 'Section of Holy Quran'}`}
              </p>
            </div>
            
            {selectedSurah && (
              <div className="flex gap-4">
                <button onClick={() => toggleBookmark(selectedSurah.id)} className={`p-4 rounded-2xl transition-all ${bookmarks.includes(selectedSurah.id) ? 'bg-amber-400 text-emerald-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    <Bookmark size={24} fill={bookmarks.includes(selectedSurah.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={toggleSurahPlay}
                  className="p-4 bg-amber-400 text-emerald-900 rounded-2xl hover:bg-amber-500 transition-all shadow-lg flex items-center gap-3 font-bold"
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    <span>{isPlaying ? (isUrdu ? 'توقف' : 'Pause') : (isUrdu ? 'مکمل تلاوت' : 'Full Surah')}</span>
                </button>
              </div>
            )}
          </div>
          
          {selectedSurah && (
            <>
              <div className="mt-8 bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300" 
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-emerald-200/60 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <audio 
                ref={audioRef}
                src={`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${selectedSurah.id}.mp3`}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
            </>
          )}

          {/* Hidden Verse Player */}
          <audio 
            ref={verseAudioRef} 
            onEnded={() => setPlayingVerseId(null)}
          />

          <div className="absolute top-0 left-0 p-10 opacity-5 pointer-events-none">
             <i className="fa-solid fa-quran text-[150px]"></i>
          </div>
        </div>

        <div className="space-y-4">
          {loadingVerses ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={48} className="animate-spin text-emerald-600" />
              <p className="text-slate-500 font-bold">{isUrdu ? 'آیات لوڈ ہو رہی ہیں...' : 'Loading Verses...'}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <div className="p-6 bg-red-50 text-red-600 rounded-full">
                    <AlertCircle size={48} />
                </div>
                <div className="max-w-md space-y-2">
                    <p className="text-xl font-black text-slate-800">{isUrdu ? 'معذرت، ڈیٹا لوڈ نہیں ہو سکا' : 'Could not load data'}</p>
                    <p className="text-slate-500">{error}</p>
                </div>
                <button 
                  onClick={() => selectedSurah ? fetchVersesBySurah(selectedSurah.id) : fetchVersesByJuz(selectedJuz!)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2"
                >
                    <RotateCcw size={20} />
                    {isUrdu ? 'دوبارہ کوشش کریں' : 'Try Again'}
                </button>
            </div>
          ) : (
            verses.map((verse, idx) => (
              <div 
                key={idx} 
                className={`bg-white border-2 rounded-3xl p-8 shadow-sm transition-all group relative overflow-hidden ${playingVerseId === idx ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100'}`}
              >
                {/* Visual Audio Waveform background for active verse */}
                {playingVerseId === idx && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/10 flex items-end gap-1 px-4">
                        {[...Array(20)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-full bg-emerald-500/40 animate-pulse" 
                                style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                            ></div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-start gap-6 mb-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border transition-colors ${playingVerseId === idx ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      {verse.number}
                    </span>
                    <button 
                        onClick={() => toggleVersePlay(verse, idx)}
                        className={`p-2.5 rounded-xl transition-all ${playingVerseId === idx ? 'bg-emerald-100 text-emerald-700 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
                        title={playingVerseId === idx ? "Pause Ayah" : "Play Ayah"}
                    >
                        {playingVerseId === idx ? <Pause size={18} /> : <Volume2 size={18} />}
                    </button>
                    {verse.surahName && <span className="text-[10px] text-emerald-600 font-black whitespace-nowrap">{verse.surahName}</span>}
                  </div>
                  <p className={`font-arabic text-4xl text-right leading-[2] flex-1 transition-colors ${playingVerseId === idx ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>
                    {verse.text}
                  </p>
                </div>
                <div className={`pt-6 border-t border-slate-100 ${isUrdu ? 'text-right' : 'text-left'}`}>
                  <p className={`text-slate-600 text-xl leading-relaxed ${isUrdu ? 'font-urdu' : ''}`}>
                    {verse.translation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800">{isUrdu ? 'قرآن مجید' : 'Quran Explorer'}</h2>
          <p className="text-slate-500 text-lg">{isUrdu ? 'تجوید اور ترجمہ کے ساتھ مکمل قرآن مجید کا مطالعہ کریں۔' : 'Full Quran with Tajweed and Urdu translations.'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => { setViewMode('surah'); setError(null); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold ${viewMode === 'surah' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid size={18} />
              {isUrdu ? 'سورتیں' : 'Surahs'}
            </button>
            <button 
              onClick={() => { setViewMode('juz'); setError(null); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold ${viewMode === 'juz' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'}`}
            >
              <List size={18} />
              {isUrdu ? 'پارے' : 'Juz (Paras)'}
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'تلاش کریں...' : 'Search...'}
              className={`w-full ${isUrdu ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all md:w-64 shadow-sm text-lg`}
            />
            <Search size={20} className={`absolute ${isUrdu ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} />
          </div>
        </div>
      </div>

      {viewMode === 'surah' ? (
        <>
          {bookmarkedSurahList.length > 0 && !searchQuery && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Star className="text-amber-500 fill-amber-500" size={24} />
                <h3 className="text-2xl font-black text-slate-800">{isUrdu ? 'محفوظ کردہ سورتیں' : 'Saved Surahs'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookmarkedSurahList.map(s => (
                  <SurahCard 
                    key={s.id} 
                    surah={s} 
                    isBookmarked={true} 
                    onToggleBookmark={() => toggleBookmark(s.id)} 
                    onSelect={() => handleSurahClick(s)}
                    lang={lang}
                  />
                ))}
              </div>
              <div className="h-[1px] bg-slate-200 mt-8"></div>
            </section>
          )}

          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800">{isUrdu ? 'تمام ۱۱۴ سورتیں' : 'All 114 Surahs'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSurahs.map(s => (
                <SurahCard 
                  key={s.id} 
                  surah={s} 
                  isBookmarked={bookmarks.includes(s.id)} 
                  onToggleBookmark={() => toggleBookmark(s.id)} 
                  onSelect={() => handleSurahClick(s)}
                  lang={lang}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-slate-800">{isUrdu ? 'تمام ۳۰ پارے' : 'All 30 Juz (Paras)'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                onClick={() => handleJuzClick(i + 1)}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all cursor-pointer group text-center"
              >
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {i + 1}
                 </div>
                 <h4 className="font-black text-slate-800 text-xl">{isUrdu ? `پارہ ${i + 1}` : `Juz ${i + 1}`}</h4>
                 <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">{isUrdu ? 'مطالعہ کریں' : 'Click to Read'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pt-20 border-t border-slate-200">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Info size={24} />
          </div>
          <div>
             <h3 className="text-2xl font-black text-slate-800">{isUrdu ? 'قرآن فہمی' : 'Knowledge Hub: Quran'}</h3>
             <p className="text-slate-500 font-bold">{isUrdu ? 'علم اور حکمت کی باتیں' : 'Wisdom and Guidance'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quranArticles.map((art, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:border-emerald-500 transition-all group shadow-sm">
               <div className="w-12 h-12 rounded-xl bg-slate-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {art.icon}
               </div>
               <h4 className="text-xl font-black text-slate-800 mb-4">{art.title}</h4>
               <p className="text-slate-500 leading-relaxed text-sm">{art.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SurahCard: React.FC<{ surah: Surah; isBookmarked: boolean; onToggleBookmark: () => void; onSelect: () => void; lang: Language }> = ({ surah, isBookmarked, onToggleBookmark, onSelect, lang }) => {
  const isUrdu = lang === 'ur';
  return (
    <div 
      onClick={onSelect}
      className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg shadow-inner">
          {surah.id}
        </div>
        <div className="flex gap-1">
           <button 
             onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
             className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'text-slate-300 hover:bg-slate-100 hover:text-emerald-500'}`}
           >
              {isBookmarked ? <BookmarkCheck size={22} fill="currentColor" /> : <Bookmark size={22} />}
           </button>
        </div>
      </div>
      <h3 className="font-black text-slate-800 text-xl mb-1">{surah.name}</h3>
      <p className="text-slate-500 font-bold text-sm mb-5">{surah.english}</p>
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-t border-slate-50 pt-4">
        <span>{surah.verses} {isUrdu ? 'آیات' : 'Verses'}</span>
        <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-500">{surah.type}</span>
      </div>
    </div>
  );
};

export default QuranReader;
