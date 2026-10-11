import React from 'react';
import { ArrowUp, Github, Heart, Code2, Sparkles } from 'lucide-react';
import { PORTFOLIO_CONFIG, GITHUB_USERNAME } from '../config/github';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-zinc-850 bg-zinc-950/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-zinc-950 font-bold" />
            </div>
            <span className="font-bold text-white text-sm">{PORTFOLIO_CONFIG.name}</span>
          </div>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <p className="text-xs text-zinc-400">
            Automated GitHub portfolio integration &amp; Vercel ready
          </p>
        </div>

        {/* Middle: Links */}
        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a href="#about" className="hover:text-cyan-400 transition-colors">
            About
          </a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">
            Skills
          </a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">
            Contact
          </a>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>

        {/* Right: Scroll to top */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} {PORTFOLIO_CONFIG.name}
          </span>
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
