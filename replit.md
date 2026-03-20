# School of Visions — Ministry Website

## Overview

A full-stack Christian ministry website for "School of Visions" by Sibusiso Mathebula.
Built with React + Vite frontend and Express API backend with PostgreSQL.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/ministry-site)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Auth**: Replit Auth (OpenID Connect / PKCE) — lib/replit-auth-web
- **API codegen**: Orval (from OpenAPI spec)
- **Routing (frontend)**: Wouter
- **UI**: Shadcn/UI + Tailwind CSS
- **Streaming**: WebRTC via WebSocket signaling (ws package)

## Features

### Public Pages
- **Home**: Editable hero (tag, headline, subtitle), latest blog posts, livestream banner
- **Blog**: Published blog posts with comments
- **Blog Post**: Full content with visitor comment section
- **About**: Minister bio (Sibusiso Mathebula), photo, title — all editable from admin
- **Contact**: Gmail button only (email stored privately, set by admin)
- **Videos**: YouTube video embeds grid
- **Livestream**: YouTube embed OR live WebRTC device stream from admin's camera

### Admin Panel (`/admin`) — protected by Replit Auth
- **Edit Pages**: Tabs for Home, About, Contact page content editing
  - Home: hero tag, headline, subtitle
  - About: name, title, bio, profile photo upload
  - Contact: Gmail address (private, visible only to admin)
- **Posts**: Write, upload photo, edit, publish/draft, delete blog posts
- **Videos**: Add/delete YouTube video entries
- **Livestream**: YouTube stream mode OR device camera stream (WebRTC)
- **Messages**: View contact form submissions
- **Comments**: Approve/delete visitor comments

### Livestream (WebRTC)
- Admin streams from laptop/device camera via WebRTC
- WebSocket signaling server runs alongside Express on the same port
- Viewers receive stream automatically on the Livestream public page
- Falls back to YouTube embed if configured

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server + WebSocket signaling
│   │   └── public/uploads/ # Uploaded photos stored here
│   └── ministry-site/      # React + Vite frontend
│       └── src/hooks/useSettings.ts  # Site settings hook
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── replit-auth-web/    # Replit Auth browser hook (useAuth)
└── scripts/                # Utility scripts
```

## Database Schema

- `users` — auth users (managed by Replit Auth)
- `sessions` — auth sessions
- `posts` — blog posts (title, slug, content, excerpt, imageUrl, published, authorId)
- `videos` — YouTube video entries
- `comments` — visitor comments on posts (require approval)
- `contact_messages` — contact form submissions
- `livestream` — single row config for livestream status
- `site_settings` — key-value page content (about bio, home hero, contact email, etc.)

## API Routes

All routes mounted at `/api`:
- `GET /healthz` — health check
- `GET /auth/user`, `GET /login`, `GET /callback`, `GET /logout` — auth
- `GET/POST /posts` — list published posts / create
- `GET /posts/all` — all posts including drafts (admin)
- `GET/PUT/DELETE /posts/:id` — get/update/delete post
- `GET/POST /videos` — list/create videos
- `DELETE /videos/:id` — delete video (admin)
- `GET/POST /comments` — list approved / submit comment
- `GET /comments/all`, `PUT /comments/:id/approve`, `DELETE /comments/:id` — admin
- `POST /contact`, `GET /contact` — submit/list contact messages
- `GET/PUT /livestream` — get/update livestream config
- `GET/PUT /settings` — get/update site settings (PUT requires auth)
- `POST /uploads/image` — upload photo (auth required, returns URL)
- `GET /uploads/:filename` — serve uploaded photos (static)

## WebSocket (`/ws/stream`)
WebRTC signaling for device livestreaming:
- Host joins with `{type:"join", role:"host"}`
- Viewer joins with `{type:"join", role:"viewer"}`
- Relay: offer → viewers, answer → host, ICE candidates bidirectional

## Running

- API server: `pnpm --filter @workspace/api-server run dev`
- Frontend: `pnpm --filter @workspace/ministry-site run dev`
- Push DB schema: `pnpm --filter @workspace/db run push`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
