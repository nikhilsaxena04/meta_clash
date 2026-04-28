# Graph Report - .  (2026-04-29)

## Corpus Check
- Corpus is ~17,236 words - fits in a single context window. You may not need a graph.

## Summary
- 253 nodes · 430 edges · 19 communities detected
- Extraction: 67% EXTRACTED · 33% INFERRED · 0% AMBIGUOUS · INFERRED: 143 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Game Engine & Lobby|Game Engine & Lobby]]
- [[_COMMUNITY_Game Bots|Game Bots]]
- [[_COMMUNITY_Card Generation|Card Generation]]
- [[_COMMUNITY_Middleware|Middleware]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Auth Testing|Auth Testing]]
- [[_COMMUNITY_JWT Middleware|JWT Middleware]]
- [[_COMMUNITY_Database Layer|Database Layer]]
- [[_COMMUNITY_Documentation|Documentation]]
- [[_COMMUNITY_Game Packs|Game Packs]]
- [[_COMMUNITY_Card Models|Card Models]]
- [[_COMMUNITY_Lobby Store|Lobby Store]]
- [[_COMMUNITY_WebSocket Client|WebSocket Client]]
- [[_COMMUNITY_User Models|User Models]]
- [[_COMMUNITY_Configuration|Configuration]]
- [[_COMMUNITY_Frontend Logic|Frontend Logic]]
- [[_COMMUNITY_Lobby Models|Lobby Models]]
- [[_COMMUNITY_Go Patterns|Go Patterns]]
- [[_COMMUNITY_Project Structure|Project Structure]]

## God Nodes (most connected - your core abstractions)
1. `main()` - 27 edges
2. `Handlers` - 9 edges
3. `NewAuthHandler()` - 9 edges
4. `CORS()` - 8 edges
5. `PlayerID` - 8 edges
6. `newMockRepo()` - 8 edges
7. `WSClient` - 7 edges
8. `MemoryStore` - 7 edges
9. `Manager` - 7 edges
10. `PostgresRepo` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Go Project Layout` --semantically_similar_to--> `Next.js Project Structure`  [INFERRED] [semantically similar]
  CLAUDE.md → meta_clash_readme.md
- `main()` --calls--> `NewPostgresRepo()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/db/queries.go
- `Implementation Plan` --references--> `Meta Clash`  [EXTRACTED]
  CLAUDE.md → meta_clash_readme.md
- `Frontend Design System` --conceptually_related_to--> `Web Tech Stack`  [INFERRED]
  CLAUDE.md → meta_clash_readme.md
