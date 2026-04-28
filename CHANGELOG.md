# Changelog

All notable changes to the Meta Clash project (Go Backend & Next.js UI) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] - 2026-04-29

### Fixed
- **WebSockets (Hotfix)**: Restored the `http.Hijacker` interface inside the `Logging` middleware (`backend/internal/middleware/logging.go`) to allow the Next.js frontend to successfully upgrade HTTP connections to WebSockets without throwing a 500 error.
- **Match History (Hotfix)**: Injected `UserRepository` into `LobbyManager` (`backend/internal/lobby/manager.go`) and updated `PlayRound` to correctly build and persist `models.Match` and `models.MatchPlayer` records when a lobby reaches `LobbyStateFinished`, properly updating the user's Profile page.

### Added
- **Environment**: Upgraded system compiler to Go 1.26.
- **Environment**: Installed `air` (`github.com/air-verse/air`) for Go hot-reloading.
- **`backend/`**: Initialized Go module (`github.com/nikhilsaxena04/meta_clash/backend`).
- **AI Tooling**: Configured multi-agent workflow profiles in `.claude/` and `.agents/`, and added `.mcp.json` integration.
- **Code Visualization**: Integrated Graphify (`graphify-out/`) to map project architecture autonomously.
- **Documentation**: Established `README.md` and `CHANGELOG.md` to maintain AI context windows across sessions.
- **Models**: Created `internal/models/` (`card.go`, `lobby.go`, `player.go`, `user.go`) establishing domain boundaries and interfaces.
- **Config**: Implemented `internal/config/config.go` for environment variable loading.
- **Game & Networking**: Built `internal/game/` for deterministic combat and `internal/ws/` / `internal/lobby/` for real-time multiplayer via WebSockets.
- **Game Content**: Introduced starter base decks (`backend/internal/game/packs/onepiece.go` and `pokemon.go`).
- **Entrypoint**: Bootstrapped `cmd/server/main.go` for executing the backend server.
- **Database**: Added `internal/db/postgres.go` and `internal/db/queries.go` for PostgreSQL connection pooling, auto-migrations, and repository pattern implementation.
- **Auth**: Added `internal/auth/` containing JWT lifecycle management, register/login REST handlers, and authorization middleware.
- **Middleware**: Added `internal/middleware/` for structured HTTP logging (`slog`), panic recovery, and CORS configurations.

- **Dynamic Card Generation (Phase 3)**: Implemented Jikan API integration (`backend/internal/game/jikan_client.go`) with an in-memory LRU cache to prevent rate-limiting, and deterministic `hashbot` fallback logic for guaranteed stable stats.
- **DevOps & CI/CD (Phase 4)**: Created multi-stage Dockerfiles for Go and Next.js (standalone output). Added `docker-compose.yml` for unified local orchestration and a `.github/workflows/ci.yml` pipeline for automated tests and linting.

### Changed
- **Architecture**: Officially began migration from the previous Node.js/JS implementation to a strongly typed Go backend. Created `feature/go-backend-rewrite` branch.
- **Frontend Networking**: Removed Node.js socket server (`pages/api/socket.js`) and implemented a native WebSocket client (`lib/ws.js`) to connect the React UI directly to the Go server.
- **Server**: Updated `cmd/server/main.go` to wire PostgreSQL, Auth endpoints, and HTTP middleware together.
- **Frontend Migration (Phase 2)**: Moved all Next.js code to `frontend/`. Implemented premium glassmorphism Auth UI (`login.js`, `register.js`, `profile.js`). Updated `ws.js` and `index.js` to securely pass JWT tokens.

### Pending (Next Actions)
- **Project Complete!**: All 4 migration phases are finished. The system is fully production-ready.
- Future enhancements (Optional):
  - Migrate in-memory `LobbyStore` to Redis for horizontal scalability.
  - Add game sound effects and more robust animations to the React frontend.
  - Deploy to AWS/GCP using the provided Docker containers.