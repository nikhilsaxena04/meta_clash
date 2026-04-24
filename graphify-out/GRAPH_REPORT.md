# Graph Report - .  (2026-04-24)

## Corpus Check
- Corpus is ~10,202 words - fits in a single context window. You may not need a graph.

## Summary
- 134 nodes · 199 edges · 11 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Game Bot & Card Attributes|Game Bot & Card Attributes]]
- [[_COMMUNITY_Lobby Management & Round flow|Lobby Management & Round flow]]
- [[_COMMUNITY_Card Generation & API|Card Generation & API]]
- [[_COMMUNITY_WebSockets & Server Core|WebSockets & Server Core]]
- [[_COMMUNITY_Game Engine & Match State|Game Engine & Match State]]
- [[_COMMUNITY_User Match Profiles|User Match Profiles]]
- [[_COMMUNITY_WebSocket Client Handler|WebSocket Client Handler]]
- [[_COMMUNITY_Configuration|Configuration]]
- [[_COMMUNITY_Legacy Game Scripts|Legacy Game Scripts]]
- [[_COMMUNITY_Lobby Models|Lobby Models]]
- [[_COMMUNITY_DB Initialization|DB Initialization]]

## God Nodes (most connected - your core abstractions)
1. `main()` - 14 edges
2. `Handlers` - 8 edges
3. `Manager` - 7 edges
4. `PlayerID` - 7 edges
5. `WSClient` - 7 edges
6. `MemoryStore` - 6 edges
7. `Load()` - 5 edges
8. `Generator` - 5 edges
9. `Engine` - 4 edges
10. `generateDeterministicStats()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `NewManager()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/lobby/manager.go
- `main()` --calls--> `NewEngine()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/game/engine.go
- `main()` --calls--> `NewGenerator()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/game/cards.go
- `main()` --calls--> `NewMemoryStore()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/lobby/store.go
- `main()` --calls--> `PlayerID`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/cmd/server/main.go → /home/nikhil/Documents/Coding/antigravity/meta_clash/backend/internal/models/player.go

## Communities

### Community 0 - "Game Bot & Card Attributes"
Cohesion: 0.11
Nodes (9): AllAttributes(), MaxStatBot, Attribute, Card, CardGenerator, CardSource, Deck, Stats (+1 more)

### Community 1 - "Lobby Management & Round flow"
Cohesion: 0.21
Nodes (6): ShuffleDeck(), Manager, NewManager(), randomShortID(), PlayerID, Handlers

### Community 2 - "Card Generation & API"
Cohesion: 0.18
Nodes (11): generateCardID(), generateDeterministicStats(), hashStat(), NewGenerator(), Generator, jikanCharactersResponse, jikanSearchResponse, IsOnePieceTheme() (+3 more)

### Community 3 - "WebSockets & Server Core"
Cohesion: 0.15
Nodes (7): NewHandlers(), NewHub(), MemoryStore, main(), generateCode(), NewMemoryStore(), Hub

### Community 4 - "Game Engine & Match State"
Cohesion: 0.2
Nodes (5): NewEngine(), Engine, BotStrategy, Player, RoundResult

### Community 5 - "User Match Profiles"
Cohesion: 0.29
Nodes (6): Match, MatchPlayer, MatchSummary, User, UserProfile, UserRepository

### Community 6 - "WebSocket Client Handler"
Cohesion: 0.38
Nodes (4): ServeWs(), Client, SocketMessage, SocketResponse

### Community 7 - "Configuration"
Cohesion: 0.53
Nodes (5): Config, envDuration(), envInt(), envStr(), Load()

### Community 8 - "Legacy Game Scripts"
Cohesion: 0.6
Nodes (5): fetch(), fetchCharactersJikan(), generateCards(), generateId(), generatePlausibleStats()

### Community 9 - "Lobby Models"
Cohesion: 0.4
Nodes (4): Lobby, LobbyManager, LobbyState, LobbyStore

### Community 10 - "DB Initialization"
Cohesion: 1.0
Nodes (2): getDb(), init()

## Knowledge Gaps
- **21 isolated node(s):** `LobbyState`, `Lobby`, `LobbyStore`, `LobbyManager`, `User` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `DB Initialization`** (3 nodes): `getDb()`, `init()`, `db.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `WebSockets & Server Core` to `Game Bot & Card Attributes`, `Lobby Management & Round flow`, `Card Generation & API`, `Game Engine & Match State`, `WebSocket Client Handler`, `Configuration`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **Why does `PlayerID` connect `Lobby Management & Round flow` to `WebSockets & Server Core`, `Game Engine & Match State`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `Load()` connect `Configuration` to `WebSockets & Server Core`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `main()` (e.g. with `Load()` and `NewGenerator()`) actually correct?**
  _`main()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `PlayerID` (e.g. with `.AddBot()` and `.StartGame()`) actually correct?**
  _`PlayerID` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `LobbyState`, `Lobby`, `LobbyStore` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Game Bot & Card Attributes` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._