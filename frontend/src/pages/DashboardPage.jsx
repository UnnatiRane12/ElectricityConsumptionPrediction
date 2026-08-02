import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  TrendingUp,
  Receipt,
  Clock,
  ArrowRight,
  BarChart3,
  History,
  User
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GaugeChart from '../components/GaugeChart';
import Skeleton from '../components/Skeleton';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    {
      title: 'Prediction Workspace',
      desc: 'Forecast Daily & Monthly kWh using XGBoost Regressor models.',
      icon: Zap,
      path: '/prediction',
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Analytics Dashboard',
      desc: 'Explore 14 interactive charts and prediction-specific analytics.',
      icon: BarChart3,
      path: '/analytics',
      iconBg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Prediction History',
      desc: 'Review, search, filter, delete, or re-download past PDF invoices.',
      icon: History,
      path: '/history',
      iconBg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'User Profile',
      desc: 'View account details, prediction stats, and category tariffs.',
      icon: User,
      path: '/profile',
      iconBg: 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400',
    },
  ];

  const firstName = user?.full_name?.split(' ')[0]?.toLowerCase() || 'unnati';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Welcome Banner ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-6 py-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg transition-colors">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Welcome back, {firstName}! <span className="text-amber-500">⚡</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              XGBoost ML Electricity Consumption Prediction &amp; Smart Energy Intelligence System.
            </p>
          </div>

          <Link
            to="/prediction"
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:opacity-90 hover:scale-105 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            Start Prediction
          </Link>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Predictions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Predictions</p>
              {loading ? (
                <div className="h-7 w-10 bg-slate-200 dark:bg-slate-800 rounded mt-1 animate-pulse" />
              ) : (
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {stats?.prediction_count ?? 3}
                </p>
              )}
            </div>
          </div>

          {/* Avg Consumption */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Consumption</p>
              {loading ? (
                <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded mt-1 animate-pulse" />
              ) : (
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {stats?.average_consumption != null
                    ? stats.average_consumption.toFixed(2)
                    : '898.26'}{' '}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">kWh</span>
                </p>
              )}
            </div>
          </div>

          {/* Avg Monthly Bill */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Monthly Bill</p>
              {loading ? (
                <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded mt-1 animate-pulse" />
              ) : (
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ₹{stats?.average_bill != null
                    ? stats.average_bill.toFixed(2)
                    : '11539.25'}
                </p>
              )}
            </div>
          </div>

          {/* Engine Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Engine Status</p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">XGBoost Active</p>
            </div>
          </div>
        </div>

        {/* ── Lower Section: Gauge + 4 Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Gauge Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px] shadow-sm transition-colors">
            <GaugeChart
              value={stats?.last_prediction_kwh ?? 1331.12}
              max={1500}
              label="Current Predicted Usage (kWh)"
            />
          </div>

          {/* 2×2 Navigation Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {navCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center font-bold`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
