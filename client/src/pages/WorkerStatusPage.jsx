import React, { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import {
  Cpu,
  RefreshCw,
  Server,
  HardDrive,
  Info,
} from "lucide-react";

export const WorkerStatusPage = () => {
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitor = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/monitor");
      if (response.data) {
        setMonitor(response.data);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch monitor metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitor();
    const interval = setInterval(fetchMonitor, 5000);
    return () => clearInterval(interval);
  }, []);

  const worker = monitor?.worker;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Worker Status & Process Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time process health, memory allocation, and runtime environment
          </p>
        </div>

        <button
          onClick={fetchMonitor}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer w-fit"
          title="Refresh Monitor"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Explicit Unexposed Metrics Notice as requested by spec */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-3">
        <Info className="w-4 h-4 shrink-0" />
        <span>
          Detailed per-worker concurrency & task counters are not currently exposed by the API. Process metrics below are reported directly from <code className="font-mono text-amber-200">GET /api/monitor</code>.
        </span>
      </div>

      {/* Real Process Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Process ID (PID)
          </span>
          <span className="text-2xl font-bold font-mono text-indigo-400">
            {worker?.pid ?? "—"}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Process Uptime
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {worker?.uptime ? `${worker.uptime}s` : "—"}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            CPU Cores
          </span>
          <span className="text-2xl font-bold font-mono text-sky-400">
            {worker?.cpuCount ?? "—"}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Node Version
          </span>
          <span className="text-2xl font-bold font-mono text-purple-400">
            {worker?.nodeVersion ?? "—"}
          </span>
        </div>
      </div>

      {/* Detailed System & Memory Metrics */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xs space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Memory & Host Environment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Memory breakdown */}
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 font-sans font-semibold text-slate-300">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span>Node.js Memory Allocation</span>
            </div>
            <div className="space-y-2 pt-1 text-slate-400">
              <div className="flex justify-between">
                <span>RSS Memory:</span>
                <span className="text-slate-200">
                  {worker?.memory?.rss
                    ? `${(worker.memory.rss / 1024 / 1024).toFixed(2)} MB`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Heap Total:</span>
                <span className="text-slate-200">
                  {worker?.memory?.heapTotal
                    ? `${(worker.memory.heapTotal / 1024 / 1024).toFixed(2)} MB`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Heap Used:</span>
                <span className="text-slate-200">
                  {worker?.memory?.heapUsed
                    ? `${(worker.memory.heapUsed / 1024 / 1024).toFixed(2)} MB`
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Host Platform */}
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 font-sans font-semibold text-slate-300">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Host Machine Profile</span>
            </div>
            <div className="space-y-2 pt-1 text-slate-400">
              <div className="flex justify-between">
                <span>Hostname:</span>
                <span className="text-slate-200">{worker?.hostname || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="text-slate-200">{worker?.platform || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Process Started:</span>
                <span className="text-slate-200">
                  {worker?.startedAt
                    ? new Date(worker.startedAt).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerStatusPage;
