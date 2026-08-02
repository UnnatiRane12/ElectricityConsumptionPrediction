import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mt-auto py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              PowerPredict
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
            AI-Driven Electricity Consumption Prediction & Smart Energy Analytics System.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
