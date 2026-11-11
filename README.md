# shinobi-quiz-battle API

Backend API for **shinobi-quiz-battle**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Ralf James Gatacelo (gataceloralfjames-sketchvibe), BSCS [3-1]
- Group and game concept: [Group name]

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/gataceloralfjames-sketchvibe/shinobi-quiz-battle-api.git
cd shinobi-quiz-battle-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player is considered to have completed a game when they have answered all the questions in the game session, regardless of whether their answers are correct or incorrect. Players who leave the game or do not answer all the questions are considered incomplete.

## Tables

users
QuestionSet
GameSession
Player
Question
Answer
RewardRound
RewardObject

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |

## Question Sets API (Module 1)

Base URL: `http://localhost:3001/api/v1`

Every request needs the `X-Demo-User` header with the `school_id` of the caller. This is a Week 11 stand-in for login. Only accounts with the role `host` may use these endpoints.

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| POST | `/question-sets` | `{ "title": "...", "subject": "..." }` | 201 and the new set | 400, 401, 403 |
| GET | `/question-sets` | none | 200 and an array of the caller's sets | 401, 403 |
| GET | `/question-sets/:id` | none | 200 and one set | 400, 401, 403, 404 |
| PATCH | `/question-sets/:id` | `{ "title": "..." }` and/or `{ "subject": "..." }` | 200 and the changed set | 400, 401, 403, 404 |
| DELETE | `/question-sets/:id` | none | 204 and an empty body | 400, 401, 403, 404 |

A question set looks like this:

```json
{ "id": 1, "title": "Shinobi Basics", "subject": "General Knowledge", "hostId": 1 }
```

Rules:
- `title` is required, 3 to 100 characters.
- `subject` is required, 1 to 100 characters.
- The owner (`hostId`) is always the caller. A client cannot choose it.
- Only the owner can read, change or delete a set.

 
### Test accounts

| Name | `X-Demo-User` | Role |
|---|---|---|
| Kakashi Hatake | `24179712` | host (owns the seeded set "Shinobi Basics") |
| Tsunade Senju | `24179333` | host |
| Hinata Hyuga | `24179723` | player |
| Naruto Uzumaki | `24179795` | player |