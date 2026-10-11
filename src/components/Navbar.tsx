import React, { useState, useEffect } from 'react';
import { Github, Menu, X, Code2, Sparkles, HelpCircle } from 'lucide-react';
import { PORTFOLIO_CONFIG, GITHUB_USERNAME } from '../config/github';

interface NavbarProps {
  onOpenGuideModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuideModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Monogram */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-zinc-100 hover:text-cyan-400 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-zinc-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm sm:text-base leading-tight">
                {PORTFOLIO_CONFIG.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
                Portfolio
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800/80 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-full hover:bg-zinc-800/70 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
              title="View Setup & Vercel deployment guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Integration Guide</span>
            </button>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all hover:scale-105"
            >
              <Github className="w-4 h-4 text-zinc-200" />
              <span className="font-mono">@{GITHUB_USERNAME}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenGuideModal}
              className="p-2 text-zinc-400 hover:text-white"
              aria-label="Integration guide"
            >
              <HelpCircle className="w-5 h-5 text-cyan-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl bg-zinc-800 text-white border border-zinc-700"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile (@{GITHUB_USERNAME})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
