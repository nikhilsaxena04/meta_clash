# meta_clash Operating Manual

## Project Map (Token Saver)
- `cmd/server/`: Main application entry points
- `internal/api/`: REST/gRPC handlers and routes
- `internal/core/`: Domain logic and interfaces
- `pkg/`: Public shared libraries
- `ui/`: Frontend assets and design system

## Global Standards
- Language: Go 1.22+. Use standard library over external dependencies where possible.
- Concurrency: Prefer channels for state synchronization; use mutexes only when strictly necessary.
- Error Handling: Wrap errors with context (`fmt.Errorf("failed to do X: %w", err)`). No silent failures.
- Frontend: Enforce strict adherence to the defined design system.

## Active Mission
- Architecture: `implementation_plan.md.resolved`
- Status: `task.md.resolved`
- Do not deviate from the implementation plan without explicit permission.