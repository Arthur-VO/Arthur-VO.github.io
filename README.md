# Arthur-VO.github.io

Personal website built with Astro, Tailwind CSS, and React islands.

## Stack

- Astro 5
- Tailwind CSS 4 (via Vite plugin)
- React 19 for interactive components
- TypeScript

## Local development

Install dependencies and start the dev server:

```sh
pnpm install
pnpm dev
```

App runs at `http://localhost:4321` by default.

## Available scripts

| Command | Description |
| :-- | :-- |
| `pnpm dev` | Start local development server |
| `pnpm start` | Alias for `pnpm dev` |
| `pnpm build` | Run `astro check` and build production output |
| `pnpm preview` | Preview built site locally |
| `pnpm astro -- --help` | Show Astro CLI help |
| `pnpm new` | Scaffold a new content file in `src/content` |

## Content model

Content is managed with Astro content collections in `src/content`:

- `blog/` — blog posts
- `projects/` — project pages
- `signal/` — signal/newsletter archive entries

### Drafts

Entries can use frontmatter `draft: true` to hide them from generated pages/routes.

## New content workflow

Use the interactive scaffold script:

```sh
pnpm new
```

You can create:

1. Project entry (`src/content/projects`)
2. Blog post (`src/content/blog`)
3. Signal entry (`src/content/signal`)

## Project structure

```text
.
├── public/
├── scripts/
│   └── new.mjs
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── stores/
│   └── styles/
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Deployment (GitHub Pages)

Deployment is handled by GitHub Actions: `.github/workflows/deploy.yml`.

### One-time repository setup

1. Open GitHub repository settings.
2. Go to **Pages**.
3. Set **Source** to **GitHub Actions**.

### Deploy flow

- Push changes to `main`.
- Workflow runs `pnpm build`.
- Output from `dist/` is published to GitHub Pages.

## Verify production build locally

```sh
pnpm build
pnpm preview
```
