import React from "react";
import { Link } from "react-router-dom";
import PROFILE_LINKS from "../config/profile";
import Navbar from "../components/Navbar";
import {
  ArrowRight,
  Server,
  Zap,
  ShieldCheck,
  RotateCcw,
  Cpu,
  Database,
  Terminal,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          <Zap className="w-3.5 h-3.5" />
          Production-Grade Asynchronous Queue Architecture
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Distributed Job Processing with <span className="text-indigo-400">BullMQ</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Reliable asynchronous job processing using Node.js, BullMQ, Redis and background workers.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={PROFILE_LINKS.repository}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
          >
            GitHub Repository
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20 w-full">

        {/* Problem vs Solution */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xs">
            <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl w-fit mb-4">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Problem</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Executing heavy operations—such as sending emails, image rendering, or report generation—directly inside HTTP request routes blocks API threads, degrades user experience, risks timeouts, and causes server crashes during traffic spikes.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xs">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl w-fit mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Solution</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Offload long-running tasks into a high-performance Redis job queue with BullMQ. Express APIs return instantly with job tracking IDs while decoupled background worker processes execute work independently with automatic retries and Dead Letter Queue protection.
            </p>
          </div>
        </section>

        {/* System Architecture Section */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">System Architecture</h2>
            <p className="text-slate-400 text-sm mt-1">
              End-to-end data flow from client invocation to background worker execution
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-center">
            {[
              { title: "Client", desc: "React Dashboard / API Caller", icon: Terminal },
              { title: "Express API", desc: "Auth, Validation & Rate Limiter", icon: Server },
              { title: "BullMQ Queue", desc: "Atomic Task Structuring", icon: Layers },
              { title: "Redis / Valkey", desc: "In-Memory Persistence", icon: Database },
              { title: "Worker Process", desc: "Async Background Claim", icon: Cpu },
              { title: "Job Processor", desc: "SMTP / Work Handler", icon: Zap },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative"
                >
                  <div className="p-2.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-white">{step.title}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{step.desc}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Job Lifecycle Section */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">Job Lifecycle & DLQ Resilience</h2>
            <p className="text-slate-400 text-sm mt-1">
              Deterministic state progression with retry backoff & Dead Letter Queue isolation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Standard Success Path */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Successful Execution Flow
              </h4>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Created</span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">Waiting</span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">Active</span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Completed</span>
              </div>
            </div>

            {/* Failure & Retry Path */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Failure & Exponential Retry Flow
              </h4>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">Active</span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">Failed</span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">Retry Backoff</span>
                <span className="text-slate-600">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">DLQ Record</span>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack & Features */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {[
                "Node.js (ES Modules)",
                "Express 5 REST API",
                "BullMQ 5 Job Engine",
                "Redis / Valkey Storage",
                "Nodemailer (SMTP)",
                "JWT & Bcrypt Auth",
                "Zod Schema Validation",
                "React + Tailwind CSS",
              ].map((tech, i) => (
                <div key={i} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-slate-300">
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Core Production Features</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fixed-window atomic Redis rate limiting per IP & user.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic Dead Letter Queue (DLQ) job derivation.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Graceful shutdown handling SIGTERM and SIGINT signals.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-overhead health checks for UptimeRobot monitoring.</span>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
