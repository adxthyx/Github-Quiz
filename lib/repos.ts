import type { RepoMeta } from "@/lib/types";

/**
 * A repo in the question pool. Extends the client-safe {@link RepoMeta} with
 * server-only fields: candidate file paths, the branch to read them from, the
 * Shiki language id, and "tells" — brand strings that get redacted out of the
 * snippet so the answer isn't given away.
 *
 * To add a repo: append an entry here with a couple of candidate `paths` that
 * exist on the given `branch`. The builder is resilient — a path that 404s is
 * skipped and the next one is tried.
 */
export interface RepoSeed extends RepoMeta {
  branch: string;
  lang: string;
  paths: string[];
  tells: string[];
}

export const POOL: RepoSeed[] = [
  {
    id: "facebook/react",
    fullName: "facebook/react",
    description: "The library for web and native user interfaces.",
    url: "https://github.com/facebook/react",
    branch: "main",
    lang: "js",
    paths: [
      "packages/react/src/ReactHooks.js",
      "packages/react-reconciler/src/ReactFiberHooks.js",
    ],
    tells: ["react", "facebook", "jsx", "fiber"],
  },
  {
    id: "vuejs/core",
    fullName: "vuejs/core",
    description: "The progressive JavaScript framework.",
    url: "https://github.com/vuejs/core",
    branch: "main",
    lang: "ts",
    paths: [
      "packages/reactivity/src/ref.ts",
      "packages/runtime-core/src/apiWatch.ts",
    ],
    tells: ["vue", "vuejs"],
  },
  {
    id: "sveltejs/svelte",
    fullName: "sveltejs/svelte",
    description: "Cybernetically enhanced web apps.",
    url: "https://github.com/sveltejs/svelte",
    branch: "main",
    lang: "js",
    paths: [
      "packages/svelte/src/internal/client/runtime.js",
      "packages/svelte/src/store/shared/index.js",
    ],
    tells: ["svelte"],
  },
  {
    id: "django/django",
    fullName: "django/django",
    description: "The web framework for perfectionists with deadlines.",
    url: "https://github.com/django/django",
    branch: "main",
    lang: "python",
    paths: [
      "django/core/handlers/base.py",
      "django/http/request.py",
    ],
    tells: ["django"],
  },
  {
    id: "pallets/flask",
    fullName: "pallets/flask",
    description: "A lightweight WSGI web application framework in Python.",
    url: "https://github.com/pallets/flask",
    branch: "main",
    lang: "python",
    paths: ["src/flask/app.py"],
    tells: ["flask", "pallets", "werkzeug"],
  },
  {
    id: "rails/rails",
    fullName: "rails/rails",
    description: "Ruby on Rails: web-application framework.",
    url: "https://github.com/rails/rails",
    branch: "main",
    lang: "ruby",
    paths: [
      "activerecord/lib/active_record/base.rb",
      "actionpack/lib/action_controller/base.rb",
    ],
    tells: ["rails", "activerecord", "actioncontroller", "actionpack"],
  },
  {
    id: "golang/go",
    fullName: "golang/go",
    description: "The Go programming language.",
    url: "https://github.com/golang/go",
    branch: "master",
    lang: "go",
    paths: ["src/net/http/server.go"],
    tells: ["golang"],
  },
  {
    id: "torvalds/linux",
    fullName: "torvalds/linux",
    description: "Linux kernel source tree.",
    url: "https://github.com/torvalds/linux",
    branch: "master",
    lang: "c",
    paths: ["kernel/sched/core.c"],
    tells: ["torvalds", "linux"],
  },
  {
    id: "redis/redis",
    fullName: "redis/redis",
    description: "An in-memory database that persists on disk.",
    url: "https://github.com/redis/redis",
    branch: "unstable",
    lang: "c",
    paths: ["src/server.c"],
    tells: ["redis"],
  },
  {
    id: "microsoft/vscode",
    fullName: "microsoft/vscode",
    description: "Visual Studio Code.",
    url: "https://github.com/microsoft/vscode",
    branch: "main",
    lang: "ts",
    paths: ["src/vs/base/common/event.ts"],
    tells: ["vscode", "microsoft"],
  },
  {
    id: "tailwindlabs/tailwindcss",
    fullName: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development.",
    url: "https://github.com/tailwindlabs/tailwindcss",
    branch: "main",
    lang: "ts",
    paths: ["packages/tailwindcss/src/index.ts"],
    tells: ["tailwind", "tailwindlabs", "tailwindcss"],
  },
  {
    id: "fastapi/fastapi",
    fullName: "fastapi/fastapi",
    description: "Modern, fast web framework for building APIs with Python.",
    url: "https://github.com/fastapi/fastapi",
    branch: "master",
    lang: "python",
    paths: ["fastapi/applications.py"],
    tells: ["fastapi", "tiangolo"],
  },
  {
    id: "expressjs/express",
    fullName: "expressjs/express",
    description: "Fast, unopinionated, minimalist web framework for Node.js.",
    url: "https://github.com/expressjs/express",
    branch: "master",
    lang: "js",
    paths: ["lib/application.js"],
    tells: ["express", "expressjs"],
  },
  {
    id: "nodejs/node",
    fullName: "nodejs/node",
    description: "Node.js JavaScript runtime.",
    url: "https://github.com/nodejs/node",
    branch: "main",
    lang: "js",
    paths: ["lib/net.js"],
    tells: ["nodejs"],
  },
  {
    id: "tiangolo/typer",
    fullName: "fastapi/typer",
    description: "Typer, build great CLIs. Easy to code. Based on Python type hints.",
    url: "https://github.com/fastapi/typer",
    branch: "master",
    lang: "python",
    paths: ["typer/main.py"],
    tells: ["typer", "tiangolo"],
  },
];
