# Meta Clash ⚔️

A real-time, multiplayer anime card battling game with deterministic stat generation, live WebSocket lobbies, and a server-authoritative game engine. Built with a **Go** backend and a **Next.js / React** frontend.

---

## 🏗 Architecture

```
meta_clash/
├── backend/                        # Go 1.26+ — authoritative game server
│   ├── cmd/server/main.go          # HTTP server entrypoint, route wiring, graceful shutdown
│   └── internal/
│       ├── auth/                   # JWT lifecycle, register/login handlers, auth middleware
│       ├── config/                 # 12-factor env config (zero external deps)
│       ├── db/                     # PostgreSQL connection pool, auto-migrations, repository
│       ├── game/
│       │   ├── cards.go            # 3-tier card generator (packs → Jikan API → FNV-1a hash)
│       │   ├── engine.go           # Deal, ResolveRound, DetermineWinner
│       │   ├── bot.go              # MaxStatBot AI strategy (pluggable via BotStrategy interface)
│       │   ├── jikan_client.go     # Jikan REST client + Gemini LLM stat generation + LRU cache
│       │   └── packs/              # Curated starter decks (One Piece, Pokémon)
│       ├── lobby/                  # LobbyManager, in-memory LobbyStore, player matching
│       ├── middleware/             # Recovery, CORS, structured logging (slog)
│       ├── models/                 # Domain types: Card, Player, Lobby, User, Stats
│       └── ws/                     # WebSocket hub, client read/write pumps, action dispatcher
├── frontend/                       # Next.js 15 + React 18 + TailwindCSS
│   ├── components/                 # Card.js, PlayerSeat.js (Framer Motion animations)
│   ├── lib/                        # ws.js (WebSocket client), game.js (state helpers)
│   ├── pages/                      # index, game, login, register, profile
│   └── Dockerfile                  # 3-stage build (deps → builder → standalone runner)
├── docker-compose.yml              # Local orchestration: PostgreSQL + backend + frontend
├── render.yaml                     # Render.com IaC (backend, frontend, managed PostgreSQL)
└── .github/workflows/ci.yml        # CI: go vet, go test -race, Docker image builds
```

---

## ⚡ Key Features

### 🎲 Server-Authoritative Game Engine
- **3-State Lobby FSM**: `waiting` → `playing` → `finished` — all state transitions enforced server-side.
- **Deterministic Combat**: Round resolution compares a chosen attribute across all players' top cards. Winner advances; ties are handled.
- **Anti-Cheat**: All 4 attributes (Rank, Strength, Speed, IQ) and turn order are validated on the server. No client-side stat manipulation is possible.

### 🃏 3-Tier Card Generation Pipeline
1. **Curated Packs** — hand-crafted decks for One Piece and Pokémon themes.
2. **Jikan API** — fetches real anime characters with images; thread-safe in-memory cache (100-entry cap, 1-hour TTL).
3. **FNV-1a Deterministic Hashing** — guaranteed fallback producing stable stats from character name + attribute seed.
4. **Gemini LLM (Optional)** — lore-accurate power ratings via Gemini 2.5 Flash, with automatic fallback to deterministic hashing on failure.

### 📡 Real-Time Multiplayer
- **WebSocket Hub**: Central dispatch loop using Go channels and goroutines for concurrent client management.
- **Thread-Safe Broadcasting**: `sync.RWMutex`-guarded client map with non-blocking sends.
- **Ping/Pong Heartbeat**: 54-second ping cycle (derived from 60s pong deadline) for connection stability.
- **Asynchronous Bot Turns**: Bot AI runs in background goroutines with configurable delays for smooth frontend animations.

### 🔐 Auth & Persistence
- **JWT Authentication**: 24-hour stateless tokens securing REST routes and WebSocket handshakes (optional auth for guest mode).
- **PostgreSQL**: User accounts, match history, win/loss statistics. Auto-migrated on startup.
- **Repository Pattern**: `UserRepository` interface allowing DB implementation to be swapped.

### 🎨 Frontend
- **Glassmorphism UI**: Premium auth screens (login, register, profile) with TailwindCSS.
- **Framer Motion Animations**: Smooth card reveals, hand fanning, and state transitions.
- **Responsive Design**: Strict Boundary scaling architecture preventing card attribute clipping across all viewports.

---

## 🛠 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Go | 1.22+ |
| Node.js | 18+ |
| PostgreSQL | 16+ |
| Docker (optional) | 20+ |

### Environment Variables

Create a `.env` file in the `backend/` directory:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:postgres@localhost:5432/meta_clash?sslmode=disable` |
| `JWT_SECRET` | Secret key for signing auth tokens | `dev-secret-change-in-production` |
| `JWT_EXPIRY` | Token expiration duration | `24h` |
| `ALLOWED_ORIGIN` | CORS allowed origin | `http://localhost:3000` |
| `JIKAN_BASE_URL` | Jikan API base URL | `https://api.jikan.moe/v4` |
| `JIKAN_TIMEOUT` | Jikan API request timeout | `3s` |
| `GEMINI_API_KEY` | Google Gemini API key (optional, enables LLM card stats) | *(empty)* |

---

### Option 1: Run Locally (Manual)

**1. Start PostgreSQL** (if not already running):
```bash
docker run -d --name meta_clash_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=meta_clash \
  -p 5432:5432 postgres:16-alpine
```

**2. Start the Go Backend:**
```bash
cd backend
go run ./cmd/server
# Or with hot-reloading:
# air
```

**3. Start the Next.js Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will be at `http://localhost:3000` and the backend API at `http://localhost:8080`.

### Option 2: Docker Compose

```bash
docker compose up --build
```

This starts all three services (PostgreSQL, backend, frontend) with health checks and dependency ordering.

### Option 3: Deploy to Render.com

The project includes a `render.yaml` Blueprint that provisions:
- Go backend web service (Docker)
- Next.js frontend web service (Docker)
- Managed PostgreSQL database

Connect the repo to Render and it auto-deploys from the Blueprint.

---

## 📡 API Reference

### REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Create a new user account |
| `POST` | `/api/auth/login` | — | Authenticate and receive JWT |
| `GET` | `/api/users/{id}` | — | Fetch user profile, win/loss stats, match history |
| `GET` | `/api/ws` | Optional JWT | Upgrade to WebSocket connection |
| `GET` | `/healthz` | — | Health check |
| `GET` | `/readyz` | — | Readiness check |

### WebSocket Actions

| Action | Direction | Description |
|--------|-----------|-------------|
| `createLobby` | Client → Server | Create a new game lobby with a theme |
| `joinLobby` | Client → Server | Join an existing lobby by code |
| `addBot` | Client → Server | Add a bot player to the lobby |
| `startGame` | Client → Server | Start the game (deals cards, transitions to `playing`) |
| `chooseAttribute` | Client → Server | Pick an attribute for the current round |
| `lobbyUpdate` | Server → Client | Broadcast updated lobby state |
| `gameStarted` | Server → Client | Broadcast that the game has begun |
| `roundResult` | Server → Client | Broadcast round outcome with reveals and winner |

---

## 🧪 Testing

```bash
cd backend
go test -v -race ./...
go vet ./...
```

The CI pipeline (`.github/workflows/ci.yml`) runs these checks automatically on push/PR to `main`, followed by Docker image build verification.

---

## 📄 License

This project is for educational and portfolio purposes.