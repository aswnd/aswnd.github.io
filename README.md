# tubtt — University Table Tennis Tournament

An async table tennis tournament platform for university players.

## Features

- Register and login with university email
- View the current tournament standings
- See your current match assignment
- Chat with your opponent
- Both players submit and confirm match results

## Architecture

```
React + Vite  →  Go API  →  Supabase PostgreSQL
              ↘  Supabase Auth (login)
              ↘  Supabase Realtime (chat)
```

### Frontend — React + Vite (`/frontend`)
- React with TypeScript
- Vite for bundling and dev server
- Calls the Go API for all tournament logic
- Uses Supabase JS client directly for auth and realtime chat
- Deploy to Vercel or Netlify (free, static hosting)

### Backend — Go (`/backend`)
- Chi for HTTP routing
- pgx for PostgreSQL driver
- sqlc for type-safe SQL query generation
- Validates Supabase JWTs for auth
- Handles all tournament business logic (match generation, result confirmation)
- Deploy to Railway or Fly.io (free tier)

### Database — Supabase
- Managed PostgreSQL
- Supabase Auth with university email domain restriction
- Supabase Realtime for live chat between opponents

## Database Schema

```sql
-- profiles are created automatically when a user signs up
create table profiles (
  id uuid references auth.users primary key,
  display_name text not null,
  email text not null
);

create table matches (
  id serial primary key,
  player1_id uuid references profiles(id),
  player2_id uuid references profiles(id),
  score1 int,
  score2 int,
  confirmed_by_player1 boolean default false,
  confirmed_by_player2 boolean default false,
  status text default 'pending' -- pending | confirmed | disputed
);

create table messages (
  id serial primary key,
  match_id int references matches(id),
  sender_id uuid references profiles(id),
  content text not null,
  created_at timestamptz default now()
);
```

## Cost

~$0/month on free tiers across all services.

## Local Development

### Backend
```bash
cd backend
cp .env.example .env   # fill in Supabase credentials
go run ./cmd/server
```

### Frontend
```bash
cd frontend
bun install
bun dev
```
