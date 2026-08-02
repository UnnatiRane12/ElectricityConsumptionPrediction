import React from 'react';

const GaugeChart = ({ value = 1331.12, max = 1500, label = "Current Predicted Usage (kWh)" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDasharray = 125.6; // 2 * PI * r (r=40) * (180 / 360) = 125.6
  const strokeDashoffset = 125.6 - (125.6 * percentage) / 100;

  let gaugeColor = "#10B981"; // Green
  let statusText = "OPTIMAL USAGE";
  if (value > 600 || percentage > 60) {
    gaugeColor = "#EF4444"; // Red
    statusText = "HIGH USAGE WARNING";
  } else if (value > 300 || percentage > 30) {
    gaugeColor = "#F59E0B"; // Yellow/Orange
    statusText = "MODERATE USAGE";
  }

  return (
    <div className="flex flex-col items-center justify-center relative p-2 w-full">
      <svg className="w-64 h-36" viewBox="0 0 100 55">
        {/* Background Track Arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#E2E8F0"
          className="dark:stroke-slate-800"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={gaugeColor}
          strokeWidth="12"
          strokeDasharray="125.6"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute top-14 text-center space-y-1">
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {typeof value === 'number' ? value.toFixed(2) : value}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">kWh</span>
        </div>
        <span
          className="block text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md inline-block"
          style={{ backgroundColor: `${gaugeColor}20`, color: gaugeColor }}
        >
          {statusText}
        </span>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-4 text-center">{label}</p>
    </div>
  );
};

export default GaugeChart;
