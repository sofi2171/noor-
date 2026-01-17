
import React from 'react';
import { Compass, Info, MapPin, Navigation, ShieldCheck, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
  coords: { lat: number; lng: number } | null;
}

const QiblaFinder: React.FC<Props> = ({ lang, coords }) => {
  const isUrdu = lang === 'ur';
  const [qiblaAngle, setQiblaAngle] = React.useState<number | null>(null);
  const [compassHeading, setCompassHeading] = React.useState(0);
  const [distance, setDistance] = React.useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = React.useState(false);

  // Calculate Qibla Bearing and Distance
  React.useEffect(() => {
    if (coords) {
      const PI = Math.PI;
      const latMecca = 21.4225 * PI / 180;
      const lonMecca = 39.8262 * PI / 180;
      const phi1 = coords.lat * PI / 180;
      const lambda1 = coords.lng * PI / 180;

      const y = Math.sin(lonMecca - lambda1);
      const x = Math.cos(phi1) * Math.tan(latMecca) - Math.sin(phi1) * Math.cos(lonMecca - lambda1);
      const qibla = (Math.atan2(y, x) * 180 / PI + 360) % 360;
      
      setQiblaAngle(qibla);

      // Distance using Haversine
      const R = 6371; // km
      const dLat = latMecca - phi1;
      const dLon = lonMecca - lambda1;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(phi1) * Math.cos(latMecca) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      setDistance(Math.round(R * c));
    }
  }, [coords]);

  const requestPermission = () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            setPermissionGranted(true);
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    let heading = 0;
    if ((e as any).webkitCompassHeading) {
      heading = (e as any).webkitCompassHeading;
    } else if (e.absolute && e.alpha !== null) {
      heading = 360 - e.alpha;
    }
    setCompassHeading(heading);
  };

  const isAligned = qiblaAngle !== null && Math.abs((compassHeading + qiblaAngle) % 360) < 5;

  const qiblaArticles = [
    {
      title: isUrdu ? "قبلہ کی تاریخ اور اہمیت" : "History & Importance of Qibla",
      content: isUrdu 
        ? "مسلمانوں کے لیے کعبہ کی طرف رخ کرنا محض ایک سمت نہیں بلکہ اتحاد اور مرکزیت کی علامت ہے۔ ہجرت کے دوسرے سال میں قبلہ کی تبدیلی کا حکم دیا گیا تھا۔"
        : "For Muslims, facing the Kaaba is more than a direction; it's a symbol of unity and focus. The command to change the Qibla was revealed in the second year of Hijrah.",
      icon: <Navigation size={20} />
    },
    {
      title: isUrdu ? "قبلہ کی درستگی کے طریقے" : "Methods for Qibla Accuracy",
      content: isUrdu
        ? "قدیم زمانے میں سورج اور ستاروں سے قبلہ معلوم کیا جاتا تھا، لیکن آج ڈیجیٹل کمپاس اور جی پی ایس نے اسے انتہائی آسان بنا دیا ہے۔"
        : "In ancient times, the sun and stars were used to determine Qibla. Today, digital compasses and GPS have made it extremely accessible and precise.",
      icon: <MapPin size={20} />
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800">{isUrdu ? 'پروفیشنل قبلہ فائنڈر' : 'Professional Qibla Finder'}</h2>
        <p className="text-slate-500 text-lg">
          {isUrdu ? 'آپ کے موجودہ مقام سے کعبہ شریف کی درست سمت معلوم کریں۔' : 'Calculate the exact direction of the Kaaba from your current GPS location.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Compass Visualization */}
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Compass Base */}
            <div className="absolute inset-0 rounded-full border-[16px] border-emerald-900 shadow-3xl bg-white flex items-center justify-center overflow-hidden">
               {/* Degree Marks */}
               {[...Array(12)].map((_, i) => (
                 <div key={i} className="absolute inset-0 py-2 flex justify-center" style={{ transform: `rotate(${i * 30}deg)` }}>
                    <div className="w-1 h-3 bg-slate-200 rounded-full"></div>
                 </div>
               ))}
               
               {/* Static North Label */}
               <div className="absolute top-8 font-black text-slate-300 text-sm">N</div>
               <div className="absolute bottom-8 font-black text-slate-300 text-sm">S</div>

               {/* Rotating Needle Container */}
               <div 
                className="absolute inset-0 transition-transform duration-150 ease-out"
                style={{ transform: `rotate(${(qiblaAngle || 0) - compassHeading}deg)` }}
               >
                  {/* Kaaba Marker */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg border-2 border-amber-400 animate-bounce">
                        <i className="fa-solid fa-kaaba text-xl"></i>
                    </div>
                    <div className="w-2 h-20 bg-emerald-700 rounded-full mt-2"></div>
                  </div>
               </div>

               {/* Center Hub */}
               <div className={`z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all ${isAligned ? 'bg-emerald-600 scale-110' : 'bg-slate-100'}`}>
                   <span className={`text-xs font-black uppercase tracking-tighter ${isAligned ? 'text-white' : 'text-slate-400'}`}>Qibla</span>
                   <span className={`text-2xl font-black ${isAligned ? 'text-white' : 'text-emerald-900'}`}>{Math.round(qiblaAngle || 0)}°</span>
               </div>
            </div>

            {/* Success Glow */}
            {isAligned && (
              <div className="absolute -inset-4 rounded-full bg-emerald-500/10 animate-ping pointer-events-none"></div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
             {!permissionGranted && (
               <button 
                onClick={requestPermission}
                className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-800 transition-all flex items-center gap-3"
               >
                 <Compass size={24} />
                 {isUrdu ? 'کمپاس فعال کریں' : 'Enable Compass Sensors'}
               </button>
             )}
             <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 text-slate-700 font-bold">
                <MapPin className="text-emerald-600" size={20} />
                <span>{distance ? `${distance} km ${isUrdu ? 'فاصلہ' : 'away'}` : 'Calculating...'}</span>
             </div>
          </div>
        </div>

        {/* Informational Panel */}
        <div className="space-y-8">
          <div className="bg-emerald-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="text-amber-400" />
                   <h3 className="font-bold text-lg uppercase tracking-widest">{isUrdu ? 'درستگی کا درجہ' : 'Precision Status'}</h3>
                </div>
                <h4 className="text-3xl font-black">{isUrdu ? 'آپ بالکل درست سمت میں ہیں' : 'Mathematically Accurate'}</h4>
                <p className="text-emerald-100/70 leading-relaxed text-lg italic">
                  {isUrdu 
                    ? 'یہ ٹول آپ کے جی پی ایس کوآرڈینیٹس اور زمین کی گولائی (Spherical Trigonometry) کو مدنظر رکھتے ہوئے حساب لگاتا ہے۔'
                    : 'This tool uses your exact GPS coordinates and spherical trigonometry to calculate the shortest path to Mecca.'}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[10px] uppercase font-black text-emerald-300 tracking-widest">{isUrdu ? 'طول بلد' : 'Latitude'}</p>
                    <p className="font-bold text-lg">{coords?.lat.toFixed(4)}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-[10px] uppercase font-black text-emerald-300 tracking-widest">{isUrdu ? 'عرض بلد' : 'Longitude'}</p>
                    <p className="font-bold text-lg">{coords?.lng.toFixed(4)}</p>
                  </div>
                </div>
             </div>
             <i className="fa-solid fa-compass absolute -bottom-10 -right-10 text-white/5 text-[250px] -rotate-12"></i>
          </div>

          <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-6 items-start">
             <div className="p-3 bg-amber-400 text-emerald-900 rounded-2xl shadow-lg">
                <HelpCircle size={28} />
             </div>
             <div>
                <h5 className="font-black text-emerald-950 text-xl mb-2">{isUrdu ? 'کیا آپ جانتے ہیں؟' : 'Did you know?'}</h5>
                <p className="text-emerald-900/70 leading-relaxed">
                   {isUrdu 
                     ? 'دنیا کے کسی بھی مقام سے کعبہ کی سمت معلوم کرنے کے لیے سائن (Sine) اور کوسائن (Cosine) کے قوانین استعمال کیے جاتے ہیں۔'
                     : 'Calculating the Qibla from any point on Earth involves applying the Law of Sines and Cosines for spherical geometry.'}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Articles Section for Qibla */}
      <section className="pt-20 border-t border-slate-200">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Info size={24} />
          </div>
          <div>
             <h3 className="text-2xl font-black text-slate-800">{isUrdu ? 'قبلہ کے بارے میں معلومات' : 'Knowledge Hub: Qibla'}</h3>
             <p className="text-slate-500 font-bold">{isUrdu ? 'روحانی اور علمی پہلو' : 'Spiritual and Scientific Insights'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {qiblaArticles.map((art, i) => (
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

export default QiblaFinder;
