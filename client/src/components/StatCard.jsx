import React from "react";

export const StatCard = ({ title, value, icon: Icon, color = "sky", subtext }) => {
  const colorMap = {
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const badgeStyle = colorMap[color] || colorMap.sky;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-xs flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${badgeStyle}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold font-mono text-slate-100">
          {value !== undefined && value !== null ? value : "—"}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-slate-400 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
