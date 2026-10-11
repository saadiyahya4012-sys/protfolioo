/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { VercelGuideModal } from './components/VercelGuideModal';

export default function App() {
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 antialiased font-sans">
      {/* Background ambient mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <Navbar onOpenGuideModal={() => setGuideModalOpen(true)} />

      {/* Main Sections */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects onOpenGuideModal={() => setGuideModalOpen(true)} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Integration & Vercel deployment modal */}
      <VercelGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
}
