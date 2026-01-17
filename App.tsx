
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuranReader from './components/QuranReader';
import HadithExplorer from './components/HadithExplorer';
import AIScholar from './components/AIScholar';
import ZakatCalculator from './components/ZakatCalculator';
import QiblaFinder from './components/QiblaFinder';
import TasbeehCounter from './components/TasbeehCounter';
import { ActiveTab, PrayerTimes, Language } from './types';

function App() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('dashboard');
  const [lang, setLang] = React.useState<Language>('ur');
  const [prayerTimes, setPrayerTimes] = React.useState<PrayerTimes | null>(null);
  const [coords, setCoords] = React.useState<{lat: number, lng: number} | null>(null);
  const [locationName, setLocationName] = React.useState(lang === 'ur' ? 'لوکیشن تلاش کی جا رہی ہے...' : 'Detecting location...');

  const fetchWithRetry = async (url: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  const getCityName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.state || "Unknown";
      const country = data.address.country || "";
      setLocationName(`${city}, ${country}`);
    } catch (e) {
      console.error("Reverse geocoding failed", e);
      setLocationName(lang === 'ur' ? 'آپ کا مقام' : 'Your Location');
    }
  };

  const fetchPrayerTimes = async (lat: number, lon: number) => {
    try {
      const data = await fetchWithRetry(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
      if (data && data.data && data.data.timings) {
        const timings = data.data.timings;
        setPrayerTimes({
          Fajr: timings.Fajr,
          Sunrise: timings.Sunrise,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha,
        });
      }
    } catch (err) {
      console.error("Error fetching prayer times:", err);
    }
  };

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          fetchPrayerTimes(lat, lng);
          getCityName(lat, lng);
        },
        () => {
          // Default to Mecca if permission denied
          const lat = 21.4225;
          const lng = 39.8262;
          setCoords({ lat, lng });
          fetchPrayerTimes(lat, lng);
          setLocationName(lang === 'ur' ? 'مکہ مکرمہ' : 'Mecca');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // Default to Mecca
      const lat = 21.4225;
      const lng = 39.8262;
      setCoords({ lat, lng });
      fetchPrayerTimes(lat, lng);
      setLocationName(lang === 'ur' ? 'مکہ مکرمہ' : 'Mecca');
    }
  }, [lang]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard prayerTimes={prayerTimes} locationName={locationName} lang={lang} />;
      case 'hadith':
        return <HadithExplorer lang={lang} />;
      case 'scholar':
        return <AIScholar lang={lang} />;
      case 'zakat':
        return <ZakatCalculator lang={lang} />;
      case 'quran':
        return <QuranReader lang={lang} />;
      case 'qibla':
        return <QiblaFinder lang={lang} coords={coords} />;
      case 'tasbeeh':
        return <TasbeehCounter lang={lang} />;
      default:
        return <Dashboard prayerTimes={prayerTimes} locationName={locationName} lang={lang} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang}>
      {renderContent()}
    </Layout>
  );
}

export default App;
