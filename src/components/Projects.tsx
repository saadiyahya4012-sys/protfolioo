import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RefreshCw,
  Search,
  Filter,
  AlertCircle,
  ExternalLink,
  Github,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowUpDown,
  SlidersHorizontal,
  FolderGit2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { GitHubRepository, GitHubRateLimitInfo } from '../types/github';
import { fetchGitHubRepositories, formatRepoDate } from '../services/githubApi';
import { GITHUB_USERNAME } from '../config/github';
import { ProjectCard } from './ProjectCard';
import { SectionGlow } from './AnimatedBackground';

interface ProjectsProps {
  onOpenGuideModal?: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onOpenGuideModal }) => {
  const [username, setUsername] = useState<string>(GITHUB_USERNAME);
  const [inputUsername, setInputUsername] = useState<string>(GITHUB_USERNAME);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<GitHubRateLimitInfo | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(false);

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');
  const [includeForks, setIncludeForks] = useState<boolean>(false);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [onlyWithLiveDemo, setOnlyWithLiveDemo] = useState<boolean>(false);

  // Load repositories function
  const loadRepositories = useCallback(
    async (isManualRefresh: boolean = false, userToFetch: string = username) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await fetchGitHubRepositories(userToFetch, {
          includeForks,
          includeArchived,
          forceRefresh: isManualRefresh,
        });

        setRepositories(result.repositories);
        setRateLimit(result.rateLimit);
        setLastFetched(result.lastFetchedAt);
        setFromCache(result.fromCache);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to retrieve repositories.';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [username, includeForks, includeArchived]
  );

  // Initial fetch and 5-minute periodic auto-refresh
  useEffect(() => {
    loadRepositories(false, username);

    // Refresh every 5 minutes (300,000 ms) as specified
    const intervalId = setInterval(() => {
      loadRepositories(false, username);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [loadRepositories, username]);

  // Handle username submission from test bar
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim() && inputUsername.trim() !== username) {
      const clean = inputUsername.trim();
      setUsername(clean);
      loadRepositories(true, clean);
    }
  };

  // Reset to default configured username
  const handleResetToConfigUsername = () => {
    setInputUsername(GITHUB_USERNAME);
    setUsername(GITHUB_USERNAME);
    loadRepositories(true, GITHUB_USERNAME);
  };

  // Extract unique languages from repositories
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repositories.forEach((repo) => {
      if (repo.language) {
        langs.add(repo.language);
      }
    });
    return ['All', ...Array.from(langs).sort()];
  }, [repositories]);

  // Filtered and sorted repositories
  const filteredRepositories = useMemo(() => {
    return repositories
      .filter((repo) => {
        // Language filter
        if (selectedLanguage !== 'All' && repo.language !== selectedLanguage) {
          return false;
        }

        // Live Demo filter
        if (onlyWithLiveDemo) {
          const hasHomepage =
            repo.homepage &&
            (repo.homepage.startsWith('http://') || repo.homepage.startsWith('https://'));
          if (!hasHomepage) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = repo.name.toLowerCase().includes(q);
          const matchDesc = repo.description?.toLowerCase().includes(q);
          const matchLang = repo.language?.toLowerCase().includes(q);
          const matchTopic = repo.topics?.some((t) => t.toLowerCase().includes(q));
          return matchName || matchDesc || matchLang || matchTopic;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return b.stargazers_count - a.stargazers_count;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // Default: most recently updated
        const dateA = new Date(a.pushed_at || a.updated_at).getTime();
        const dateB = new Date(b.pushed_at || b.updated_at).getTime();
        return dateB - dateA;
      });
  }, [repositories, selectedLanguage, onlyWithLiveDemo, searchQuery, sortBy]);

  // Projects stats
  const stats = useMemo(() => {
    const totalStars = repositories.reduce((sum, r) => sum + r.stargazers_count, 0);
    const withLiveDemo = repositories.filter(
      (r) => r.homepage && (r.homepage.startsWith('http://') || r.homepage.startsWith('https://'))
    ).length;
    return { total: repositories.length, totalStars, withLiveDemo };
  }, [repositories]);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <SectionGlow variant="projects" />
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatic GitHub Sync</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects & Repositories
          </h2>
          <p className="mt-2 text-base text-zinc-400 max-w-2xl">
            Live public projects synced directly from GitHub. Discover recent code commits, star
            counts, tech stacks, and live Vercel deployments.
          </p>
        </div>

        {/* Sync Controls & Manual Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => loadRepositories(true)}
            disabled={refreshing || loading}
            aria-label="Refresh repository data manually"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/70 hover:border-cyan-500/50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
            />
            <span>{refreshing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>

          {onOpenGuideModal && (
            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40 transition-colors"
              title="Vercel & GitHub Setup Instructions"
            >
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Setup Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* GitHub Sync Status Bar */}
      <div className="mb-8 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Active Username & Source */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2 bg-zinc-800/70 px-3 py-1.5 rounded-lg border border-zinc-700/50">
            <Github className="w-4 h-4 text-zinc-200" />
            <span className="text-zinc-400">Account:</span>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-medium text-cyan-400 hover:underline flex items-center gap-1"
            >
              @{username}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {lastFetched && (
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>
                Updated: <span className="text-zinc-300">{formatRepoDate(new Date(lastFetched).toISOString())}</span>
              </span>
              {fromCache && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                  cached
                </span>
              )}
            </div>
          )}

          {rateLimit && (
            <div
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${
                rateLimit.remaining < 5
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/30'
              }`}
              title={`Rate limit resets at ${new Date(rateLimit.resetTime * 1000).toLocaleTimeString()}`}
            >
              API: {rateLimit.remaining}/{rateLimit.limit} reqs
            </div>
          )}
        </div>

        {/* Right: Quick Switcher / Test Any GitHub Handle */}
        <form onSubmit={handleUsernameSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Test GitHub username..."
              className="w-full bg-zinc-950/70 text-xs text-zinc-200 placeholder-zinc-500 pl-3 pr-2 py-1.5 rounded-lg border border-zinc-700/60 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            Load
          </button>
          {username !== GITHUB_USERNAME && (
            <button
              type="button"
              onClick={handleResetToConfigUsername}
              className="text-xs text-zinc-400 hover:text-cyan-400 underline underline-offset-2 ml-1"
              title="Reset back to configured GITHUB_USERNAME"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, description, topic..."
              className="w-full bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-500 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Sort and Live Demo Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-zinc-900/60 px-3 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars' | 'name')}
                className="bg-transparent text-zinc-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="updated" className="bg-zinc-900 text-zinc-200">
                  Recently Updated
                </option>
                <option value="stars" className="bg-zinc-900 text-zinc-200">
                  Most Stars
                </option>
                <option value="name" className="bg-zinc-900 text-zinc-200">
                  Alphabetical
                </option>
              </select>
            </div>

            {/* Live Demo Only Toggle */}
            <button
              onClick={() => setOnlyWithLiveDemo(!onlyWithLiveDemo)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                onlyWithLiveDemo
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50 shadow-sm shadow-emerald-900/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  onlyWithLiveDemo ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                }`}
              />
              <span>Live Demos ({stats.withLiveDemo})</span>
            </button>
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1" />
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedLanguage === lang
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-zinc-800/80'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-950/30 border border-rose-800/50 backdrop-blur-md text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-rose-200">GitHub API Notice</h4>
              <p className="text-xs text-rose-300/80 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => loadRepositories(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 transition-colors shrink-0"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 animate-pulse flex flex-col justify-between h-72"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 w-20 bg-zinc-800 rounded-md" />
                  <div className="h-4 w-12 bg-zinc-800 rounded-md" />
                </div>
                <div className="h-6 w-3/4 bg-zinc-800 rounded-md mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-zinc-800/60 rounded" />
                  <div className="h-3 w-5/6 bg-zinc-800/60 rounded" />
                  <div className="h-3 w-2/3 bg-zinc-800/60 rounded" />
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800/50 flex gap-3">
                <div className="h-8 flex-1 bg-zinc-800 rounded-xl" />
                <div className="h-8 flex-1 bg-zinc-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRepositories.length > 0 ? (
        /* Repository Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepositories.map((repo, index) => (
            <ProjectCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-12 text-center max-w-xl mx-auto backdrop-blur-sm">
          <FolderGit2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Repositories Found</h3>
          <p className="text-sm text-zinc-400 mb-6">
            {searchQuery || selectedLanguage !== 'All' || onlyWithLiveDemo
              ? 'No projects match your active search and filter criteria. Try resetting filters.'
              : `No public repositories found for GitHub account @${username}. Check that the repositories are public and not forks.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(searchQuery || selectedLanguage !== 'All' || onlyWithLiveDemo) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('All');
                  setOnlyWithLiveDemo(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => loadRepositories(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
            >
              Refresh GitHub
            </button>
          </div>
        </div>
      )}

      {/* Section Footer / GitHub Notice */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/60 pt-6 gap-3">
        <p>
          Showing <span className="text-zinc-300 font-medium">{filteredRepositories.length}</span> of{' '}
          <span className="text-zinc-300 font-medium">{repositories.length}</span> public repositories
        </p>
        <p className="flex items-center gap-1.5">
          <span>Auto-refreshes every 5 minutes</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <a
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            View all on GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </section>
  );
};
