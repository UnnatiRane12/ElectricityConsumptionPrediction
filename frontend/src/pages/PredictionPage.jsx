import React, { useState } from 'react';
import { 
  Zap, 
  SunMedium, 
  CalendarDays, 
  Thermometer, 
  Droplets, 
  Maximize2, 
  Users, 
  Wind, 
  Lightbulb, 
  Sun, 
  Calendar, 
  Sparkles, 
  Receipt, 
  BarChart3, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  Cpu
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import BillPreview from '../components/BillPreview';
import InsightCard from '../components/InsightCard';
import PredictionAnalyticsModal from '../components/PredictionAnalyticsModal';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PredictionPage = () => {
  const { user } = useAuth();

  // Tab State: 'daily' | 'monthly'
  const [activeTab, setActiveTab] = useState('daily');

  // Input Form Data
  const [formData, setFormData] = useState({
    Month: 7,
    DayOfWeek: 2,
    IsHoliday: 0,
    Temperature: 28.5,
    Humidity: 55,
    SquareFootArea: 1800,
    Occupancy: 3,
    HVACUsage: 6.5,
    LightingUsage: 5.0,
    RenewableEnergy: 12.0,
    category: 'Residential'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Interactive Category Dropdown Selection
  const [selectedCategory, setSelectedCategory] = useState('Residential');

  // Modals State
  const [showBillModal, setShowBillModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : parseInt(value, 10)
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = activeTab === 'daily' ? '/predict/daily' : '/predict/monthly';
      const payload = { ...formData, category: selectedCategory };
      const res = await api.post(endpoint, payload);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "XGBoost Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  // Instant Bill Recalculation on Category Dropdown Change
  const handleCategoryChange = async (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setFormData(prev => ({ ...prev, category: newCategory }));

    if (result) {
      try {
        const res = await api.post('/predict/recalculate-bill', {
          predicted_kwh: result.predicted_kwh,
          category: newCategory,
          is_monthly: activeTab === 'monthly'
        });
        setResult(prev => ({
          ...prev,
          category: newCategory,
          bill_info: res.data
        }));
      } catch (err) {
        console.error("Recalculate bill error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Top Header Banner */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-cyan-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>XGBoost ML Prediction Workspace</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Electricity Consumption Prediction
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Unified workspace to compute forecasts, switch customer categories, view prediction analytics, and generate bills.
              </p>
            </div>

            {/* Segmented Top Tabs */}
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl space-x-1 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('daily');
                  setResult(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'daily'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SunMedium className="w-4 h-4" />
                <span>Daily Prediction</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('monthly');
                  setResult(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Monthly Prediction</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  {activeTab === 'daily' ? <SunMedium className="w-4 h-4 text-cyan-500" /> : <CalendarDays className="w-4 h-4 text-emerald-500" />}
                  <span>{activeTab === 'daily' ? 'Daily Parameters' : 'Monthly Parameters'}</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  XGBoost v2.0
                </span>
              </div>

              <form onSubmit={handlePredict} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Month */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Month</span>
                    </label>
                    <select
                      name="Month"
                      value={formData.Month}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    >
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                        <option key={idx} value={idx + 1}>{m} (Month {idx + 1})</option>
                      ))}
                    </select>
                  </div>

                  {/* Day of Week (Daily tab only) */}
                  {activeTab === 'daily' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Day of Week
                      </label>
                      <select
                        name="DayOfWeek"
                        value={formData.DayOfWeek}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d, idx) => (
                          <option key={idx} value={idx}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Holiday (Daily tab only) */}
                  {activeTab === 'daily' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Holiday / Weekend
                      </label>
                      <select
                        name="IsHoliday"
                        value={formData.IsHoliday}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                      >
                        <option value={0}>No (Regular Working Day)</option>
                        <option value={1}>Yes (Holiday / Weekend)</option>
                      </select>
                    </div>
                  )}

                  {/* Temperature */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                      <span>Temperature (°C)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Temperature"
                      value={formData.Temperature}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>

                  {/* Humidity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span>Humidity (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Humidity"
                      value={formData.Humidity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>

                  {/* Square Foot Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Maximize2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Square Foot Area</span>
                    </label>
                    <input
                      type="number"
                      name="SquareFootArea"
                      value={formData.SquareFootArea}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>

                  {/* Occupancy */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Occupants</span>
                    </label>
                    <input
                      type="number"
                      name="Occupancy"
                      value={formData.Occupancy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>

                  {/* HVAC Usage */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Wind className="w-3.5 h-3.5 text-teal-500" />
                      <span>HVAC Usage (hours/day)</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      name="HVACUsage"
                      value={formData.HVACUsage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>

                  {/* Lighting Usage */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lighting Usage (hours/day)</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      name="LightingUsage"
                      value={formData.LightingUsage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>

                  {/* Renewable Energy */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Renewable Offset (%)</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      name="RenewableEnergy"
                      value={formData.RenewableEnergy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 mt-4"
                >
                  <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? "Running XGBoost Model..." : `Predict ${activeTab === 'daily' ? 'Daily' : 'Monthly'} Consumption`}</span>
                </button>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5">
              {result ? (
                <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl animate-fade-in overflow-hidden">

                  {/* Header strip */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      XGBoost Prediction Output
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 fill-current" /> {result.model_used}
                    </span>
                  </div>

                  {/* Predicted kWh Banner */}
                  <div className="mx-6 mb-5 bg-slate-900 text-white rounded-2xl px-6 py-7 text-center space-y-3">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                      Predicted {activeTab === 'daily' ? 'Daily' : 'Monthly'} Consumption
                    </span>
                    <div className="text-6xl font-extrabold text-cyan-400 leading-none">
                      {result.predicted_kwh.toFixed(2)}
                      <span className="text-xl text-slate-400 font-normal ml-2">kWh</span>
                    </div>
                    <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                      <span>Confidence: <b className="text-emerald-400">{result.confidence}%</b></span>
                      <span>Status: <b className="text-amber-400">{result.status}</b></span>
                    </div>
                  </div>

                  {/* Category + Bill Info */}
                  <div className="mx-6 mb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-cyan-500" />
                        Customer Category
                      </label>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: result.bill_info.color || '#0EA5E9' }}
                      >
                        {result.bill_info.badge}
                      </span>
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="w-full px-3 py-2.5 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
                    >
                      <option value="Residential">Residential — ₹6.50 / kWh</option>
                      <option value="Commercial">Commercial — ₹9.20 / kWh</option>
                      <option value="Industrial">Industrial — ₹11.50 / kWh</option>
                      <option value="Agricultural">Agricultural — ₹3.50 / kWh</option>
                    </select>

                    {/* Bill summary */}
                    <div className="bg-slate-100 dark:bg-slate-800/70 rounded-xl px-4 py-3">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Estimated Bill</span>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{result.bill_info.total_amount?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 pb-6 space-y-2.5">
                    <button
                      onClick={() => setShowAnalyticsModal(true)}
                      className="w-full py-3 rounded-xl text-sm font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/80 border border-cyan-200 dark:border-cyan-800 transition-all flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Prediction Analytics
                    </button>

                    <button
                      onClick={() => setShowBillModal(true)}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      Generate Electricity Bill
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Ready for XGBoost Prediction</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1.5 leading-relaxed">
                      Select Daily or Monthly tab, fill building specs, and press Predict to start the AI forecast flow.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights Panel */}
          {result && <InsightCard insights={result.insights} />}
        </main>
      </div>

      {/* Prediction Analytics Modal */}
      {showAnalyticsModal && result && (
        <PredictionAnalyticsModal
          predictionResult={{ ...result, inputs: formData }}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {/* Bill Preview Modal */}
      {showBillModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBillModal(false)}
              className="no-print absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 bg-slate-200 dark:bg-slate-800 transition-all text-sm font-bold"
            >
              ✕
            </button>
            <BillPreview
              billData={{
                bill_number: `INV-${activeTab === 'daily' ? 'D' : 'M'}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                prediction_type: activeTab,
                predicted_units: result.predicted_kwh,
                tariff_rate: result.bill_info.tariff_rate,
                energy_charge: result.bill_info.energy_charge,
                fixed_charge: result.bill_info.fixed_charge,
                taxes: result.bill_info.taxes,
                total_amount: result.bill_info.total_amount,
                category: selectedCategory,
                user_id: user?.id || 101
              }}
              customerName={user?.full_name || 'Alex Mercer'}
              customerEmail={user?.email || 'alex@example.com'}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PredictionPage;
