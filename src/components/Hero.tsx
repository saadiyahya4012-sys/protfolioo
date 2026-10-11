import React from 'react';
import { ArrowDown, Github, ExternalLink, Terminal, Code2, Sparkles, ChevronRight } from 'lucide-react';
import { PORTFOLIO_CONFIG, GITHUB_USERNAME } from '../config/github';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-900/90 border border-zinc-800 text-zinc-300 shadow-inner mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{PORTFOLIO_CONFIG.status}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Hi, I'm{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500">
            {PORTFOLIO_CONFIG.name}
          </span>
          <br />
          <span className="text-zinc-200">{PORTFOLIO_CONFIG.title}</span>
        </h1>

        {/* Bio Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
          {PORTFOLIO_CONFIG.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore Projects</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 transition-all transform hover:-translate-y-0.5"
          >
            <span>Contact Me</span>
          </a>

          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
            <span className="font-mono">github/{GITHUB_USERNAME}</span>
          </a>
        </div>

        {/* Terminal Card / Feature Highlight */}
        <div className="w-full max-w-2xl rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-4 shadow-2xl backdrop-blur-xl text-left font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="text-zinc-500 ml-2">portfolio-sync.sh</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Terminal className="w-3.5 h-3.5" />
              <span>bash</span>
            </div>
          </div>
          <div className="space-y-1.5 text-zinc-300">
            <p className="text-zinc-500"># Fetching public repositories directly from GitHub REST API</p>
            <p>
              <span className="text-cyan-400">$</span> curl -s "https://api.github.com/users/{GITHUB_USERNAME}/repos"
            </p>
            <p className="text-emerald-400">✓ Repositories synced in real-time with automated Vercel live demo detection</p>
            <p className="text-zinc-400">
              <span className="text-indigo-400">status:</span> 200 OK | <span className="text-indigo-400">refresh:</span> 300s interval | <span className="text-indigo-400">stack:</span> React + Vite + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
