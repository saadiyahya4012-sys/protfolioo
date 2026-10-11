/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AnimatedBackground } from './components/AnimatedBackground';
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
      {/* Global animated futuristic background */}
      <AnimatedBackground />

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
