
import React from 'react';
import { Calculator, Wallet, Coins, Briefcase, Landmark, Info, HandHeart, Scale, CreditCard } from 'lucide-react';

const ZakatCalculator: React.FC<{ lang?: 'ur' | 'en' }> = ({ lang = 'ur' }) => {
  const isUrdu = lang === 'ur';
  const [values, setValues] = React.useState({
    cash: 0,
    gold: 0,
    silver: 0,
    stocks: 0,
    business: 0,
    debts: 0
  });

  const assets = values.cash + values.gold + values.silver + values.stocks + values.business;
  const netWealth = Math.max(0, assets - values.debts);
  const zakat = netWealth * 0.025;
  
  // Revised Nisab (approx 52.5 tolas of silver in PKR)
  const nisab = 195000; 

  const handleChange = (field: string, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    setValues(prev => ({ ...prev, [field]: isNaN(numVal) ? 0 : numVal }));
  };

  const zakatArticles = [
    {
      title: isUrdu ? "زکوٰۃ کا سماجی اثر" : "Social Impact of Zakat",
      content: isUrdu 
        ? "زکوٰۃ دولت کی منصفانہ تقسیم کو یقینی بناتی ہے اور معاشرے سے غربت کے خاتمے میں اہم کردار ادا کرتی ہے۔"
        : "Zakat ensures fair distribution of wealth and plays a vital role in eradicating poverty from society.",
      icon: <HandHeart size={20} />
    },
    {
      title: isUrdu ? "نصاب کیا ہے؟" : "What is Nisab?",
      content: isUrdu
        ? "نصاب دولت کی وہ مخصوص مقدار ہے جس پر زکوٰۃ فرض ہوتی ہے۔ یہ عام طور پر 87.48 گرام سونا یا 612.36 گرام چاندی کی مالیت کے برابر ہوتا ہے۔"
        : "Nisab is the minimum amount of wealth a Muslim must possess before Zakat becomes obligatory. It is usually equivalent to 87.48g of gold or 612.36g of silver.",
      icon: <Scale size={20} />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{isUrdu ? 'زکوٰۃ کیلکولیٹر (PKR)' : 'Zakat Calculator (PKR)'}</h2>
        <p className="text-slate-500 text-lg font-medium">{isUrdu ? 'پاکستانی روپے میں اپنی زکوٰۃ کا درست حساب لگائیں۔' : 'Calculate your Zakat accurately in Pakistani Rupees.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
              <Calculator size={24} />
            </div>
            <h3 className="font-black text-xl text-slate-800">{isUrdu ? 'مالی تفصیلات' : 'Financial Details'}</h3>
          </div>

          <div className="space-y-6">
            {[
              { id: 'cash', label: isUrdu ? 'نقدی / بینک بیلنس' : 'Cash / Bank balance', icon: Wallet, type: 'asset' },
              { id: 'gold', label: isUrdu ? 'سونے کی مالیت' : 'Gold Value', icon: Coins, type: 'asset' },
              { id: 'silver', label: isUrdu ? 'چاندی کی مالیت' : 'Silver Value', icon: Coins, type: 'asset' },
              { id: 'stocks', label: isUrdu ? 'سرمایہ کاری / شیئرز' : 'Investments / Stocks', icon: Landmark, type: 'asset' },
              { id: 'business', label: isUrdu ? 'کاروباری مال' : 'Business Inventory', icon: Briefcase, type: 'asset' },
              { id: 'debts', label: isUrdu ? 'واجب الادا قرضے (-)' : 'Debts Payable (-)', icon: CreditCard, type: 'debt' },
            ].map(item => (
              <div key={item.id} className="space-y-2">
                <label className={`text-sm font-black flex items-center gap-2 ${item.type === 'debt' ? 'text-red-500' : 'text-slate-500'}`}>
                  <item.icon size={16} />
                   {item.label}
                </label>
                <div className="relative">
                  <span className={`absolute ${isUrdu ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 font-black text-xs ${item.type === 'debt' ? 'text-red-400' : 'text-slate-300'}`}>
                    {isUrdu ? 'PKR' : 'PKR'}
                  </span>
                  <input
                    type="number"
                    value={values[item.id as keyof typeof values] || ''}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    className={`w-full px-8 py-5 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-black text-xl ${
                        item.type === 'debt' 
                        ? 'border-red-50 focus:border-red-400 focus:bg-white' 
                        : 'border-slate-100 focus:bg-white focus:border-emerald-500 shadow-inner'
                    }`}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between flex-1">
            <div className="relative z-10">
              <h3 className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.4em] mb-10">{isUrdu ? 'حساب کتاب' : 'Calculation Summary'}</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <p className="text-emerald-100/70 text-sm font-bold">{isUrdu ? 'مجموعی اثاثے' : 'Total Assets'}</p>
                  <p className="text-xl font-black tabular-nums">PKR {assets.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <p className="text-red-300/70 text-sm font-bold">{isUrdu ? 'کل واجبات' : 'Total Debts'}</p>
                  <p className="text-xl font-black tabular-nums text-red-300">PKR {values.debts.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-end pb-4 pt-6">
                  <p className="text-emerald-200 font-black text-lg">{isUrdu ? 'خالص دولت' : 'Net Taxable Wealth'}</p>
                  <p className="text-3xl font-black tabular-nums">PKR {netWealth.toLocaleString()}</p>
                </div>
                
                <div className="pt-10 mt-6 border-t border-white/10">
                  <p className="text-amber-400 font-black text-xl mb-2">{isUrdu ? 'واجب الادا زکوٰۃ (2.5%)' : 'Total Zakat Due (2.5%)'}</p>
                  <p className="text-6xl font-black text-amber-400 tabular-nums drop-shadow-xl">
                    PKR {Math.round(zakat).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 p-6 bg-white/5 rounded-3xl border border-white/10 flex gap-4 backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-900 flex items-center justify-center shrink-0 shadow-lg">
                    <Scale size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-emerald-300">{isUrdu ? 'نصاب الرٹ' : 'Nisab Status'}</p>
                    <p className="text-sm text-emerald-50 leading-relaxed font-bold">
                        {netWealth >= nisab 
                          ? (isUrdu ? `آپ پر زکوٰۃ فرض ہے۔ نصاب کی حد ${nisab.toLocaleString()} روپے ہے۔` : `Zakat is obligatory. Nisab threshold is Rs. ${nisab.toLocaleString()}.`)
                          : (isUrdu ? `آپ کی دولت نصاب (${nisab.toLocaleString()} روپے) سے کم ہے۔` : `Below Nisab threshold (Rs. ${nisab.toLocaleString()}).`)}
                    </p>
                </div>
            </div>
            
            {/* Background Icon */}
            <i className="fa-solid fa-coins absolute -bottom-10 -left-10 text-white/5 text-[200px] -rotate-12"></i>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-slate-500 text-sm italic leading-relaxed text-center font-bold shadow-sm">
            {isUrdu 
              ? '"اور زکوٰۃ ادا کرو اور اللہ کو قرضِ حسنہ دو۔" (المزمل: 20)'
              : '"And establish prayer and give zakah and loan Allah a goodly loan." (73:20)'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
