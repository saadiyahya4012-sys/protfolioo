/**
 * GitHub Portfolio Configuration
 * 
 * TO CONFIGURE YOUR PORTFOLIO:
 * Change GITHUB_USERNAME to your personal GitHub username.
 * For example:
 *   export const GITHUB_USERNAME = "your-github-username";
 * 
 * When deploying to Vercel, this is the only line you need to adjust
 * to showcase all your public repositories automatically!
 */

export const GITHUB_USERNAME = "saadiyahya4012-sys";
export const PORTFOLIO_CONFIG = {
  name: "Saadi Yahya",
  title: "Senior Full-Stack & Frontend Engineer",
  tagline: "Building resilient web applications, modern interfaces, and scalable cloud architectures.",
  bio: "Passionate developer specializing in React, TypeScript, Next.js, and modern distributed web systems. I turn complex logic into intuitive, high-performance user experiences.",
  location: "Morocco",
  status: "Available for new projects & opportunities",
  email: "saadiyahya4012@gmail.com",
  socials: {
    github: `https://github.com/${GITHUB_USERNAME}`,
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
  skills: {
    frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite", "Motion / Framer", "Redux / Zustand", "HTML5 / CSS3"],
    backend: ["Node.js", "Express", "RESTful APIs", "GraphQL", "PostgreSQL", "Firebase / Firestore", "Prisma"],
    devops: ["Vercel", "Git & GitHub Actions", "Docker", "Cloud Run", "CI/CD", "Performance Optimization"],
    tools: ["VS Code", "Figma", "Postman", "Jest / Vitest", "ESLint", "Webpack / Rollup"]
  }
};
