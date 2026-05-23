# Graph Report - meta_clash  (2026-05-23)

## Corpus Check
- 53 files · ~200,880 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 302 nodes · 541 edges · 20 communities detected
- Extraction: 56% EXTRACTED · 44% INFERRED · 0% AMBIGUOUS · INFERRED: 237 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 26|Community 26]]

## God Nodes (most connected - your core abstractions)
1. `main()` - 27 edges
2. `NewEngine()` - 20 edges
3. `BenchmarkLobbyLifecycle()` - 12 edges
4. `NewMemoryStore()` - 11 edges
5. `NewManager()` - 10 edges
6. `TestManager_PlayRound_MatchHistory()` - 9 edges
7. `Handlers` - 9 edges
8. `NewAuthHandler()` - 9 edges
9. `CORS()` - 8 edges
10. `BenchmarkFullGame()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Project Structure` --semantically_similar_to--> `Go Project Layout`  [INFERRED] [semantically similar]
  meta_clash_readme.md → CLAUDE.md
- `Game()` --calls--> `min()`  [INFERRED]
  frontend/pages/game.js → backend/internal/game/jikan_client.go
- `NewPostgresRepo()` --calls--> `main()`  [INFERRED]
  backend/internal/db/queries.go → backend/cmd/server/main.go
- `Meta Clash` --references--> `Implementation Plan`  [EXTRACTED]
  meta_clash_readme.md → CLAUDE.md
- `Web Tech Stack` --conceptually_related_to--> `Frontend Design System`  [INFERRED]
  meta_clash_readme.md → CLAUDE.md

## Hyperedges (group relationships)
- **Core Game Experience** — meta_clash_readme_meta_clash, meta_clash_readme_cards, meta_clash_readme_gameplay, meta_clash_readme_lobbies [EXTRACTED 0.95]
- **Real-time Multiplayer System** — meta_clash_readme_socket_io, meta_clash_readme_lobbies, meta_clash_readme_bots [INFERRED 0.80]
- **Go Backend Standards** — claude_go_backend, claude_concurrency, claude_error_handling, claude_project_map [EXTRACTED 0.90]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (17): contextKey, CORS(), getDb(), init(), Logging(), extractClaims(), OptionalAuth(), RequireAuth() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (26): BenchmarkGenerateCardID(), BenchmarkGenerateDeck(), BenchmarkGenerateDeterministicStats(), BenchmarkHashStat(), BenchmarkShuffleDeck(), generateCardID(), generateDeterministicStats(), hashStat() (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (17): NewGenerator(), Manager, MemoryStore, mockGenerator, BenchmarkConcurrentLobbies(), BenchmarkCreateLobby(), BenchmarkLobbyLifecycle(), BenchmarkMemoryStoreGet() (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (16): NewMaxStatBot(), AllAttributes(), BenchmarkDeal(), BenchmarkDetermineWinner(), BenchmarkFullGame(), BenchmarkResolveRound(), setupLobby(), NewEngine() (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (14): mockRepo, Config, envDuration(), envInt(), envStr(), Load(), NewHandlers(), NewHub() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (9): ServeWs(), BotStrategy, Player, PlayerID, RoundResult, Client, Handlers, SocketMessage (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.24
Nodes (14): AuthHandler, authResponse, loginRequest, registerRequest, NewAuthHandler(), newMockRepo(), TestHandleLogin_Success(), TestHandleLogin_UserNotFound() (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.27
Nodes (10): Claims, BenchmarkGenerateToken(), BenchmarkValidateToken(), GenerateToken(), TestGenerateAndValidateToken(), TestValidateToken_EmptyToken(), TestValidateToken_ExpiredToken(), TestValidateToken_MalformedToken() (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (3): PostgresRepo, NewPostgresRepo(), nilIfEmpty()

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (10): Frontend Design System, Implementation Plan, Bot System, Card Stats (Rank/Strength/Speed/IQ), Themed Cards, Gameplay Loop, Multiplayer Lobbies, Meta Clash (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (1): mockUserRepo

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (6): Match, MatchPlayer, MatchSummary, User, UserProfile, UserRepository

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): Attribute, Card, CardGenerator, CardSource, Deck, Stats

### Community 13 - "Community 13"
Cohesion: 0.38
Nodes (4): IsOnePieceTheme(), OnePiece(), IsPokemonTheme(), Pokemon()

### Community 14 - "Community 14"
Cohesion: 0.48
Nodes (5): benchBroadcast(), BenchmarkHubBroadcast_10(), BenchmarkHubBroadcast_100(), BenchmarkHubBroadcast_1000(), mockClient()

### Community 15 - "Community 15"
Cohesion: 0.6
Nodes (5): fetch(), fetchCharactersJikan(), generateCards(), generateId(), generatePlausibleStats()

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (4): Lobby, LobbyManager, LobbyState, LobbyStore

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (2): getSeatStyles(), PlayerSeat()

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (3): Channel-Based Concurrency, Error Wrapping Standard, Go 1.22+ Backend Standard

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (2): Go Project Layout, Next.js Project Structure

## Knowledge Gaps
- **38 isolated node(s):** `LobbyState`, `Lobby`, `LobbyStore`, `LobbyManager`, `User` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 10`** (7 nodes): `mockUserRepo`, `.CreateUser()`, `.GetByID()`, `.GetByUsername()`, `.GetMatchHistory()`, `.GetWinLoss()`, `.SaveMatch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `PlayerSeat.js`, `getSeatStyles()`, `PlayerSeat()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `Go Project Layout`, `Next.js Project Structure`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `Community 4` to `Community 0`, `Community 2`, `Community 3`, `Community 5`, `Community 6`, `Community 8`?**
  _High betweenness centrality (0.342) - this node is a cross-community bridge._
- **Why does `NewEngine()` connect `Community 3` to `Community 2`, `Community 4`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `NewJikanClient()` connect `Community 1` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `main()` (e.g. with `Load()` and `Connect()`) actually correct?**
  _`main()` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 19 inferred relationships involving `NewEngine()` (e.g. with `TestManager_CreateLobby()` and `TestManager_JoinLobby()`) actually correct?**
  _`NewEngine()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `BenchmarkLobbyLifecycle()` (e.g. with `NewGenerator()` and `NewEngine()`) actually correct?**
  _`BenchmarkLobbyLifecycle()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `NewMemoryStore()` (e.g. with `TestManager_CreateLobby()` and `TestManager_JoinLobby()`) actually correct?**
  _`NewMemoryStore()` has 10 INFERRED edges - model-reasoned connections that need verification._