import React, { useState } from 'react';
import { Layers, CheckCircle2, Code, Database, Server, Wrench } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/github';
import { SectionGlow } from './AnimatedBackground';

export const Skills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'devops' | 'tools'>('all');

  const categories = [
    {
      id: 'frontend',
      label: 'Frontend',
      icon: Code,
      items: PORTFOLIO_CONFIG.skills.frontend,
      description: 'Responsive, accessible, component-driven user interfaces.',
    },
    {
      id: 'backend',
      label: 'Backend & APIs',
      icon: Database,
      items: PORTFOLIO_CONFIG.skills.backend,
      description: 'Robust server logic, REST/GraphQL APIs, and database schemas.',
    },
    {
      id: 'devops',
      label: 'DevOps & Cloud',
      icon: Server,
      items: PORTFOLIO_CONFIG.skills.devops,
      description: 'Automated CI/CD pipelines, edge deployments on Vercel, and containers.',
    },
    {
      id: 'tools',
      label: 'Tools & Testing',
      icon: Wrench,
      items: PORTFOLIO_CONFIG.skills.tools,
      description: 'Developer productivity tools, type safety, and test suites.',
    },
  ];

  const displayedCategories = activeTab === 'all'
    ? categories
    : categories.filter((c) => c.id === activeTab);

  return (
    <section id="skills" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <SectionGlow variant="skills" />
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Technical Skills & Technologies
        </h2>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base">
          A battle-tested stack honed through production deployments and open-source contributions.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-zinc-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Skills
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeTab === cat.id
                  ? 'bg-cyan-500 text-zinc-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 border border-zinc-700/50">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">{cat.label}</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-5">{cat.description}</p>

              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 hover:border-cyan-500/40 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
