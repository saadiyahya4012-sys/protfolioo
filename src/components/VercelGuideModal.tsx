import React from 'react';
import { X, Check, Copy, ExternalLink, Terminal, Globe, Github, Sparkles } from 'lucide-react';
import { GITHUB_USERNAME } from '../config/github';

interface VercelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelGuideModal: React.FC<VercelGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-zinc-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">GitHub &amp; Vercel Integration Guide</h3>
              <p className="text-xs text-zinc-400">Step-by-step instructions for your portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-xs">
                1
              </span>
              <span>Where to enter your GitHub username</span>
            </div>
            <p className="text-zinc-300 text-xs pl-8">
              Open the configuration file at <code className="text-cyan-300 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">src/config/github.ts</code> and update the <code className="text-cyan-300 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">GITHUB_USERNAME</code> constant:
            </p>
            <div className="pl-8">
              <div className="relative rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 font-mono text-xs text-zinc-300 flex items-center justify-between">
                <span>export const GITHUB_USERNAME = "{GITHUB_USERNAME}";</span>
                <button
                  onClick={() => handleCopy(`export const GITHUB_USERNAME = "${GITHUB_USERNAME}";`, 1)}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Copy code"
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-xs">
                2
              </span>
              <span>How to configure the "Live Demo" URL on GitHub</span>
            </div>
            <p className="text-zinc-300 text-xs pl-8 leading-relaxed">
              For any repository you want to show a <strong className="text-white">Live Demo</strong> button:
            </p>
            <ol className="list-decimal list-inside pl-8 text-xs text-zinc-400 space-y-1.5">
              <li>Go to your repository on GitHub: <code className="text-zinc-300 font-mono">github.com/{GITHUB_USERNAME}/[repo-name]</code>.</li>
              <li>On the right sidebar of the repository page, click the <strong className="text-zinc-200">⚙️ Settings gear icon</strong> next to <strong className="text-zinc-200">About</strong>.</li>
              <li>Check the <strong className="text-zinc-200">Use your GitHub Pages website</strong> box OR enter your Vercel deployment URL (e.g. <code className="text-emerald-400 font-mono">https://my-app.vercel.app</code>) into the <strong className="text-zinc-200">Website</strong> field.</li>
              <li>Click <strong className="text-zinc-200">Save changes</strong>.</li>
            </ol>
            <p className="text-[11px] text-zinc-500 pl-8 italic">
              ✦ The portfolio automatically reads the repository's <code className="font-mono text-zinc-400">homepage</code> field via GitHub REST API and generates the Live Demo button!
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-xs">
                3
              </span>
              <span>How to commit and push to Vercel</span>
            </div>
            <p className="text-zinc-300 text-xs pl-8">
              Commit the changes to your Git repository connected to Vercel:
            </p>
            <div className="pl-8">
              <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 font-mono text-xs text-zinc-300 space-y-1">
                <p className="text-zinc-500"># Stage and commit</p>
                <p>git add .</p>
                <p>git commit -m "feat: automatic GitHub projects integration with Vercel live demo"</p>
                <p className="text-zinc-500"># Push to main branch</p>
                <p>git push origin main</p>
              </div>
            </div>
            <p className="text-zinc-400 text-xs pl-8">
              Vercel will detect the push, run <code className="text-zinc-200 font-mono">vite build</code>, and automatically deploy the updated site!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
