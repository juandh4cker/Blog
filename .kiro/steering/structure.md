# Project Structure

```
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── api/                # Axios API client functions, one file per domain (auth, posts, users, comments)
│   │   ├── assets/             # Static assets (background images, SVG icons)
│   │   ├── components/
│   │   │   ├── ui/             # Reusable presentational components (Button, Input, Modal, etc.)
│   │   │   ├── compound/       # Domain-specific composed components (Posts, Comments, UserCard, Share)
│   │   │   ├── globals/        # App-wide components (Menu, Background)
│   │   │   └── layout/         # Layout wrappers
│   │   ├── context/            # React Context providers (Auth, Config, Query, Title, UI)
│   │   ├── hooks/              # Custom hooks (useApi, useAuth, useNav, useToast, etc.)
│   │   ├── pages/              # Route-level page components (Blog, Dashboard, Post, User, Welcome)
│   │   ├── routes/             # Route definitions (AppRoutes)
│   │   ├── schema/             # Zod validation schemas (post, register)
│   │   ├── utils/              # Utility functions (timeSince, compactNumber, ratingStars, QR, maps)
│   │   ├── App.tsx             # Root component with Router and AppContext
│   │   └── main.tsx            # Entry point, renders App into #root
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                    # Flask REST API
│   ├── api.py                  # Flask routes and HTTP layer (request/response handling)
│   ├── app.py                  # Business logic layer (App class with static methods)
│   ├── modules/
│   │   ├── database.py         # MongoDB data access layer (DB class)
│   │   ├── users.py            # User/Users domain models
│   │   ├── posts.py            # Post/Posts/Comment domain models
│   │   └── utils/
│   │       ├── exceptions.py   # Custom exception hierarchy (CustomException base + subclasses)
│   │       ├── generals.py     # Shared helpers (password hashing, validation, date utils)
│   │       ├── log.py          # Logging configuration (Log class)
│   │       └── token.py        # JWT encode/decode/validate (Token class)
│   ├── docs/                   # Sphinx documentation source
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml          # Orchestrates frontend, backend, and mongodb services
└── package.json                # Root-level shared dev dependencies (ESLint, Prettier, TypeScript)
```

## Architecture Patterns

### Frontend
- Barrel exports: each major folder (api, components, hooks, pages, utils) has an `index.js` re-exporting all public members
- Context composition: `AppContext` nests all providers using `reduceRight` pattern
- Centralized API hook: `useApi` wraps all API calls with TanStack Query mutations/queries, auth checks, and toast error handling
- API layer: thin `apiRequest` wrapper around Axios; domain files (auth.js, posts.js, etc.) call it with endpoint + method
- Components are `.jsx`; utilities and type-heavy files are `.ts`/`.tsx`

### Backend
- Three-layer architecture: `api.py` (HTTP) → `app.py` (business logic) → `modules/database.py` (data access)
- All business logic lives in the `App` class as `@staticmethod` methods
- All database operations live in the `DB` class as `@classmethod` methods
- Domain models (`User`, `Post`, `Comment`) live in `modules/users.py` and `modules/posts.py`
- Custom exception classes auto-log on instantiation via the `Log` utility
- JWT auth is handled via a `verify_token` decorator on protected Flask routes
- Tokens are stored in httpOnly secure cookies, refreshed on each authenticated request
