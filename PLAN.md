# Chess Openings Trainer — Build Plan

A Chessbook-inspired app for building and practising chess opening repertoires.

## Feature Overview

1. Chess board UI + move input
2. Opening tree data structure
3. Engine evaluation (Stockfish)
4. Master % and rating % per move (Lichess API)
5. Spaced repetition practice
6. Chess.com game import
7. Deviation detection (where you diverged from your repertoire)

---

## Component Breakdown

### 1. Chess Board UI + Move Input
**Difficulty:** Easy
**Libraries:**
- `react-chessboard` — board rendering
- `chess.js` — legal move validation, FEN/PGN parsing

Standard solved infrastructure. Handles piece movement, highlighting, and position state.

---

### 2. Opening Tree Data Structure
**Difficulty:** Easy-Medium
**Concept:**
- Each node = a position (stored as FEN or Zobrist hash)
- Each edge = a move (SAN notation)
- Tree is built by the user adding moves and opponent responses

**Key challenge:** Transpositions — the same position can be reached via different move orders. Decide early whether to use a tree (simpler) or a DAG (accurate but complex).

**Storage:** JSON file or SQLite to start; Postgres if scaling.

---

### 3. Engine Evaluation (Stockfish)
**Difficulty:** Easy
**Options:**
- Browser: `stockfish.js` (WebAssembly build, runs in-browser)
- Backend: `python-chess` + local Stockfish binary

Send a FEN string, receive centipawn score and best move. Well-documented.

---

### 4. Master % and Rating % per Move
**Difficulty:** Easy
**API:** Lichess Opening Explorer — free, no auth required

```
# Master games
GET https://explorer.lichess.ovh/masters?fen={FEN}

# Games by rating range
GET https://explorer.lichess.ovh/lichess?fen={FEN}&ratings=1600,1800
```

Returns top moves with game counts and win/draw/loss percentages.

---

### 5. Spaced Repetition
**Difficulty:** Medium
**Algorithm:** SM-2 (same as Anki)
- Each move in the repertoire = one "card"
- After each practice attempt: rate ease (1-5)
- SM-2 schedules the next review interval

**Key challenge:** A large repertoire generates many cards. Need to prioritise new moves vs. due reviews cleanly.

---

### 6. Chess.com Game Import
**Difficulty:** Easy
**API:** Public, no auth required

```
GET https://api.chess.com/pub/player/{username}/games/{year}/{month}
```

Returns games as PGN. Parse with `chess.js` (frontend) or `python-chess` (backend).

---

### 7. Deviation Detection
**Difficulty:** Medium
**Logic:**
1. Import game PGN
2. Walk move-by-move through the game
3. At each position, check if the played move exists in the repertoire tree
4. Flag the first divergence (missed prep move or unrecognised opponent move)

**Edge cases:**
- Detect which colour the user is playing
- Handle positions not in repertoire at all vs. wrong move played

---

## Recommended Build Order

1. Board UI + chess.js setup
2. Opening tree (build + save/load)
3. Lichess API integration (master % + rating %)
4. Stockfish evaluation
5. Chess.com import + deviation detection
6. Spaced repetition

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + `react-chessboard` + `chess.js` |
| Engine | `stockfish.js` (WASM, runs in browser) |
| Backend (optional) | Python + `python-chess` |
| Storage | JSON / SQLite to start |
| Opening data | Lichess Explorer API |
| Game import | Chess.com public API |