- `main()` --calls--> `Logging()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/middleware/logging.go

## Hyperedges (group relationships)
- **Core Game Experience** — meta_clash_readme_meta_clash, meta_clash_readme_cards, meta_clash_readme_gameplay, meta_clash_readme_lobbies [EXTRACTED 0.95]
- **Real-time Multiplayer System** — meta_clash_readme_socket_io, meta_clash_readme_lobbies, meta_clash_readme_bots [INFERRED 0.80]
- **Go Backend Standards** — claude_go_backend, claude_concurrency, claude_error_handling, claude_project_map [EXTRACTED 0.90]

## Communities

### Community 0 - "Game Engine & Lobby"
Cohesion: 0.12
Nodes (6): ShuffleDeck(), NewEngine(), Engine, Manager, randomShortID(), WSClient

### Community 1 - "Game Bots"
Cohesion: 0.18
Nodes (7): NewMaxStatBot(), MaxStatBot, BotStrategy, Player, PlayerID, RoundResult, Handlers

### Community 2 - "Card Generation"
Cohesion: 0.14
Nodes (15): generateCardID(), generateDeterministicStats(), hashStat(), NewGenerator(), cacheEntry, Generator, jikanCharactersResponse, JikanClient (+7 more)

### Community 3 - "Middleware"
Cohesion: 0.16
Nodes (12): CORS(), getDb(), init(), Logging(), responseWriter, TestCORS_DisallowedOrigin(), TestCORS_Preflight(), TestCORS_SetsHeaders() (+4 more)

### Community 4 - "Authentication"
Cohesion: 0.22
Nodes (14): AuthHandler, authResponse, loginRequest, registerRequest, NewAuthHandler(), newMockRepo(), TestHandleLogin_Success(), TestHandleLogin_UserNotFound() (+6 more)

### Community 5 - "Auth Testing"
Cohesion: 0.14
Nodes (10): mockRepo, NewHandlers(), NewHub(), main(), writeJSON(), NewManager(), Connect(), Migrate() (+2 more)

### Community 6 - "JWT Middleware"
Cohesion: 0.18
Nodes (12): Claims, contextKey, GenerateToken(), TestGenerateAndValidateToken(), TestValidateToken_EmptyToken(), TestValidateToken_ExpiredToken(), TestValidateToken_MalformedToken(), TestValidateToken_WrongSecret() (+4 more)

### Community 7 - "Database Layer"
Cohesion: 0.22
Nodes (3): PostgresRepo, NewPostgresRepo(), nilIfEmpty()

### Community 8 - "Documentation"
Cohesion: 0.24
Nodes (10): Frontend Design System, Implementation Plan, Bot System, Card Stats (Rank/Strength/Speed/IQ), Themed Cards, Gameplay Loop, Multiplayer Lobbies, Meta Clash (+2 more)

### Community 9 - "Game Packs"
Cohesion: 0.33
Nodes (4): IsOnePieceTheme(), OnePiece(), IsPokemonTheme(), Pokemon()

### Community 10 - "Card Models"
Cohesion: 0.39
Nodes (7): AllAttributes(), Attribute, Card, CardGenerator, CardSource, Deck, Stats

### Community 11 - "Lobby Store"
Cohesion: 0.36
Nodes (3): MemoryStore, generateCode(), NewMemoryStore()

### Community 12 - "WebSocket Client"
Cohesion: 0.43
Nodes (4): ServeWs(), Client, SocketMessage, SocketResponse

### Community 13 - "User Models"
Cohesion: 0.43
Nodes (6): Match, MatchPlayer, MatchSummary, User, UserProfile, UserRepository

### Community 14 - "Configuration"
Cohesion: 0.62
Nodes (5): Config, envDuration(), envInt(), envStr(), Load()

### Community 15 - "Frontend Logic"
Cohesion: 0.6
Nodes (5): fetch(), fetchCharactersJikan(), generateCards(), generateId(), generatePlausibleStats()

### Community 16 - "Lobby Models"
Cohesion: 0.53
Nodes (4): Lobby, LobbyManager, LobbyState, LobbyStore

### Community 17 - "Go Patterns"
Cohesion: 0.67
Nodes (3): Channel-Based Concurrency, Error Wrapping Standard, Go 1.22+ Backend Standard

### Community 25 - "Project Structure"
Cohesion: 1.0
Nodes (2): Go Project Layout, Next.js Project Structure

## Knowledge Gaps
- **15 isolated node(s):** `cacheEntry`, `jikanSearchResponse`, `jikanCharactersResponse`, `contextKey`, `Claims` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Project Structure`** (2 nodes): `Go Project Layout`, `Next.js Project Structure`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `Auth Testing` to `Game Engine & Lobby`, `Game Bots`, `Card Generation`, `Middleware`, `Authentication`, `JWT Middleware`, `Database Layer`, `Lobby Store`, `WebSocket Client`, `Configuration`?**
  _High betweenness centrality (0.379) - this node is a cross-community bridge._
- **Why does `NewAuthHandler()` connect `Authentication` to `Auth Testing`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `extractClaims()` connect `JWT Middleware` to `Game Engine & Lobby`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `main()` (e.g. with `Load()` and `Connect()`) actually correct?**
  _`main()` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `NewAuthHandler()` (e.g. with `TestHandleRegister_Success()` and `TestHandleRegister_DuplicateUsername()`) actually correct?**
  _`NewAuthHandler()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `CORS()` (e.g. with `TestCORS_SetsHeaders()` and `TestCORS_Preflight()`) actually correct?**
  _`CORS()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PlayerID` (e.g. with `.AddBot()` and `.StartGame()`) actually correct?**
  _`PlayerID` has 6 INFERRED edges - model-reasoned connections that need verification._