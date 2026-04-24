# Meta Clash ⚔️ - Engine & API

A real-time card battling game featuring deterministic stat generation, live multiplayer lobbies, and an authoritative game engine. This project is split into a high-performance Go backend and a Next.js React frontend.

---

## 🏗 Project Structure

This project follows a decoupled architecture:

- **`backend/`**: Authoritative game engine and REST/WebSocket server (Go 1.26+).
  - `cmd/server/`: Main application entry point.
  - `internal/models/`: Core domain structures (Card, Player, Lobby, User).
  - `internal/game/`: Core game loop, combat resolution, and state management.
  - `internal/ws/`: WebSocket hub and concurrent client messaging.
  - `internal/lobby/`: Real-time session and player matching.
  - `internal/config/`: Environment and configuration loading.
- **`frontend/`**: The client-side UI (Next.js, React, TailwindCSS).
  - Handles rendering, local state prediction, and WebSocket communication.

---

## 🚀 Key Features

### 🎲 Deterministic Engine
- **Hash-Based Stats**: Card stats (HP, Attack, Defense) are deterministically generated on the server using a base seed + card ID hash, preventing client-side spoofing.
- **Authoritative State**: The Go backend holds the absolute source of truth for all lobby states and combat phases.

### ⚡ Real-Time Multiplayer
- **WebSocket Hub**: Concurrent lobby management using Go channels and goroutines for safe state synchronization.
- **Phase-Based Combat**: Structured turn logic (Draw, Plan, Action, Resolution) strictly enforced by the server.

### 🔐 Security & Data
- **JWT Authentication**: 24-hour stateless tokens securing REST routes and initial WebSocket handshakes.
- **PostgreSQL**: Persistent storage for user accounts, inventories, and historical match data.

---

## 🛠 Getting Started

### Prerequisites
- Go 1.26 or higher
- Node.js 18+ (for frontend)
- PostgreSQL
- `air` (for Go live reloading)

### Environment Variables
Create a `.env` file in the `backend/` directory:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8080) |
| `DB_DSN` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing auth tokens |
| `WS_ORIGIN` | Allowed origin for WebSockets (e.g., http://localhost:3000) |

### Running Locally

You must run the backend and frontend simultaneously.

**1. Start the Go Backend:**
```bash
cd backend
air