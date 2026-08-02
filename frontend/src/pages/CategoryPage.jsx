import React, { useState } from 'react';
import { Tag, Sparkles, Zap, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../utils/api';

const CategoryPage = () => {
  const [predictedKwh, setPredictedKwh] = useState(240);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/predict/customer-category', { predicted_kwh: parseFloat(predictedKwh) });
      setResult(res.data);
    } catch (err) {
      alert("Classification check failed.");
    } finally {
      setLoading(false);
    }
  };

  const predefinedCategories = [
    { title: '0–150 kWh', badge: '🟢 Eco User', category: 'Low Consumption', desc: 'Domestic Lifeline Tariff (₹4.2 / kWh)', color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' },
    { title: '151–350 kWh', badge: '🟡 Standard User', category: 'Normal Consumption', desc: 'Standard Residential Slab 2 (₹6.5 / kWh)', color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30' },
    { title: '351–600 kWh', badge: '🟠 Heavy User', category: 'High Consumption', desc: 'Commercial / High-Load Slab 3 (₹9.0 / kWh)', color: 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30' },
    { title: '600+ kWh', badge: '🔴 Industrial Level', category: 'Industrial Level', desc: 'Industrial Bulk Tariff (₹11.5 / kWh)', color: 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Header */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Tag className="w-4 h-4" />
                <span>Customer Category Feature</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Check Customer Category
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Classify building energy demand into standardized tariff slabs and unlock tailored monthly energy-saving tips.
              </p>
            </div>
          </div>

          {/* Interactive Check Tool */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <form onSubmit={handleCheckCategory} className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Enter Monthly Predicted Consumption (kWh)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    step="1"
                    required
                    value={predictedKwh}
                    onChange={(e) => setPredictedKwh(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
                    placeholder="e.g. 280"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md transition-transform hover:scale-105 flex items-center space-x-2 shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loading ? "Checking..." : "Classify Tier"}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Classification Output */}
            {result && (
              <div className="p-6 rounded-2xl border-2 bg-white dark:bg-slate-900 shadow-xl space-y-4 animate-fade-in" style={{ borderColor: result.code }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Classified Tier Result</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold text-white" style={{ backgroundColor: result.code }}>
                    {result.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-500 font-semibold block">Suitable Tariff Structure</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{result.suitable_tariff}</p>
                    <span className="text-xs font-bold text-emerald-500 block">
                      Estimated Saving Potential: +{result.savings_potential_percent}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-500 font-semibold block">Tailored Monthly Energy Saving Tips</span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {result.recommendations.map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reference Category Slabs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Standardized Category Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {predefinedCategories.map((cat, idx) => (
                <div key={idx} className={`glass-card rounded-2xl p-5 border-2 ${cat.color} space-y-2`}>
                  <span className="text-xs font-bold text-slate-500 block">{cat.title}</span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{cat.badge}</h4>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cat.category}</p>
                  <span className="text-[11px] text-slate-500 block font-medium pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    {cat.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
