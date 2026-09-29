import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  Mail,
  FileText,
  Code,
} from "lucide-react";

export const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    to: "user@example.com",
    subject: "Welcome to Distributed Job Queue",
    text: "Hello! This is a test email job dispatched via BullMQ and Redis.",
    html: "<p>Hello! This is a <strong>test email job</strong> dispatched via BullMQ and Redis.</p>",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdJob, setCreatedJob] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/email", formData);

      if (response.data && response.data.success) {
        setCreatedJob({
          jobId: response.data.jobId,
          message: response.data.message,
          requestId: response.data.requestId,
          status: "waiting", // Initial state in queue
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to dispatch job. Please check backend inputs.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Enqueue New Email Job
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Submits a payload to <code className="text-indigo-400 font-mono">POST /api/email</code> to add a job to BullMQ
        </p>
      </div>

      {/* Success Notification Banner */}
      {createdJob && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-400">
                Job Enqueued Successfully!
              </h3>
              <p className="text-xs text-slate-300">{createdJob.message}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">
                Job ID
              </span>
              <span className="text-indigo-400 font-bold">#{createdJob.jobId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">
                Initial Status
              </span>
              <StatusBadge status={createdJob.status} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px] uppercase font-sans">
                Request ID
              </span>
              <span className="text-slate-300 truncate block">
                {createdJob.requestId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to={`/jobs/${createdJob.jobId}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              View Job Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setCreatedJob(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Enqueue Another Job
            </button>
          </div>
        </div>
      )}

      {/* Failure Notification Banner */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xs space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Recipient Email (to) *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              name="to"
              required
              value={formData.to}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Subject Line *
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Email Subject"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Plain Text Body
          </label>
          <textarea
            name="text"
            rows={3}
            value={formData.text}
            onChange={handleChange}
            placeholder="Plain text email body content..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 font-mono outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            HTML Body (Optional)
          </label>
          <textarea
            name="html"
            rows={3}
            value={formData.html}
            onChange={handleChange}
            placeholder="<p>HTML formatted content...</p>"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 font-mono outline-none transition-colors"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            to="/jobs"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {loading ? (
              "Adding Job..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                Dispatch Email Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPage;
