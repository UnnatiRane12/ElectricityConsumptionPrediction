import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Trash2, Download, Zap, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter) params.type_filter = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/predict/history', { params });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [typeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction history record?")) return;
    try {
      await api.delete(`/predict/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const handleDownloadPDF = async (predId) => {
    try {
      const billRes = await api.get(`/bills/prediction/${predId}`);
      const pdfRes = await api.get(`/bills/${billRes.data.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PowerPredict_Bill_${billRes.data.bill_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download PDF for this bill.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Header Banner */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <History className="w-4 h-4" />
                <span>PostgreSQL Records</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Prediction History
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Persistent log of all daily and monthly energy predictions, bill amounts, and model versions.
              </p>
            </div>

            <button
              onClick={fetchHistory}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search category or kWh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prediction Types</option>
                <option value="daily">Daily Predictions</option>
                <option value="monthly">Monthly Predictions</option>
              </select>
            </div>
          </div>

          {/* History Table */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Predicted kWh</th>
                    <th className="p-3.5">Bill Amount</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Model Used</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400">Loading history logs...</td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400">No predictions found.</td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">#{item.id}</td>
                        <td className="p-3.5 capitalize font-bold text-cyan-600 dark:text-cyan-400">{item.prediction_type}</td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">{item.predicted_kwh.toFixed(2)} kWh</td>
                        <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">₹{item.bill_amount.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-400">{item.model_used}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleDownloadPDF(item.id)}
                            className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-colors"
                            title="Download PDF Bill"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HistoryPage;
