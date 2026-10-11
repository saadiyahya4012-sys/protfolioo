import { GitHubRepository, GitHubRateLimitInfo, GitHubUserProfile } from '../types/github';

const CACHE_KEY_PREFIX = 'portfolio_github_repos_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export interface FetchReposOptions {
  includeForks?: boolean;
  includeArchived?: boolean;
  forceRefresh?: boolean;
}

export interface FetchReposResult {
  repositories: GitHubRepository[];
  rateLimit: GitHubRateLimitInfo | null;
  fromCache: boolean;
  lastFetchedAt: number;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  'C#': '#178600',
  C: '#555555',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  SCSS: '#c6538c',
  Jupyter: '#DA5B0B',
  Solidity: '#AA6746',
  Lua: '#000080',
};

/**
 * Validates if a string is a legitimate HTTP or HTTPS URL for live demo
 */
export function isValidLiveDemoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalizes homepage URL for clean safe display
 */
export function sanitizeDemoUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Format date nicely for human readability
 */
export function formatRepoDate(isoString: string): string {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

/**
 * Parse rate limit headers from GitHub REST response
 */
function parseRateLimit(headers: Headers): GitHubRateLimitInfo | null {
  const limit = headers.get('x-ratelimit-limit');
  const remaining = headers.get('x-ratelimit-remaining');
  const reset = headers.get('x-ratelimit-reset');
  const used = headers.get('x-ratelimit-used');

  if (limit && remaining && reset) {
    return {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      resetTime: parseInt(reset, 10),
      used: used ? parseInt(used, 10) : 0,
    };
  }
  return null;
}

/**
 * Fetches user repositories with automatic cache and rate limit handling
 */
export async function fetchGitHubRepositories(
  username: string,
  options: FetchReposOptions = {}
): Promise<FetchReposResult> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Please provide a valid GitHub username.');
  }

  const cacheKey = `${CACHE_KEY_PREFIX}${cleanUsername.toLowerCase()}`;
  const now = Date.now();

  // Check cached storage if not forced
  if (!options.forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.repositories) && now - parsed.timestamp < CACHE_TTL_MS) {
          let repos: GitHubRepository[] = parsed.repositories;
          if (!options.includeForks) {
            repos = repos.filter((r) => !r.fork);
          }
          if (!options.includeArchived) {
            repos = repos.filter((r) => !r.archived);
          }
          return {
            repositories: repos,
            rateLimit: parsed.rateLimit || null,
            fromCache: true,
            lastFetchedAt: parsed.timestamp,
          };
        }
      }
    } catch {
      // LocalStorage errors ignored
    }
  }

  // GitHub REST API endpoint
  // Requests per_page=100 sorted by updated
  const url = `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=100`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
  } catch (err: unknown) {
    // If network fails, try to return any stale cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.repositories) {
          let repos: GitHubRepository[] = parsed.repositories;
          if (!options.includeForks) repos = repos.filter((r) => !r.fork);
          if (!options.includeArchived) repos = repos.filter((r) => !r.archived);
          return {
            repositories: repos,
            rateLimit: parsed.rateLimit || null,
            fromCache: true,
            lastFetchedAt: parsed.timestamp,
          };
        }
      }
    } catch {
      // ignore
    }
    throw new Error(
      err instanceof Error
        ? `Network connection error: ${err.message}`
        : 'Network connection failed while reaching GitHub API.'
    );
  }

  const rateLimit = parseRateLimit(response.headers);

  if (response.status === 404) {
    throw new Error(`GitHub user "${cleanUsername}" was not found. Please verify the username.`);
  }

  if (response.status === 403) {
    const isRateLimit = rateLimit && rateLimit.remaining === 0;
    const resetDate = rateLimit ? new Date(rateLimit.resetTime * 1000).toLocaleTimeString() : 'soon';
    
    // Check if we have stale cache to rescue the UI
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.repositories) {
          let repos: GitHubRepository[] = parsed.repositories;
          if (!options.includeForks) repos = repos.filter((r) => !r.fork);
          if (!options.includeArchived) repos = repos.filter((r) => !r.archived);
          return {
            repositories: repos,
            rateLimit,
            fromCache: true,
            lastFetchedAt: parsed.timestamp,
          };
        }
      }
    } catch {
      // ignore
    }

    if (isRateLimit) {
      throw new Error(`GitHub API rate limit exceeded (60 req/hr). Resets at ${resetDate}.`);
    }
    throw new Error('GitHub API request was forbidden (403).');
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const rawRepos: GitHubRepository[] = await response.json();

  // Save full list into localStorage cache
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        repositories: rawRepos,
        rateLimit,
        timestamp: now,
      })
    );
  } catch {
    // LocalStorage quota might be full, safe to continue
  }

  // Filter based on options
  let filtered = rawRepos;
  if (!options.includeForks) {
    filtered = filtered.filter((r) => !r.fork);
  }
  if (!options.includeArchived) {
    filtered = filtered.filter((r) => !r.archived);
  }

  // Sort by most recently updated date (descending)
  filtered.sort((a, b) => {
    const dateA = new Date(a.pushed_at || a.updated_at).getTime();
    const dateB = new Date(b.pushed_at || b.updated_at).getTime();
    return dateB - dateA;
  });

  return {
    repositories: filtered,
    rateLimit,
    fromCache: false,
    lastFetchedAt: now,
  };
}

/**
 * Fetch GitHub user profile information
 */
export async function fetchGitHubProfile(username: string): Promise<GitHubUserProfile | null> {
  const cleanUsername = username.trim();
  if (!cleanUsername) return null;

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
