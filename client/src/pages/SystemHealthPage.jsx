import React, { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import {
  HeartPulse,
  RefreshCw,
  Server,
  Database,
  Layers,
  AlertTriangle,
} from "lucide-react";

export const SystemHealthPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get("/health");
      if (response.data) {
        setHealth(response.data);
        setError(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Health check failed (HTTP 503)",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Infrastructure System Health
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status reported directly from <code className="font-mono text-indigo-400">GET /health</code>
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer w-fit"
          title="Refresh Health"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Overall Health Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Global Health Status
            </span>
            <span className="text-sm font-semibold text-slate-200 mt-1 block">
              Service: <code className="text-indigo-400">{health?.service || "job-queue-system"}</code>
            </span>
          </div>

          <StatusBadge status={health?.status || "unhealthy"} />
        </div>

        {/* Individual Reliable Components Reported by API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* API Server */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-200">
                <Server className="w-4 h-4 text-sky-400" />
                <span>Express REST API</span>
              </div>
              <StatusBadge status={health?.success ? "ok" : "unhealthy"} />
            </div>
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <div>Uptime: {health?.uptime ? `${health.uptime.toFixed(1)}s` : "—"}</div>
              <div>HTTP Endpoint: /health</div>
            </div>
          </div>

          {/* Redis */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-200">
                <Database className="w-4 h-4 text-rose-400" />
                <span>Redis Datastore</span>
              </div>
              <StatusBadge status={health?.services?.redis || "disconnected"} />
            </div>
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <div>TCP Status: {health?.services?.redis || "disconnected"}</div>
              <div>Driver: ioredis</div>
            </div>
          </div>

          {/* Queue Engine */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-200">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>BullMQ Queue Engine</span>
              </div>
              <StatusBadge status={health?.services?.queue || "disconnected"} />
            </div>
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <div>Connection: {health?.services?.queue || "disconnected"}</div>
              <div>Target Queue: email</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono text-right">
          Last Check: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : "—"}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
