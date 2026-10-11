import React from 'react';
import { User, Cpu, Sparkles, CheckCircle2, Award, Zap, Code } from 'lucide-react';
import { PORTFOLIO_CONFIG, GITHUB_USERNAME } from '../config/github';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Bio & Story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Crafting software with speed, precision, and architectural elegance.
          </h2>

          <p className="text-zinc-300 text-base leading-relaxed">
            {PORTFOLIO_CONFIG.bio}
          </p>

          <p className="text-zinc-400 text-sm leading-relaxed">
            With years of hands-on experience across the entire web stack, I focus on building resilient client interfaces, responsive developer toolchains, and optimized cloud architectures. I believe in maintainable codebases, continuous deployment workflows, and open-source collaboration.
          </p>

          {/* Core Focus Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
                <Zap className="w-4 h-4" />
                <span>Performant Frontend</span>
              </div>
              <p className="text-xs text-zinc-400">
                Single-page apps, zero cumulative layout shift, sub-second loads, and accessible interactions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
                <Cpu className="w-4 h-4" />
                <span>Modern Cloud & CI/CD</span>
              </div>
              <p className="text-xs text-zinc-400">
                Streamlined GitHub Actions, Vercel edge deployment, containerized APIs, and automated telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics & Info Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
            {/* Ambient accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Engineering Highlights</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
                <span className="text-sm text-zinc-400">Primary Domain</span>
                <span className="text-sm font-semibold text-zinc-200">Full-Stack Web & Cloud</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
                <span className="text-sm text-zinc-400">Location</span>
                <span className="text-sm font-semibold text-zinc-200">{PORTFOLIO_CONFIG.location}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
                <span className="text-sm text-zinc-400">Deployment Target</span>
                <span className="text-sm font-mono font-medium text-emerald-400">Vercel & Cloud Run</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
                <span className="text-sm text-zinc-400">GitHub Profile</span>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-cyan-400 hover:underline"
                >
                  @{GITHUB_USERNAME}
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/70">
              <p className="text-xs text-zinc-500 leading-relaxed">
                "Simple code is resilient code. Automate the routine, design for humans, and always verify before shipping."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
