import React, { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  PlusCircle,
} from "lucide-react";

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(50);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/jobs?limit=${limit}`);
      if (response.data && response.data.jobs) {
        setJobs(response.data.jobs);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // auto refresh
    return () => clearInterval(interval);
  }, [limit]);

  // Client-side filtering by search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      job.name?.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(job.data || {})
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (job.state && job.state.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Job Queue Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inspection of active, waiting, completed, and failed tasks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchJobs}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Refresh Jobs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/jobs/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create Job
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center backdrop-blur-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, or payload..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
          />
        </div>

        {/* Status Filter Tabs & Limit Select */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium">
            {["all", "waiting", "active", "completed", "failed", "delayed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    statusFilter === status
                      ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Limit:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Job ID</th>
                <th className="py-3.5 px-4">Job Type / Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Attempts</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-500 text-xs font-sans"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                        <span>Fetching jobs from Redis...</span>
                      </div>
                    ) : (
                      "No jobs found matching the current criteria."
                    )}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-indigo-400 font-bold">
                      #{job.id}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                      {job.name || "send-email"}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={job.state} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {job.attemptsMade ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {job.timestamp
                        ? new Date(job.timestamp).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-sans transition-colors border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
