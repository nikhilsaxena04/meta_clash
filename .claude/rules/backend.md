---
paths:
  - "internal/**/*.go"
  - "cmd/**/*.go"
---
# Go Backend Rules
## Architecture
- Follow hexagonal architecture. Handlers -> Services -> Repositories.
- Inject dependencies via constructors.

## Testing
- Write table-driven tests for core logic.
- Use `testcontainers` for database integration tests.