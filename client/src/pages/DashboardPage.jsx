import React, { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";
import {
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";

export const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/api/analytics");
      if (response.data && response.data.analytics) {
        setAnalytics(response.data.analytics);
        setError(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load queue analytics",
      );
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000); // 5s polling
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Queue System Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time BullMQ Redis analytics and task lifecycle monitor
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-xs text-slate-500 font-mono">
              Auto-refresh: {lastRefreshed}
            </span>
          )}
          <button
            onClick={fetchAnalytics}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/jobs/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            + Create New Job
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchAnalytics}
            className="underline font-semibold hover:text-rose-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top 5 Key Metrics Cards Required by Spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Waiting Jobs"
          value={analytics?.waiting}
          icon={Clock}
          color="amber"
          subtext="Pending worker claim"
        />
        <StatCard
          title="Active Jobs"
          value={analytics?.active}
          icon={Activity}
          color="sky"
          subtext="Currently processing"
        />
        <StatCard
          title="Completed Jobs"
          value={analytics?.completed}
          icon={CheckCircle2}
          color="emerald"
          subtext="Processed successfully"
        />
        <StatCard
          title="Failed Jobs"
          value={analytics?.failed}
          icon={AlertTriangle}
          color="rose"
          subtext="Moved to DLQ or retry"
        />
        <StatCard
          title="Delayed Jobs"
          value={analytics?.delayed}
          icon={PauseCircle}
          color="indigo"
          subtext="Scheduled for later"
        />
      </div>

      {/* Extended Analytics & Success Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Queue Volume
            </span>
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold font-mono text-white">
              {analytics?.total ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Retained in Redis queue window
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Success Rate
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold font-mono text-emerald-400">
              {analytics?.successRate !== undefined
                ? `${analytics.successRate}%`
                : "—"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ratio of completed to total jobs
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Failure Rate
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="mt-4">
            <div className="text-4xl font-bold font-mono text-rose-400">
              {analytics?.failureRate !== undefined
                ? `${analytics.failureRate}%`
                : "—"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ratio of failed to total jobs
            </p>
          </div>
        </div>
      </div>

      {/* Operational Quick Links */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/jobs"
            className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-colors"
          >
            <div>
              <span className="font-semibold text-sm text-slate-200 block">
                Inspect All Jobs
              </span>
              <span className="text-xs text-slate-500">
                Filter and view details
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/failed-jobs"
            className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-colors"
          >
            <div>
              <span className="font-semibold text-sm text-slate-200 block">
                Manage Failed Jobs
              </span>
              <span className="text-xs text-slate-500">
                DLQ inspection & retries
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/workers"
            className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-colors"
          >
            <div>
              <span className="font-semibold text-sm text-slate-200 block">
                Worker Diagnostics
              </span>
              <span className="text-xs text-slate-500">
                System memory & PID status
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
