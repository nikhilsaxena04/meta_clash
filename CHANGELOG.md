lets # Changelog

All notable changes to the Meta Clash project (Go Backend & Next.js UI) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] - 2026-04-24

### Added
- **Environment**: Upgraded system compiler to Go 1.26.
- **Environment**: Installed `air` (`github.com/air-verse/air`) for Go hot-reloading.
- **`backend/`**: Initialized Go module (`github.com/nikhilsaxena04/meta_clash/backend`).
- **Documentation**: Established `README.md` and `CHANGELOG.md` to maintain AI context windows across sessions.

### Changed
- **Architecture**: Officially began migration from the previous Node.js/JS implementation to a strongly typed Go backend. Created `feature/go-backend-rewrite` branch.

### Pending (Next Actions)
- Define struct interfaces for `internal/models/` (Card, Player, Lobby, User) via Architect agent.
- Implement `internal/config/config.go` via Developer agent.