import type { Repo } from "./types";

export type Candidate = { path: string; lang: string };

export type PoolRepo = Repo & {
  /** Candidate source files; the builder picks one at random per load. */
  candidates: Candidate[];
};

/**
 * Curated pool of famous OSS repos across languages. Each load samples a
 * random subset. File paths target long-lived files on the default branch and
 * are fetched via the GitHub contents API (resilient to branch naming).
 */
export const POOL: PoolRepo[] = [
  {
    fullName: "facebook/react",
    description: "The library for web and native user interfaces.",
    url: "https://github.com/facebook/react",
    candidates: [
      { path: "packages/react/src/ReactHooks.js", lang: "javascript" },
      { path: "packages/react/src/ReactChildren.js", lang: "javascript" },
    ],
  },
  {
    fullName: "microsoft/vscode",
    description: "Visual Studio Code — code editing, redefined.",
    url: "https://github.com/microsoft/vscode",
    candidates: [
      { path: "src/vs/base/common/strings.ts", lang: "typescript" },
      { path: "src/vs/base/common/arrays.ts", lang: "typescript" },
    ],
  },
  {
    fullName: "torvalds/linux",
    description: "Linux kernel source tree.",
    url: "https://github.com/torvalds/linux",
    candidates: [
      { path: "kernel/exit.c", lang: "c" },
      { path: "mm/mmap.c", lang: "c" },
    ],
  },
  {
    fullName: "django/django",
    description: "The web framework for perfectionists with deadlines.",
    url: "https://github.com/django/django",
    candidates: [
      { path: "django/core/paginator.py", lang: "python" },
      { path: "django/urls/base.py", lang: "python" },
    ],
  },
  {
    fullName: "rust-lang/rust",
    description: "Empowering everyone to build reliable, efficient software.",
    url: "https://github.com/rust-lang/rust",
    candidates: [
      { path: "library/core/src/option.rs", lang: "rust" },
      { path: "library/alloc/src/vec/mod.rs", lang: "rust" },
    ],
  },
  {
    fullName: "vercel/next.js",
    description: "The React framework.",
    url: "https://github.com/vercel/next.js",
    candidates: [
      { path: "packages/next/src/server/next.ts", lang: "typescript" },
    ],
  },
  {
    fullName: "golang/go",
    description: "The Go programming language.",
    url: "https://github.com/golang/go",
    candidates: [
      { path: "src/sort/sort.go", lang: "go" },
      { path: "src/strings/strings.go", lang: "go" },
    ],
  },
  {
    fullName: "pallets/flask",
    description: "The Python micro framework for building web applications.",
    url: "https://github.com/pallets/flask",
    candidates: [
      { path: "src/flask/helpers.py", lang: "python" },
      { path: "src/flask/blueprints.py", lang: "python" },
    ],
  },
  {
    fullName: "redis/redis",
    description: "An in-memory database that persists on disk.",
    url: "https://github.com/redis/redis",
    candidates: [
      { path: "src/dict.c", lang: "c" },
      { path: "src/sds.c", lang: "c" },
    ],
  },
  {
    fullName: "nodejs/node",
    description: "Node.js JavaScript runtime.",
    url: "https://github.com/nodejs/node",
    candidates: [
      { path: "lib/events.js", lang: "javascript" },
      { path: "lib/path.js", lang: "javascript" },
    ],
  },
  {
    fullName: "python/cpython",
    description: "The Python programming language.",
    url: "https://github.com/python/cpython",
    candidates: [
      { path: "Lib/textwrap.py", lang: "python" },
      { path: "Lib/string.py", lang: "python" },
    ],
  },
  {
    fullName: "vuejs/core",
    description: "Vue.js — the progressive JavaScript framework.",
    url: "https://github.com/vuejs/core",
    candidates: [
      { path: "packages/shared/src/index.ts", lang: "typescript" },
    ],
  },
  {
    fullName: "kubernetes/kubernetes",
    description: "Production-grade container scheduling and management.",
    url: "https://github.com/kubernetes/kubernetes",
    candidates: [
      { path: "pkg/util/node/node.go", lang: "go" },
    ],
  },
  {
    fullName: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework.",
    url: "https://github.com/tailwindlabs/tailwindcss",
    candidates: [
      { path: "packages/tailwindcss/src/utils/segment.ts", lang: "typescript" },
    ],
  },
  {
    fullName: "expressjs/express",
    description: "Fast, unopinionated, minimalist web framework for Node.js.",
    url: "https://github.com/expressjs/express",
    candidates: [
      { path: "lib/utils.js", lang: "javascript" },
      { path: "lib/request.js", lang: "javascript" },
    ],
  },
  {
    fullName: "pytorch/pytorch",
    description: "Tensors and dynamic neural networks in Python.",
    url: "https://github.com/pytorch/pytorch",
    candidates: [
      { path: "torch/functional.py", lang: "python" },
    ],
  },
  {
    fullName: "laravel/framework",
    description: "The Laravel framework core.",
    url: "https://github.com/laravel/framework",
    candidates: [
      { path: "src/Illuminate/Support/Str.php", lang: "php" },
    ],
  },
  {
    fullName: "rails/rails",
    description: "Ruby on Rails — full-stack web framework.",
    url: "https://github.com/rails/rails",
    candidates: [
      { path: "activesupport/lib/active_support/inflector/methods.rb", lang: "ruby" },
    ],
  },
  {
    fullName: "sveltejs/svelte",
    description: "Cybernetically enhanced web apps.",
    url: "https://github.com/sveltejs/svelte",
    candidates: [
      { path: "packages/svelte/src/utils.js", lang: "javascript" },
    ],
  },
  {
    fullName: "denoland/deno",
    description: "A modern runtime for JavaScript and TypeScript.",
    url: "https://github.com/denoland/deno",
    candidates: [
      { path: "cli/util/path.rs", lang: "rust" },
    ],
  },
];
