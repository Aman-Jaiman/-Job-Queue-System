import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  AlertOctagon,
  Cpu,
  HeartPulse,
  Globe,
} from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "All Jobs", icon: ListOrdered },
    { to: "/jobs/create", label: "Create Job", icon: PlusCircle },
    { to: "/failed-jobs", label: "Failed & DLQ", icon: AlertOctagon },
    { to: "/workers", label: "Worker Status", icon: Cpu },
    { to: "/health-status", label: "System Health", icon: HeartPulse },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 shrink-0 flex flex-col justify-between py-6">
      <div className="space-y-6 px-4">
        <div>
          <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </h2>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="px-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
        >
          <Globe className="w-3.5 h-3.5" />
          Project Architecture
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
