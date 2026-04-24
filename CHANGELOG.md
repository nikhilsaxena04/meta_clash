# Changelog

All notable changes to the Meta Clash project (Go Backend & Next.js UI) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] - 2026-04-24

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

### Changed
- **Architecture**: Officially began migration from the previous Node.js/JS implementation to a strongly typed Go backend. Created `feature/go-backend-rewrite` branch.
- **Frontend Networking**: Removed Node.js socket server (`pages/api/socket.js`) and implemented a native WebSocket client (`lib/ws.js`) to connect the React UI directly to the Go server.

### Pending (Next Actions)
- **Phase 1: Database & Persistence (`internal/db`)**:
  - Implement PostgreSQL connection driver logic securely in the config pipeline.
  - Define persistence schemas (e.g. GORM/sqlx tags) and Repository patterns for User Accounts and Match Histories.
- **Phase 2: Authentication & REST API (`internal/api`)**:
  - Implement REST endpoints for Auth (`/login`, `/register`) to generate stateless JWT tokens.
  - Ensure the WebSocket upgrade handshake validates the JWT correctly.
- **Phase 3: Dynamic Card Generation**:
  - Implement concrete implementations of the `CardGenerator` utilizing outbound external requests to the Jikan API.
  - Add fallback logic to dynamically hash/generate deterministic characters upon API ratelimits.