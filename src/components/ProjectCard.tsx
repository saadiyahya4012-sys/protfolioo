import React from 'react';
import {
  ExternalLink,
  Github,
  Star,
  GitFork,
  Calendar,
  Sparkles,
  Code2,
  FolderGit2,
} from 'lucide-react';
import { GitHubRepository } from '../types/github';
import {
  LANGUAGE_COLORS,
  isValidLiveDemoUrl,
  sanitizeDemoUrl,
  formatRepoDate,
} from '../services/githubApi';

interface ProjectCardProps {
  repo: GitHubRepository;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ repo, index }) => {
  const hasLiveDemo = isValidLiveDemoUrl(repo.homepage);
  const liveUrl = hasLiveDemo ? sanitizeDemoUrl(repo.homepage!) : null;
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#6366f1' : '#64748b';

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-md"
      data-testid="project-card"
    >
      {/* Top ambient glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-75 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${langColor} 50%, transparent 100%)`,
        }}
      />

      {/* Card Header / Visual Area */}
      <div className="relative p-5 pb-4 bg-gradient-to-b from-zinc-800/40 to-transparent border-b border-zinc-800/40">
        <div className="flex items-center justify-between mb-3">
          {/* Language badge or Icon */}
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-zinc-800"
              style={{ backgroundColor: langColor }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-zinc-300">
              {repo.language || 'Codebase'}
            </span>
          </div>

          {/* Stars & Live Indicator */}
          <div className="flex items-center gap-3">
            {hasLiveDemo && (
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                title="Live Vercel / Production deployment available"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </span>
            )}

            <div
              className="flex items-center gap-1 text-xs text-zinc-400 font-mono bg-zinc-800/60 px-2 py-0.5 rounded-md border border-zinc-700/50"
              title={`${repo.stargazers_count} GitHub stars`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>{repo.stargazers_count}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2.5">
          <FolderGit2 className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <h3 className="text-lg font-semibold text-zinc-100 tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
            {repo.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">
            {repo.description || (
              <span className="italic text-zinc-500">
                No description provided for this repository. Check out the source code for implementation details.
              </span>
            )}
          </p>

          {/* Topics tags */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {repo.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/40"
                >
                  #{topic}
                </span>
              ))}
              {repo.topics.length > 4 && (
                <span className="text-[11px] text-zinc-500 self-center">
                  +{repo.topics.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="pt-4 border-t border-zinc-800/60 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            {/* Last updated date */}
            <div className="flex items-center gap-1.5" title={`Last pushed: ${repo.pushed_at || repo.updated_at}`}>
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Updated {formatRepoDate(repo.pushed_at || repo.updated_at)}</span>
            </div>

            {/* Forks if any */}
            {repo.forks_count > 0 && (
              <div className="flex items-center gap-1 text-zinc-500 font-mono">
                <GitFork className="w-3.5 h-3.5" />
                <span>{repo.forks_count}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: GitHub repo & optional Live Demo */}
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-zinc-800 hover:bg-zinc-700/90 text-zinc-200 hover:text-white transition-all duration-200 border border-zinc-700/60 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label={`View ${repo.name} source code on GitHub`}
            >
              <Github className="w-4 h-4 text-zinc-300" />
              <span>GitHub</span>
            </a>

            {hasLiveDemo && liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-zinc-950 transition-all duration-200 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
                aria-label={`Visit live demo for ${repo.name}`}
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
