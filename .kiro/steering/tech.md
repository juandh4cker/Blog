# Tech Stack

## Frontend
- React 19 with TypeScript (strict mode)
- Vite 5 with SWC plugin for fast builds
- Tailwind CSS 4 for styling
- HeroUI (v2 beta) as the component library
- React Router DOM v6 for routing
- TanStack React Query v5 for server state management
- Axios for HTTP requests
- React Hook Form + Zod for form validation
- Framer Motion for animations
- react-icons for iconography
- react-helmet-async for SEO/meta tags
- clsx for conditional classnames
- qrcode for QR generation

## Backend
- Python 3.13 with Flask 2.2
- Flask-CORS for cross-origin support
- PyMongo for MongoDB driver
- PyJWT for JSON Web Token auth
- bcrypt for password hashing
- python-dotenv for environment config
- Sphinx with RTD theme for API documentation
- mypy for static type checking

## Database
- MongoDB 4.4

## Infrastructure
- Docker Compose with three services: frontend, backend, mongodb
- Frontend runs on port 5173, backend on port 5000, MongoDB on 27017

## Common Commands

### Frontend (run from `frontend/`)
- `npm run dev` — Start dev server on port 5173
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Auto-fix lint issues
- `npm run format` — Format code with Prettier
- `npm run preview` — Preview production build

### Backend (run from `backend/`)
- `flask run --host=0.0.0.0` — Start Flask dev server (requires FLASK_APP=api.py)
- `pip install -r requirements.txt` — Install dependencies

### Docker
- `docker-compose up` — Start all services
- `docker-compose up --build` — Rebuild and start

## Code Style

### Frontend
- Prettier: single quotes, semicolons, trailing commas, 2-space indent, 100 char print width
- ESLint: recommended rules + react, react-hooks, jsx-a11y, prettier integration
- Path alias: `@/` maps to `frontend/src/`

### Backend
- Type hints on all function signatures
- Docstrings (Google style) on all public methods
- Custom exception hierarchy with auto-logging
- Static methods on service classes (no instance state)
