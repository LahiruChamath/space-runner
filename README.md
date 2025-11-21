# Space Runner (React + Express)


## Prereqs
- Node.js 18+


## Quick start
# 1) install deps
npm run setup


# 2) start both apps (client on :5173, server on :8081)
npm run dev


# 3) open http://localhost:5173


## Scripts (from repo root)
- npm run setup -> installs client & server deps
- npm run dev -> runs both with concurrent output
- npm run client -> client only (Vite)
- npm run server -> server only (Express + nodemon)


## Environment (server/.env)
JWT_SECRET=devsecret_change_me
CORS_ORIGIN=http://localhost:5173
PORT=8081


## Notes
- JSON file persistence is used for simplicity (see server/db.json). Swap to Mongo later if needed.
- JWT is stored in httpOnly cookie (`sid`).
- Banana puzzle is served via server endpoints and verified server‑side to prevent cheating.
- Leaderboards: `time` and `mixed` (see scoring in server/index.js).