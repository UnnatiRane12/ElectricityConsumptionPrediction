import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Leaf, Zap } from 'lucide-react';

const InsightCard = ({ insights = [] }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border-l-4 border-l-cyan-500 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
          <Lightbulb className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          AI Energy Insights Panel
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
          >
            <Zap className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightCard;
