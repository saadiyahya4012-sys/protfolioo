import React from 'react';

/**
 * Global futuristic background covering the ENTIRE website (hero → contact).
 * Fixed layer stays visible while scrolling; all circles drift behind content.
 * Pure CSS keyframes (see index.css), transform/opacity only for performance.
 * Decorative only — pointer-events-none, -z-10, aria-hidden, never blocks clicks.
 */
export const AnimatedBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Blurred gradient orbs drifting slowly (different speeds for depth) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] animate-drift" />
      <div
        className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] animate-drift"
        style={{ animationDuration: '26s', animationDelay: '-8s' }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-drift"
        style={{ animationDuration: '32s', animationDelay: '-15s' }}
      />
      <div
        className="absolute -bottom-48 right-[15%] w-[28rem] h-[28rem] bg-blue-600/10 rounded-full blur-[128px] animate-drift"
        style={{ animationDuration: '29s', animationDelay: '-11s' }}
      />

      {/* ---- Floating circles: hero zone (top) ---- */}
      <div className="absolute top-[10%] left-[6%] w-24 h-24 rounded-full bg-cyan-500/[0.06] border border-cyan-400/10 animate-float" />
      <div
        className="absolute top-[20%] right-[8%] w-16 h-16 rounded-full bg-indigo-500/[0.07] border border-indigo-400/10 animate-float-x"
        style={{ animationDuration: '9s', animationDelay: '-3s' }}
      />
      <div
        className="absolute top-[6%] left-[38%] hidden md:block w-12 h-12 rounded-full bg-blue-500/[0.07] border border-blue-400/10 animate-float-y"
        style={{ animationDuration: '10s', animationDelay: '-4s' }}
      />

      {/* ---- Floating circles: about / skills zone (upper-middle) ---- */}
      <div
        className="absolute top-[32%] left-[4%] w-28 h-28 rounded-full bg-purple-500/[0.05] border border-purple-400/10 animate-float-y"
        style={{ animationDuration: '12s', animationDelay: '-5s' }}
      />
      <div
        className="absolute top-[38%] right-[12%] w-10 h-10 rounded-full bg-cyan-400/[0.07] border border-cyan-300/10 animate-float"
        style={{ animationDuration: '7s', animationDelay: '-2s' }}
      />
      <div
        className="absolute top-[46%] left-[44%] hidden md:block w-20 h-20 rounded-full bg-blue-500/[0.05] border border-blue-400/10 animate-float-x"
        style={{ animationDuration: '11s', animationDelay: '-6s' }}
      />
      <div
        className="absolute top-[52%] right-[30%] hidden lg:block w-14 h-14 rounded-full bg-indigo-500/[0.06] border border-indigo-400/10 animate-float"
        style={{ animationDuration: '8.5s', animationDelay: '-1s' }}
      />

      {/* ---- Floating circles: projects zone (lower-middle) ---- */}
      <div
        className="absolute top-[60%] left-[10%] w-36 h-36 rounded-full bg-cyan-500/[0.05] border border-cyan-400/10 animate-float-x"
        style={{ animationDuration: '13s', animationDelay: '-7s' }}
      />
      <div
        className="absolute top-[66%] right-[6%] w-24 h-24 rounded-full bg-purple-500/[0.06] border border-purple-400/10 animate-float"
        style={{ animationDuration: '9.5s', animationDelay: '-3.5s' }}
      />
      <div
        className="absolute top-[58%] left-[60%] hidden md:block w-8 h-8 rounded-full bg-blue-400/[0.08] border border-blue-300/10 animate-float-y"
        style={{ animationDuration: '7.5s', animationDelay: '-2.5s' }}
      />

      {/* ---- Floating circles: contact / footer zone (bottom) ---- */}
      <div
        className="absolute bottom-[14%] left-[8%] w-28 h-28 rounded-full bg-indigo-500/[0.06] border border-indigo-400/10 animate-float"
        style={{ animationDuration: '10.5s', animationDelay: '-4.5s' }}
      />
      <div
        className="absolute bottom-[8%] right-[14%] w-40 h-40 rounded-full bg-cyan-500/[0.05] border border-cyan-400/10 animate-float-y"
        style={{ animationDuration: '14s', animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-[22%] left-[45%] hidden md:block w-12 h-12 rounded-full bg-purple-500/[0.07] border border-purple-400/10 animate-float-x"
        style={{ animationDuration: '8s', animationDelay: '-2s' }}
      />
      <div
        className="absolute bottom-[5%] left-[55%] hidden lg:block w-16 h-16 rounded-full bg-blue-500/[0.06] border border-blue-400/10 animate-float"
        style={{ animationDuration: '9s', animationDelay: '-5s' }}
      />

      {/* ---- Thin neon rotating outlines, spread top → bottom ---- */}
      <div className="absolute top-[8%] right-[18%] hidden sm:block w-56 h-56 animate-spin-slower">
        <div className="absolute inset-0 rounded-full border border-cyan-500/15" />
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400/70 shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]" />
      </div>
      <div className="absolute top-[44%] left-[2%] hidden lg:block w-44 h-44 animate-spin-reverse">
        <div className="absolute inset-0 rounded-full border border-blue-500/15" />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400/70 shadow-[0_0_12px_2px_rgba(96,165,250,0.6)]" />
      </div>
      <div className="absolute top-[40%] right-[42%] hidden lg:block w-40 h-40 animate-spin-reverse">
        <div className="absolute inset-0 rounded-full border border-purple-500/15" />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400/70 shadow-[0_0_12px_2px_rgba(192,132,252,0.6)]" />
      </div>
      <div className="absolute bottom-[22%] right-[4%] hidden sm:block w-48 h-48 animate-spin-slower">
        <div className="absolute inset-0 rounded-full border border-indigo-500/15" />
        <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400/70 shadow-[0_0_12px_2px_rgba(129,140,248,0.6)]" />
      </div>
      <div className="absolute bottom-[6%] left-[4%] hidden sm:block w-72 h-72 animate-spin-slow">
        <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/15" />
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400/70 shadow-[0_0_12px_2px_rgba(129,140,248,0.6)]" />
      </div>

      {/* ---- Soft glowing particles, spread top → bottom ---- */}
      <span className="absolute top-[14%] left-[22%] w-1.5 h-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)] animate-twinkle" />
      <span
        className="absolute top-[26%] left-[78%] w-1 h-1 rounded-full bg-indigo-300/70 shadow-[0_0_10px_2px_rgba(129,140,248,0.5)] animate-twinkle"
        style={{ animationDelay: '-1.5s', animationDuration: '3.5s' }}
      />
      <span
        className="absolute top-[42%] left-[12%] w-1 h-1 rounded-full bg-blue-300/70 shadow-[0_0_10px_2px_rgba(96,165,250,0.5)] animate-twinkle"
        style={{ animationDelay: '-2s', animationDuration: '4s' }}
      />
      <span
        className="absolute top-[55%] left-[85%] w-1 h-1 rounded-full bg-purple-300/70 shadow-[0_0_10px_2px_rgba(192,132,252,0.5)] animate-twinkle"
        style={{ animationDelay: '-2.5s', animationDuration: '4.2s' }}
      />
      <span
        className="absolute top-[48%] left-[52%] hidden md:block w-1 h-1 rounded-full bg-blue-300/60 shadow-[0_0_10px_2px_rgba(96,165,250,0.5)] animate-twinkle"
        style={{ animationDelay: '-3s', animationDuration: '3.8s' }}
      />
      <span
        className="absolute top-[68%] left-[30%] w-1.5 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)] animate-twinkle"
        style={{ animationDelay: '-0.8s', animationDuration: '2.8s' }}
      />
      <span
        className="absolute top-[78%] right-[22%] w-1 h-1 rounded-full bg-indigo-300/60 shadow-[0_0_10px_2px_rgba(129,140,248,0.5)] animate-twinkle"
        style={{ animationDelay: '-1.8s', animationDuration: '3.2s' }}
      />
      <span
        className="absolute bottom-[10%] left-[35%] w-1.5 h-1.5 rounded-full bg-purple-300/60 shadow-[0_0_10px_2px_rgba(192,132,252,0.5)] animate-twinkle"
        style={{ animationDelay: '-2.8s', animationDuration: '3.6s' }}
      />
      <span
        className="absolute bottom-[18%] right-[35%] hidden md:block w-1 h-1 rounded-full bg-cyan-300/60 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)] animate-twinkle"
        style={{ animationDelay: '-1s', animationDuration: '3s' }}
      />
    </div>
  );
};

