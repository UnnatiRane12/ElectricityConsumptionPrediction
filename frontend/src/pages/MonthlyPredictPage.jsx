import React, { useState } from 'react';
import { 
  CalendarDays, 
  Thermometer, 
  Droplets, 
  Maximize2, 
  Users, 
  Wind, 
  Lightbulb, 
  Sun, 
  Sparkles, 
  Receipt, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import BillPreview from '../components/BillPreview';
import InsightCard from '../components/InsightCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MonthlyPredictPage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    Month: 6,
    Temperature: 32.0,
    Humidity: 65,
    SquareFootArea: 2200,
    Occupancy: 4,
    HVACUsage: 8.5,
    LightingUsage: 6.0,
    RenewableEnergy: 10.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : parseInt(value, 10)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/predict/monthly', formData);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Monthly prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Header Banner */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CalendarDays className="w-4 h-4" />
                <span>Monthly Module</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Monthly Electricity Consumption Prediction
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Forecast full 30-day energy requirements (kWh), calculate average daily load, and derive total utility bill amounts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Month */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Target Month
                    </label>
                    <select
                      name="Month"
                      value={formData.Month}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    >
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                        <option key={idx} value={idx + 1}>{m} (Month {idx + 1})</option>
                      ))}
                    </select>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                      <span>Avg Temperature (°C)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Temperature"
                      value={formData.Temperature}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  {/* Humidity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span>Avg Humidity (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Humidity"
                      value={formData.Humidity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
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
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
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
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
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
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
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
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
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
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 mt-4"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? "Computing Forecast..." : "Predict Monthly Consumption"}</span>
                </button>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 space-y-4">
              {result ? (
                <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Monthly Forecast Output
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {result.category_info.badge}
                    </span>
                  </div>

                  {/* Predicted Monthly kWh Card */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
                    <span className="text-xs text-slate-400 font-semibold block">Monthly Predicted Consumption</span>
                    <div className="text-5xl font-extrabold text-emerald-400">
                      {result.predicted_kwh.toFixed(1)} <span className="text-lg text-slate-300 font-medium">kWh</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                      <span>Avg Daily Load: <b className="text-cyan-400">{result.average_daily_usage} kWh/day</b></span>
                      <span>Confidence: <b className="text-emerald-400">{result.confidence}%</b></span>
                    </div>
                  </div>

                  {/* Cost & Tariff Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Estimated Monthly Cost</span>
                      <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">₹{result.estimated_monthly_cost.toFixed(2)}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-semibold">
                      <span className="text-slate-400 block text-[10px] uppercase">Tariff Rate</span>
                      ₹{result.bill_info.tariff_rate} / kWh
                    </div>
                  </div>

                  {/* Bill Action Button */}
                  <button
                    onClick={() => setShowBillModal(true)}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Generate Monthly Electricity Bill</span>
                  </button>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Ready for Monthly Forecast</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Fill in monthly climate & building parameters to generate 30-day forecasts and cost estimates.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Insights Panel */}
          {result && <InsightCard insights={result.insights} />}
        </main>
      </div>

      {/* Bill Preview Modal */}
      {showBillModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBillModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>
            <BillPreview
              billData={{
                bill_number: `INV-M-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                prediction_type: 'monthly',
                predicted_units: result.predicted_kwh,
                tariff_rate: result.bill_info.tariff_rate,
                energy_charge: result.bill_info.energy_charge,
                fixed_charge: result.bill_info.fixed_charge,
                taxes: result.bill_info.taxes,
                total_amount: result.bill_info.total_amount,
                category: result.category_info.badge,
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

export default MonthlyPredictPage;
