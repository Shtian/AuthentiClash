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

To get started, you need to run supabase locally. Install the Supabase CLI and run `supabase start`. Might take some time as it pulls a lot of docker images to run. When it's finished you will get a list of handy URLs and tokens. These can be found later with `supabase status` if you need them again after startup. Create a .env file in the root of the project with the following content:

```bash
PUBLIC_SUPABASE_URL={API URL from "supabase status"}
PUBLIC_SUPABASE_ANON_KEY={anon key from "supabase status"}
SUPABASE_SERVICE_KEY={service key from "supabase status"}
PUBLIC_ENV=local
```

Now you can run the migrations to get the schema in place locally. Run the following command:

```bash
supabase migration up
```

Then run the following commands to start the application:

```bash
pnpm install
pnpm dev
open http://localhost:5173
```

### Seed Data

If you want a seed data to play around with, or just an easily restorable state, you can run the following command:

```bash
pnpm supabase:seed
```

This will create 10 users with email logins as well as 10 games with a random amount of players and scores. Five games with a future end date and 5 games with a past end date. The seed data can be found in `supabase/seed.sql` which is run first with `supabase db reset` and then participation data is added with a javascript, to control the random data and tune it more easily.

### Troubleshooting

If you run into issues with foreign key constraints on profile_id, you can try going to the profile page of a logged in user and hitting save first, then try creating a game again.