/**
 * Subtle per-section floating circles for About / Skills / Projects / Contact.
 * Keeps content readable: low opacity, behind content (-z-10), non-interactive.
 */
export const SectionGlow: React.FC<{ variant?: 'about' | 'skills' | 'projects' | 'contact' }> = ({
  variant = 'about',
}) => {
  if (variant === 'contact') {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -bottom-20 left-[10%] w-80 h-80 bg-blue-600/[0.08] rounded-full blur-[100px] animate-drift" />
        <div className="absolute top-[15%] right-[8%] w-24 h-24 rounded-full bg-cyan-500/[0.05] border border-cyan-400/10 animate-float" />
        <div
          className="absolute bottom-[15%] left-[6%] w-28 h-28 rounded-full bg-purple-500/[0.05] border border-purple-400/10 animate-float-y"
          style={{ animationDuration: '11s' }}
        />
        <span className="absolute top-[30%] left-[20%] w-1 h-1 rounded-full bg-cyan-300/50 shadow-[0_0_10px_2px_rgba(34,211,238,0.4)] animate-twinkle" />
        <span
          className="absolute bottom-[30%] right-[18%] w-1.5 h-1.5 rounded-full bg-blue-300/50 shadow-[0_0_10px_2px_rgba(96,165,250,0.4)] animate-twinkle"
          style={{ animationDelay: '-2s' }}
        />
      </div>
    );
  }

  if (variant === 'skills') {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-10 right-[10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] animate-drift" />
        <div className="absolute top-[30%] left-[4%] w-20 h-20 rounded-full bg-cyan-500/[0.05] border border-cyan-400/10 animate-float" />
        <div
          className="absolute bottom-[8%] right-[6%] w-28 h-28 rounded-full bg-purple-500/[0.05] border border-purple-400/10 animate-float-y"
          style={{ animationDuration: '11s' }}
        />
        <span className="absolute top-[20%] left-[45%] w-1 h-1 rounded-full bg-cyan-300/50 shadow-[0_0_10px_2px_rgba(34,211,238,0.4)] animate-twinkle" />
        <span
          className="absolute bottom-[25%] left-[20%] w-1 h-1 rounded-full bg-indigo-300/50 shadow-[0_0_10px_2px_rgba(129,140,248,0.4)] animate-twinkle"
          style={{ animationDelay: '-2s' }}
        />
      </div>
    );
  }

  if (variant === 'projects') {
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div
          className="absolute top-[10%] left-[8%] w-24 h-24 rounded-full bg-cyan-500/[0.05] border border-cyan-400/10 animate-float-x"
          style={{ animationDuration: '10s' }}
        />
        <div
          className="absolute bottom-[12%] right-[10%] w-36 h-36 rounded-full bg-indigo-500/[0.05] border border-indigo-400/10 animate-float"
          style={{ animationDuration: '13s' }}
        />
        <span className="absolute top-[35%] right-[20%] w-1.5 h-1.5 rounded-full bg-purple-300/50 shadow-[0_0_10px_2px_rgba(192,132,252,0.4)] animate-twinkle" />
      </div>
    );
  }

  // about (default)
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
      <div className="absolute -top-16 left-[15%] w-72 h-72 bg-cyan-600/[0.07] rounded-full blur-[100px] animate-drift" />
      <div className="absolute top-[40%] -left-10 w-28 h-28 rounded-full bg-indigo-500/[0.06] border border-indigo-400/10 animate-float" />
      <div
        className="absolute bottom-[5%] right-[12%] w-20 h-20 rounded-full bg-purple-500/[0.06] border border-purple-400/10 animate-float-y"
        style={{ animationDuration: '9s' }}
      />
      <span className="absolute top-[25%] right-[25%] w-1 h-1 rounded-full bg-cyan-300/50 shadow-[0_0_10px_2px_rgba(34,211,238,0.4)] animate-twinkle" />
    </div>
  );
};
