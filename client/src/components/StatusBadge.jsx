import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Play, Pause, RefreshCw } from "lucide-react";

export const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  switch (normalized) {
    case "completed":
    case "ok":
    case "healthy":
    case "ready":
    case "connected":
    case "sent":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status}
        </span>
      );

    case "active":
    case "processing":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          {status}
        </span>
      );

    case "waiting":
    case "queued":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          {status}
        </span>
      );

    case "delayed":
    case "paused":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Pause className="w-3.5 h-3.5" />
          {status}
        </span>
      );

    case "failed":
    case "unhealthy":
    case "disconnected":
    case "error":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          {status}
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          {status || "unknown"}
        </span>
      );
  }
};

export default StatusBadge;
