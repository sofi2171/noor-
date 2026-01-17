
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Calculator, 
  MessageSquareQuote,
  Compass,
  Menu,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Fingerprint,
  X
} from 'lucide-react';
import { ActiveTab, Language } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, lang, setLang }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isUrdu = lang === 'ur';

  const translations = {
    dashboard: isUrdu ? 'ڈیش بورڈ' : 'Dashboard',
    quran: isUrdu ? 'قرآن مجید' : 'Quran Explorer',
    hadith: isUrdu ? 'حدیث ٹول' : 'Hadith Tool',
    scholar: isUrdu ? 'اے آئی عالم' : 'AI Scholar',
    zakat: isUrdu ? 'زکوٰۃ کیلکولیٹر' : 'Zakat Calculator',
    qibla: isUrdu ? 'قبلہ نما' : 'Qibla Finder',
    tasbeeh: isUrdu ? 'تسبیح کاؤنٹر' : 'Tasbeeh Counter',
    appName: isUrdu ? 'نور اسلامک ہب' : 'Noor Hub',
    footerDesc: isUrdu ? 'امت مسلمہ کے لیے ایک مکمل ڈیجیٹل ساتھی۔' : 'A complete digital companion for the Ummah.',
    quickLinks: isUrdu ? 'فوری لنکس' : 'Quick Links',
    contact: isUrdu ? 'رابطہ کریں' : 'Contact Us'
  };

  const navItems = [
    { id: 'dashboard', label: translations.dashboard, icon: LayoutDashboard },
    { id: 'quran', label: translations.quran, icon: BookOpen },
    { id: 'hadith', label: translations.hadith, icon: Search },
    { id: 'scholar', label: translations.scholar, icon: MessageSquareQuote },
    { id: 'tasbeeh', label: translations.tasbeeh, icon: Fingerprint },
    { id: 'zakat', label: translations.zakat, icon: Calculator },
    { id: 'qibla', label: translations.qibla, icon: Compass },
  ];

  return (
    <div className={`min-h-screen flex bg-slate-50 text-slate-900 ${isUrdu ? 'font-urdu' : 'font-sans'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Sidebar - Desktop and Mobile */}
      <aside 
        className={`fixed inset-y-0 ${isUrdu ? 'right-0' : 'left-0'} z-[100] w-72 bg-emerald-950 text-white transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : (isUrdu ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 rotate-3 group hover:rotate-0 transition-transform">
                <i className="fa-solid fa-mosque text-emerald-950 text-2xl"></i>
              </div>
              <h1 className="text-2xl font-black tracking-tight">{translations.appName}</h1>
            </div>
            <button className="lg:hidden p-2 text-emerald-200" onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id 
                  ? 'bg-amber-400 text-emerald-950 font-black shadow-xl shadow-amber-400/20 scale-[1.02]' 
                  : 'hover:bg-white/5 text-emerald-100/70 hover:text-white'
                }`}
              >
                <div className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-emerald-950' : 'text-emerald-500'}`}>
                    <item.icon size={22} />
                </div>
                <span className="text-base font-bold tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-[10px] font-black">NI</div>
                <div>
                    <p className="text-xs font-black text-white">{isUrdu ? 'پریمیم ورژن' : 'Premium Hub'}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active</p>
                </div>
            </div>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.3em] text-center">
                © {new Date().getFullYear()} {translations.appName}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative no-scrollbar">
        {/* Transparent Header */}
        <header className="sticky top-0 z-40 bg-slate-50/70 backdrop-blur-2xl border-b border-slate-200/50 px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-3 bg-white border border-slate-200 text-emerald-900 rounded-2xl shadow-sm active:scale-90 transition-transform"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
                <h2 className="text-xl font-black text-slate-800 capitalize tracking-tight">
                    {translations[activeTab as keyof typeof translations]}
                </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex flex-col items-center border-x border-slate-200 px-8">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-0.5">{isUrdu ? 'اسلامی تاریخ' : 'Islamic Date'}</p>
              <p className="font-black text-emerald-800 text-sm">
                {new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-GB', { dateStyle: 'long' })}
              </p>
            </div>

            <button 
              onClick={() => setLang(isUrdu ? 'en' : 'ur')}
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-sm font-black transition-all shadow-sm active:scale-95"
            >
              <Globe size={18} className="text-emerald-600" />
              <span>{isUrdu ? 'ENGLISH' : 'اردو'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 lg:p-12 w-full max-w-[1400px] mx-auto">
          <div className="min-h-full">
            {children}
          </div>
          
          {/* Footer inside the scrollable area */}
          <footer className="mt-32 pt-20 border-t border-slate-200 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                <div className="md:col-span-2 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-amber-400">
                            <i className="fa-solid fa-star-and-crescent"></i>
                        </div>
                        <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">{translations.appName}</h2>
                    </div>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">{translations.footerDesc}</p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
                            <button key={i} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-500 hover:shadow-lg transition-all flex items-center justify-center">
                                <Icon size={20} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-[0.3em] pb-2 border-b-2 border-emerald-100">{translations.quickLinks}</h3>
                    <ul className="space-y-4">
                        {navItems.slice(0, 5).map(item => (
                            <li 
                              key={item.id} 
                              className="text-slate-500 font-bold hover:text-emerald-600 cursor-pointer transition-colors flex items-center gap-2" 
                              onClick={() => { setActiveTab(item.id as ActiveTab); window.scrollTo(0,0); }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-200 group-hover:bg-emerald-600"></div>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-[0.3em] pb-2 border-b-2 border-emerald-100">{translations.contact}</h3>
                    <div className="space-y-2">
                        <p className="text-slate-500 font-bold">support@noorhub.com</p>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {isUrdu ? 'اسلامی تعلیمات کو جدید دور کے مطابق عام کرنے کا ایک ادنیٰ ذریعہ۔' : 'A premium attempt to digitize Islamic wisdom for the global community.'}
                        </p>
                    </div>
                    <div className="pt-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            SYSTEM ONLINE
                        </div>
                    </div>
                </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-emerald-950/40 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
