# AuthentiClash

Welcome to AuthentiClash, a game hosted at [authenticlash.app](https://authenticlash.app). AuthentiClash is built on SvelteKit.

## Overview

Players can log in, create a game with a specified end date, and invite friends to join. The game revolves around entering 2FA (Two-Factor Authentication) codes (1-99, microsoft authenticator, github authenticator etc.), with players competing to accumulate the highest score by the game's end date.

## Features

- **User Authentication**: Login to manage your games and participate in others.
- **Game Creation**: Easily create a game by specifying an end date, a unique game URL is generated.
- **Invite Friends**: Share your game URL with friends to join the competition.
- **2FA Code Entry**: Enter your 2FA codes to earn points within the game.
- **Leaderboard**: View rankings to see how you stack up against the competition.

## Development

To get started, you need these env variables in a `.env` file at the root of the project:

```bash
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
PUBLIC_ENV=local
```

Then run the following commands:

```bash
pnpm install
pnpm dev
open http://localhost:5173
```
