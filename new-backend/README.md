# Mobile Activity App Mockup Backend

Express API for the mobile mockup. It follows the previous Vita backend pattern of a central `/api` router with route modules. It connects to MongoDB when `MONGODB_URI` is available and uses the `vida` database.

## Scripts

- `npm run dev` starts the API on `http://localhost:4000`
- `npm run seed` reseeds MongoDB database `vida`
- `npm run build` compiles TypeScript
- `npm start` runs the compiled server

`MONGODB_URI` can be provided in `new-backend/.env` or the process environment before running `npm run seed`. If MongoDB is unavailable when the server starts, the API serves the in-repo fallback data.

The seed script clears and rebuilds the mockup collections as relational data:

- `users`
- `friendships`
- `chats`
- `activities`
- `mapPins`
- `feedPosts`

It also drops legacy passthrough collections from the previous mockup shape:

- `premiumActivities`
- `standardActivities`
- `profiles`
- `friends`
- `groupChats`

## Endpoints

- `GET /api/health`
- `GET /api/activities`
- `GET /api/activities/premium`
- `GET /api/activities/map-pins`
- `GET /api/activities/:id`
- `GET /api/feed`
- `GET /api/groups`
- `GET /api/groups/:id`
- `GET /api/profile`
- `GET /api/friends`
