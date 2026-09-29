import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import {
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  Trash2,
  AlertCircle,
  FileCode,
} from "lucide-react";

export const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const [jobRes, stateRes] = await Promise.all([
        api.get(`/api/jobs/${id}`),
        api.get(`/api/jobs/${id}/state`).catch(() => null),
      ]);

      if (jobRes.data && jobRes.data.data) {
        setJob(jobRes.data.data);
      }
      if (stateRes && stateRes.data && stateRes.data.state) {
        setState(stateRes.data.state);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Job not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleRetry = async () => {
    setActionMessage(null);
    try {
      const res = await api.post(`/api/jobs/${id}/retry`);
      setActionMessage({
        type: "success",
        text: res.data?.message || "Job retried successfully",
      });
      fetchJobDetails();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to retry job",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete Job #${id}?`)) return;

    try {
      await api.delete(`/api/jobs/${id}`);
      alert("Job deleted successfully");
      window.location.href = "/jobs";
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete job",
      });
    }
  };

  if (loading && !job) {
    return (
      <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
        <span>Loading job details...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-12 text-center">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error || "Job not found"}
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-white">
                Job #{job.id}
              </h1>
              <StatusBadge status={state || "unknown"} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Type: <code className="text-indigo-400">{job.name}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchJobDetails}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {state === "failed" && (
            <button
              onClick={handleRetry}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Job
            </button>
          )}
          {state !== "active" && (
            <button
              onClick={handleDelete}
              className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Job
            </button>
          )}
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Primary Details Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xs space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Job Operational Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
              Attempts Made
            </span>
            <span className="text-xl font-bold text-white">
              {job.attemptsMade ?? 0}
            </span>
          </div>

          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
              Created Timestamp
            </span>
            <span className="text-slate-200">
              {job.timestamp ? new Date(job.timestamp).toLocaleString() : "—"}
            </span>
          </div>

          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block text-[10px] uppercase font-sans mb-1">
              Current State
            </span>
            <StatusBadge status={state || "unknown"} />
          </div>
        </div>

        {/* Payload / Data Viewer */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-semibold text-slate-300">
              Job Payload Data
            </h4>
          </div>
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed">
            {JSON.stringify(job.data || {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
