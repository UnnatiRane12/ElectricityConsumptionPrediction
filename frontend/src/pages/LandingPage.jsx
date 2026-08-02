import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, SunMedium, CalendarDays, Receipt, BarChart3, Tag, ArrowRight, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>XGBoost Regressor AI Energy Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Smart Electricity Consumption <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                  Prediction System
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                PowerPredict uses advanced XGBoost Regressor models trained on 5,000 Kaggle dataset records to forecast daily & monthly power usage, automate bill generation, and deliver intelligent energy-saving insights.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/prediction"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Predict Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/analytics"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  <span>Explore Analytics</span>
                </Link>
              </div>

              {/* Metric Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">96.6%</span>
                  <p className="text-xs text-slate-500 font-medium">XGBoost $R^2$ Score</p>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">5,000+</span>
                  <p className="text-xs text-slate-500 font-medium">Kaggle Dataset</p>
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">14</span>
                  <p className="text-xs text-slate-500 font-medium">Analytics Charts</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Graphic */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-md glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 relative space-y-6 animate-float">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">XGBoost Engine</h4>
                      <p className="text-xs text-slate-500">Live AI Inference</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ● Active
                  </span>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-medium text-slate-400">Predicted Daily Consumption</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-cyan-400">28.50</span>
                    <span className="text-sm text-slate-300 font-semibold">kWh</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-2/3 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-medium">
                    <span>Estimated Bill: ₹209.50</span>
                    <span className="text-emerald-400">Tariff: Residential</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 block text-[10px]">HVAC Usage</span>
                    6.5 Hours / Day
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 block text-[10px]">Renewable Offset</span>
                    12.0% Solar Power
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
