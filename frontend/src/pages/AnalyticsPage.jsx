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
import { BarChart3, RefreshCw, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import GaugeChart from '../components/GaugeChart';
import InsightCard from '../components/InsightCard';
import Skeleton from '../components/Skeleton';
import api from '../utils/api';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChartsData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/charts');
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analytics charts data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, []);

  const sampleInsights = [
    "High HVAC usage (8.5h/day) under 32°C climate contributed significantly to higher energy draw.",
    "Renewable solar generation offset approximately 22% of total electricity demand.",
    "Humidity levels were within comfortable limits, keeping auxiliary cooling loads steady.",
    "Your predicted daily usage is 12% lower than similar 2,200 sq.ft building baselines."
  ];

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-white transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" />
                <span>14-Chart Intelligence Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Smart Energy Analytics Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Multi-dimensional visualization of climate correlations, load distributions, model accuracy, and saving potentials.
              </p>
            </div>

            <button
              onClick={fetchChartsData}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center space-x-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Charts</span>
            </button>
          </div>

          {/* Insights Panel */}
          <InsightCard insights={sampleInsights} />

          {/* 14 Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Consumption Gauge */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">1. Consumption Gauge</h3>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Live Indicator</span>
              </div>
              <div className="flex-1 flex items-center justify-center py-4">
                <GaugeChart value={data?.consumption_gauge?.current_kwh || 28.5} max={80} />
              </div>
            </div>

            {/* Chart 2: Daily Consumption Line Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">2. Daily Consumption Trend</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Line Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.daily_line}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip {...tooltipStyleProps} />
                      <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '8px' }} />
                      <Line type="monotone" dataKey="predicted_kwh" name="Predicted kWh" stroke="#0284C7" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="baseline_kwh" name="Baseline kWh" stroke="#64748B" strokeDasharray="5 5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 3: Monthly Consumption Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">3. Monthly Consumption Bar Chart</h3>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Bar Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.monthly_bar}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip {...tooltipStyleProps} />
                      <Bar dataKey="consumption_kwh" name="kWh / Month" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 4: Energy Distribution Pie Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">4. Energy Load Breakdown</h3>
                <span className="text-[10px] uppercase font-bold text-purple-400">Pie Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.energy_pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                        {data?.energy_pie?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyleProps} />
                      <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 5: Temperature vs Consumption Scatter Plot */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">5. Temperature vs Consumption</h3>
                <span className="text-[10px] uppercase font-bold text-amber-400">Scatter Plot</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis type="number" dataKey="temperature" name="Temp" unit="°C" stroke="#94A3B8" fontSize={11} />
                      <YAxis type="number" dataKey="consumption" name="kWh" unit="kWh" stroke="#94A3B8" fontSize={11} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} {...tooltipStyleProps} />
                      <Scatter name="Climate Readings" data={data?.temp_scatter} fill="#F59E0B" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 6: Occupancy vs Consumption Bubble Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">6. Occupancy vs Consumption</h3>
                <span className="text-[10px] uppercase font-bold text-indigo-400">Bubble Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis type="number" dataKey="occupancy" name="Occupants" stroke="#94A3B8" fontSize={11} />
                      <YAxis type="number" dataKey="consumption" name="kWh" stroke="#94A3B8" fontSize={11} />
                      <ZAxis type="number" dataKey="size" range={[60, 300]} name="Scale" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} {...tooltipStyleProps} />
                      <Scatter name="Occupancy Burden" data={data?.occupancy_bubble} fill="#6366F1" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 7: HVAC vs Lighting Usage Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">7. HVAC vs Lighting Comparison</h3>
                <span className="text-[10px] uppercase font-bold text-teal-400">Grouped Bar</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.hvac_vs_lighting}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip {...tooltipStyleProps} />
                      <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '8px' }} />
                      <Bar dataKey="hvac" name="HVAC Load" fill="#0284C7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="lighting" name="Lighting Load" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 8: Renewable Energy Contribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">8. Renewable Offset Contribution</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Donut Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.renewable_donut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} label>
                        {data?.renewable_donut?.map((entry, index) => (
                          <Cell key={`cell-r-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyleProps} />
                      <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 9: Customer Category Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">9. Category Tier Distribution</h3>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Bar Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.category_distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="category" stroke="#94A3B8" fontSize={9} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip {...tooltipStyleProps} />
                      <Bar dataKey="count" name="User Count" fill="#0EA5E9" radius={[6, 6, 0, 0]}>
                        {data?.category_distribution?.map((entry, index) => (
                          <Cell key={`cell-c-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 10: Monthly Bill Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">10. Monthly Bill Comparison (INR)</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Bar Chart</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.monthly_bills}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip {...tooltipStyleProps} />
                      <Bar dataKey="bill_amount" name="Bill (₹)" fill="#059669" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 11: Prediction History Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">11. Prediction History Timeline</h3>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Milestone Feed</span>
              </div>
              <div className="h-64 overflow-y-auto space-y-2 pr-1">
                {data?.prediction_timeline?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="font-bold text-slate-200 block">{item.type} Forecast ({item.kwh} kWh)</span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400">₹{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 12: Actual vs Predicted Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">12. Actual vs Predicted Evaluation</h3>
                <span className="text-[10px] uppercase font-bold text-indigo-400">Dual Line</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.actual_vs_predicted}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="sample" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip {...tooltipStyleProps} />
                      <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '8px' }} />
                      <Line type="monotone" dataKey="actual" name="Actual kWh" stroke="#6366F1" strokeWidth={2} />
                      <Line type="monotone" dataKey="predicted" name="Predicted kWh" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 13: Feature Importance */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">13. ML Feature Importance</h3>
                <span className="text-[10px] uppercase font-bold text-amber-400">Horizontal Bar</span>
              </div>
              <div className="h-64">
                {loading ? <Skeleton className="h-full w-full bg-slate-800" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data?.feature_importance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis type="number" stroke="#94A3B8" fontSize={10} unit="%" />
                      <YAxis type="category" dataKey="feature" stroke="#94A3B8" fontSize={10} width={105} />
                      <Tooltip {...tooltipStyleProps} />
                      <Bar dataKey="importance" name="Impact (%)" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 14: Energy Saving Potential */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">14. Energy Saving Potential</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Saving %</span>
              </div>
              <div className="h-64 space-y-3 flex flex-col justify-center">
                {data?.saving_potential?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{item.name}</span>
                      <span className="text-emerald-400 font-bold">+{item.potential_percent}% Savings</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.potential_percent * 2.5}%`, backgroundColor: item.fill }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AnalyticsPage;
