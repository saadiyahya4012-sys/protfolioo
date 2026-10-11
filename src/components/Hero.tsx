import React from 'react';
import { ArrowDown, Github, ExternalLink, Terminal, Code2, Sparkles, ChevronRight } from 'lucide-react';
import { PORTFOLIO_CONFIG, GITHUB_USERNAME } from '../config/github';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero floating particles — subtle, behind content */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[16%] left-[10%] w-1.5 h-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_12px_2px_rgba(34,211,238,0.5)] animate-twinkle" />
        <span
          className="absolute top-[28%] right-[12%] w-1 h-1 rounded-full bg-indigo-300/70 shadow-[0_0_10px_2px_rgba(129,140,248,0.5)] animate-twinkle"
          style={{ animationDelay: '-1.2s' }}
        />
        <span
          className="absolute bottom-[28%] left-[6%] w-1 h-1 rounded-full bg-purple-300/60 shadow-[0_0_10px_2px_rgba(192,132,252,0.45)] animate-float"
          style={{ animationDuration: '7s' }}
        />
        <span
          className="absolute bottom-[35%] right-[6%] hidden sm:block w-1.5 h-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_10px_2px_rgba(34,211,238,0.4)] animate-float-x"
          style={{ animationDuration: '9s' }}
        />
        <div className="absolute top-[10%] left-[42%] hidden md:block w-14 h-14 rounded-full bg-cyan-500/[0.06] border border-cyan-400/15 animate-float" />
        <div
          className="absolute bottom-[22%] left-[38%] hidden md:block w-20 h-20 rounded-full border border-dashed border-indigo-500/15 animate-spin-slow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center max-w-6xl mx-auto">
        {/* Left: Introduction */}
        <div className="order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-900/90 border border-zinc-800 text-zinc-300 shadow-inner mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{PORTFOLIO_CONFIG.status}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
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
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 lg:mb-0">
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
        </div>

        {/* Right: Profile Photo */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Subtle animated cyan glow behind photo */}
            <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-500/25 via-blue-600/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 opacity-80 group-hover:opacity-100 animate-glow-pulse" />

            {/* Orbiting particles around photo — elegant, slow */}
            <div aria-hidden="true" className="absolute -inset-6 pointer-events-none animate-orbit">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.65)]" />
              <span className="absolute bottom-4 right-2 w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_10px_2px_rgba(129,140,248,0.6)]" />
            </div>
            <div aria-hidden="true" className="absolute -inset-10 pointer-events-none animate-orbit-reverse">
              <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_10px_2px_rgba(192,132,252,0.6)]" />
            </div>

            {/* Circular frame with glowing cyan border */}
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 shadow-[0_0_60px_-12px_rgba(34,211,238,0.55)] transition-all duration-500 ease-out group-hover:shadow-[0_0_90px_-10px_rgba(59,130,246,0.75)] group-hover:scale-[1.03]">
              <img
                src="/images/protf.jpeg"
                alt={`${PORTFOLIO_CONFIG.name} — ${PORTFOLIO_CONFIG.title}`}
                className="w-full h-full rounded-full object-cover bg-zinc-950 border-4 border-zinc-950"
                loading="eager"
              />
            </div>

            {/* Decorative outer ring */}
            <div className="absolute -inset-3 rounded-full border border-cyan-500/20 pointer-events-none transition-all duration-500 group-hover:border-cyan-400/40 group-hover:-inset-4" />
          </div>
        </div>
      </div>

      {/* Terminal Card / Feature Highlight */}
      <div className="max-w-2xl mx-auto mt-14 lg:mt-16 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-4 shadow-2xl backdrop-blur-xl text-left font-mono text-xs">
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
    </section>
  );
};
