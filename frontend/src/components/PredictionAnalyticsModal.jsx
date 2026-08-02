import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { BarChart3, X, Zap, Sparkles } from 'lucide-react';
import GaugeChart from './GaugeChart';
import api from '../utils/api';

const PredictionAnalyticsModal = ({ predictionResult, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictionAnalytics = async () => {
      if (!predictionResult) return;
      setLoading(true);
      try {
        const payload = {
          prediction_type: predictionResult.prediction_type || 'daily',
          inputs: predictionResult.inputs || {},
          predicted_kwh: predictionResult.predicted_kwh || 28.5,
          bill_info: predictionResult.bill_info || {},
          category: predictionResult.category || predictionResult.selected_category || 'Residential'
        };
        const res = await api.post('/analytics/prediction-specific', payload);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load prediction-specific analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictionAnalytics();
  }, [predictionResult]);

  if (!predictionResult) return null;

  const isDaily = (predictionResult.prediction_type || 'daily') === 'daily';

  // High-contrast Tooltip styling props
  const tooltipStyleProps = {
    contentStyle: { 
      backgroundColor: '#0F172A', 
      borderColor: '#334155', 
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
    },
    itemStyle: { color: '#38BDF8', fontWeight: 600, fontSize: '12px' },
    labelStyle: { color: '#F8FAFC', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Prediction Analytics Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing specific parameters for this <span className="font-bold uppercase text-cyan-600 dark:text-cyan-400">{predictionResult.prediction_type}</span> prediction ({predictionResult.predicted_kwh} kWh).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold text-sm animate-pulse">
            Generating prediction-specific analytics charts...
          </div>
        ) : isDaily ? (
          /* 8 DAILY PREDICTION CHARTS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Predicted Consumption Gauge */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">1. Predicted Consumption Gauge</h3>
              <div className="flex-1 flex items-center justify-center">
                <GaugeChart value={predictionResult.predicted_kwh} max={80} label="Current Predicted kWh" />
              </div>
            </div>

            {/* Chart 2: Input Features Summary */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">2. Input Features Summary</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.input_summary}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="feature" stroke="#94A3B8" fontSize={9} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Temperature vs Consumption */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">3. Temperature Sensitivity Plot</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.temp_vs_consumption}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="temp" stroke="#94A3B8" fontSize={10} unit="°C" />
                    <YAxis stroke="#94A3B8" fontSize={10} unit="kWh" />
                    <Tooltip {...tooltipStyleProps} />
                    <Line type="monotone" dataKey="consumption" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: HVAC vs Lighting Usage */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">4. HVAC vs Lighting Load</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.hvac_vs_lighting}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip {...tooltipStyleProps} />
                    <Legend />
                    <Bar dataKey="hours" name="Operation Hours" fill="#0284C7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="estimated_kwh" name="kWh Draw" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 5: Renewable Energy Contribution */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">5. Renewable Offset Contribution</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.renewable_contribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} label>
                      {data?.renewable_contribution?.map((entry, idx) => (
                        <Cell key={`cell-rc-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyleProps} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: Energy Consumption Breakdown */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">6. Energy Load Breakdown</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.consumption_breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label>
                      {data?.consumption_breakdown?.map((entry, idx) => (
                        <Cell key={`cell-cb-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyleProps} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 7: Estimated Bill Breakdown */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">7. Estimated Bill Breakdown (INR)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.bill_breakdown}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="charge" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="amount" name="Amount (₹)" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 8: Customer Category Summary */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">8. Category Tariff Slab Comparison</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.category_summary}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} unit="₹" />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="rate" name="Tariff Rate (₹/kWh)" radius={[4, 4, 0, 0]}>
                      {data?.category_summary?.map((entry, idx) => (
                        <Cell key={`cell-cs-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          /* 8 MONTHLY PREDICTION CHARTS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Consumption Trend */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">1. Projected 30-Day Load Trend</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.days_trend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} />
                    <YAxis stroke="#94A3B8" fontSize={10} unit="kWh" />
                    <Tooltip {...tooltipStyleProps} />
                    <Line type="monotone" dataKey="consumption_kwh" stroke="#10B981" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Estimated Monthly Bill */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">2. Estimated Bill Charges (INR)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.bill_breakdown}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="charge" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="amount" name="Amount (₹)" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Renewable Energy Savings */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">3. Renewable Energy Savings</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.renewable_savings} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} label>
                      {data?.renewable_savings?.map((entry, idx) => (
                        <Cell key={`cell-rs-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyleProps} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: HVAC Contribution */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">4. Monthly HVAC Contribution</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.hvac_contribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label>
                      {data?.hvac_contribution?.map((entry, idx) => (
                        <Cell key={`cell-hc-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyleProps} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 5: Lighting Contribution */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">5. Monthly Lighting Contribution</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.lighting_contribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label>
                      {data?.lighting_contribution?.map((entry, idx) => (
                        <Cell key={`cell-lc-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyleProps} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: Occupancy Impact */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">6. Occupancy Load Impact</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.occupancy_impact}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="occupancy" stroke="#94A3B8" fontSize={10} name="Occupants" />
                    <YAxis stroke="#94A3B8" fontSize={10} unit="kWh" />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="estimated_kwh" name="Projected kWh" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 7: Consumption Distribution */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">7. Monthly Consumption Distribution</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.consumption_dist}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} unit="kWh" />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="kwh" name="kWh" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 8: Customer Category Summary */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">8. Category Tariff Slab Comparison</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.category_summary}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} unit="₹" />
                    <Tooltip {...tooltipStyleProps} />
                    <Bar dataKey="rate" name="Tariff Rate (₹/kWh)" radius={[4, 4, 0, 0]}>
                      {data?.category_summary?.map((entry, idx) => (
                        <Cell key={`cell-mcs-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionAnalyticsModal;
