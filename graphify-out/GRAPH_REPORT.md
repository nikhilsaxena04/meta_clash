# Graph Report - .  (2026-04-24)

## Corpus Check
- Corpus is ~4,208 words - fits in a single context window. You may not need a graph.

## Summary
- 49 nodes · 47 edges · 10 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Game Design|Core Game Design]]
- [[_COMMUNITY_Card Generation Engine|Card Generation Engine]]
- [[_COMMUNITY_Socket.io Server|Socket.io Server]]
- [[_COMMUNITY_Database Layer|Database Layer]]
- [[_COMMUNITY_Game Page UI|Game Page UI]]
- [[_COMMUNITY_App Shell|App Shell]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Card Component|Card Component]]
- [[_COMMUNITY_Go Backend Standards|Go Backend Standards]]
- [[_COMMUNITY_Project Structure|Project Structure]]

## God Nodes (most connected - your core abstractions)
1. `Meta Clash` - 6 edges
2. `generateCards()` - 5 edges
3. `fetchCharactersJikan()` - 4 edges
4. `getDb()` - 4 edges
5. `runBotTurn()` - 3 edges
6. `fetch()` - 3 edges
7. `generateId()` - 3 edges
8. `generatePlausibleStats()` - 3 edges
9. `init()` - 3 edges
10. `Multiplayer Lobbies` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Go Project Layout` --semantically_similar_to--> `Next.js Project Structure`  [INFERRED] [semantically similar]
  CLAUDE.md → meta_clash_readme.md
- `UI Screenshots` --references--> `Meta Clash`  [EXTRACTED]
  README.md → meta_clash_readme.md
- `Implementation Plan` --references--> `Meta Clash`  [EXTRACTED]
  CLAUDE.md → meta_clash_readme.md
- `Frontend Design System` --conceptually_related_to--> `Web Tech Stack`  [INFERRED]
  CLAUDE.md → meta_clash_readme.md
- `runBotTurn()` --calls--> `getDb()`  [INFERRED]
  /home/nikhil/Documents/Coding/antigravity/meta_clash/pages/api/socket.js → /home/nikhil/Documents/Coding/antigravity/meta_clash/lib/db.js

## Hyperedges (group relationships)
- **Core Game Experience** — meta_clash_readme_meta_clash, meta_clash_readme_cards, meta_clash_readme_gameplay, meta_clash_readme_lobbies [EXTRACTED 0.95]
- **Go Backend Standards** — claude_go_backend, claude_concurrency, claude_error_handling, claude_project_map [EXTRACTED 0.90]
- **Real-time Multiplayer System** — meta_clash_readme_socket_io, meta_clash_readme_lobbies, meta_clash_readme_bots [INFERRED 0.80]

## Communities

### Community 0 - "Core Game Design"
Cohesion: 0.22
Nodes (11): Frontend Design System, Implementation Plan, Bot System, Card Stats (Rank/Strength/Speed/IQ), Themed Cards, Gameplay Loop, Multiplayer Lobbies, Meta Clash (+3 more)

### Community 1 - "Card Generation Engine"
Cohesion: 0.67
Nodes (5): fetch(), fetchCharactersJikan(), generateCards(), generateId(), generatePlausibleStats()

### Community 2 - "Socket.io Server"
Cohesion: 0.67
Nodes (2): handler(), runBotTurn()

### Community 3 - "Database Layer"
Cohesion: 0.83
Nodes (2): getDb(), init()

### Community 4 - "Game Page UI"
Cohesion: 0.67
Nodes (1): Game()

### Community 5 - "App Shell"
Cohesion: 0.67
Nodes (1): App()

### Community 6 - "Home Page"
Cohesion: 0.67
Nodes (1): Home()

### Community 7 - "Card Component"
Cohesion: 0.67
Nodes (1): Card()

### Community 8 - "Go Backend Standards"
Cohesion: 0.67
Nodes (3): Channel-Based Concurrency, Error Wrapping Standard, Go 1.22+ Backend Standard

### Community 9 - "Project Structure"
Cohesion: 1.0
Nodes (2): Go Project Layout, Next.js Project Structure

## Knowledge Gaps
- **8 isolated node(s):** `Next.js Project Structure`, `Bot System`, `UI Screenshots`, `Channel-Based Concurrency`, `Error Wrapping Standard` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Socket.io Server`** (4 nodes): `socket.js`, `socket.js`, `handler()`, `runBotTurn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Database Layer`** (4 nodes): `getDb()`, `init()`, `db.js`, `db.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Game Page UI`** (3 nodes): `Game()`, `game.js`, `game.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Shell`** (3 nodes): `App()`, `_app.js`, `_app.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (3 nodes): `index.js`, `Home()`, `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Card Component`** (3 nodes): `Card()`, `Card.js`, `Card.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Structure`** (2 nodes): `Go Project Layout`, `Next.js Project Structure`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runBotTurn()` connect `Socket.io Server` to `Database Layer`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `getDb()` connect `Database Layer` to `Socket.io Server`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Next.js Project Structure`, `Bot System`, `UI Screenshots` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._