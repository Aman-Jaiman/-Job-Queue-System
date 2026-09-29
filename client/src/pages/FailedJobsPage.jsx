import React, { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import {
  AlertOctagon,
  RefreshCw,
  RotateCcw,
  Trash2,
  AlertCircle,
} from "lucide-react";

export const FailedJobsPage = () => {
  const [dlqJobs, setDlqJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDLQJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/dlq");
      if (response.data && response.data.jobs) {
        setDlqJobs(response.data.jobs);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load DLQ jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDLQJobs();
  }, []);

  const handleRetryDLQ = async (id) => {
    setActionMessage(null);
    try {
      const res = await api.post(`/api/dlq/${id}/retry`);
      setActionMessage({
        type: "success",
        text: res.data?.message || `Job ${id} retried successfully`,
      });
      fetchDLQJobs();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err.response?.data?.message || `Failed to retry job ${id}`,
      });
    }
  };

  const handleDeleteDLQ = async (id) => {
    if (!window.confirm(`Are you sure you want to delete DLQ record #${id}?`))
      return;

    setActionMessage(null);
    try {
      const res = await api.delete(`/api/dlq/${id}`);
      setActionMessage({
        type: "success",
        text: res.data?.message || `DLQ Record ${id} deleted successfully`,
      });
      fetchDLQJobs();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err.response?.data?.message || `Failed to delete DLQ record ${id}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Dead Letter Queue (DLQ) & Failed Jobs
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jobs that failed all retry attempts are safely held here for inspection and retry
          </p>
        </div>

        <button
          onClick={fetchDLQJobs}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer w-fit"
          title="Refresh DLQ"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
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

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Failed Jobs Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">DLQ / Job ID</th>
                <th className="py-3.5 px-4">Error / Failure Reason</th>
                <th className="py-3.5 px-4">Attempts</th>
                <th className="py-3.5 px-4">Failed At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dlqJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-slate-500 text-xs font-sans"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                        <span>Loading DLQ records...</span>
                      </div>
                    ) : (
                      "🎉 No failed jobs in Dead Letter Queue!"
                    )}
                  </td>
                </tr>
              ) : (
                dlqJobs.map((job) => {
                  const originalJobId =
                    job.data?.originalJobId || job.id || "N/A";
                  const failedReason =
                    job.data?.failedReason || "Final retry attempt exhausted";
                  const failedAt = job.data?.failedAt || job.timestamp;
                  const attempts = job.data?.attemptsMade || job.attemptsMade || 3;

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-rose-400 font-bold">
                        #{job.id}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          Orig: #{originalJobId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-rose-300 max-w-xs truncate">
                        {failedReason}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {attempts}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {failedAt
                          ? new Date(failedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <button
                            onClick={() => handleRetryDLQ(job.id)}
                            className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retry Job
                          </button>
                          <button
                            onClick={() => handleDeleteDLQ(job.id)}
                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FailedJobsPage;
