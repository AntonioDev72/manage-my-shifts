# Manage My Shifts

Full-stack shift tracking app to log work shifts and calculate earnings. Workers manage their own shifts and profile; admins can view and manage all workers and shifts.

Built for the Greystone College / Wawiwa Tech Training Full Stack Shift Builder and Full Stack API to Server (NodeJS) projects.

## Features

**Workers**
- Register, log in and edit their profile (password optional on update)
- Add, edit and list their own shifts across multiple workplaces
- Filter shifts by name, workplace and date range
- Dashboard with weekly shifts and highest-earning month
- Earnings calculated automatically (hours x hourly wage)

**Admins**
- Dashboard with all workers' weekly shifts
- View, add and edit shifts for any worker, and delete shifts
- List, edit and delete workers (deleting a worker also deletes their shifts and comments)
- Filter any worker's shifts

## Tech Stack

- Frontend: Angular (standalone components, reactive forms, HTTP interceptor)
- Backend: Node.js, Express
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT (60 min) with bcryptjs password hashing, permissions `admin` / `regular_user`
- API testing: Postman

## Project Structure

```
manage-my-shifts/
├── frontend/                 # Angular app
├── backend/
│   ├── server.js             # Express app and route mounting
│   ├── routes/               # Route files: URL + middleware -> controller
│   ├── controllers/          # Request handling and business logic
│   ├── models/               # Mongoose schemas
│   ├── middleware/auth.js    # authMiddleware, adminMiddleware, signToken, isAdmin
│   └── scripts/              # seedPermissions.js, makeAdmin.js
├── docs/
│   └── ManageMyShifts.postman_collection.json
└── README.md
```

Each module (user, shift, comment, permission) has a route file, a controller and a model.

## Getting Started

### Backend

```
cd backend
npm install
```

Create `backend/.env`:

```
MONGO_URI=<your MongoDB Atlas connection string, including the database name managemyshifts>
PORT=3000
JWT_SECRET=<a long random string>
```

Create the permissions and migrate existing users (run once):

```
node scripts/seedPermissions.js
```

Start the API:

```
node server.js
```

### Frontend

```
cd frontend
npm install
npx ng serve
```

Open http://localhost:4200.

### Admin accounts

There is no admin registration screen. Register a normal account, then run (from the `backend` folder):

```
node scripts/makeAdmin.js user@email.com
```

## API Reference

All routes are under `http://localhost:3000`. Routes marked "token" need an `Authorization: Bearer <token>` header; "admin" also requires the admin permission.

### User and auth (`/api/user`)

| Function | Method and route | Access |
|---|---|---|
| createUser | `POST /api/user/` | public |
| login | `POST /api/user/login` (returns JWT) | public |
| getMe | `GET /api/user/me` | token |
| updateMe | `PATCH /api/user/me` | token |
| getAllUsers | `GET /api/user/` | admin |
| getUserById | `GET /api/user/:id` | admin |
| updateUserById | `PATCH /api/user/:id` | admin |
| deleteUser | `DELETE /api/user/:id` | admin |

### Shifts (`/api/shifts`)

| Function | Method and route | Access |
|---|---|---|
| getMyShifts | `GET /api/shifts/` | token (own shifts) |
| getAllShifts | `GET /api/shifts/all` | admin |
| getWorkerShifts | `GET /api/shifts/worker/:id` | admin |
| getShiftById | `GET /api/shifts/:id` | token (owner or admin) |
| addShift | `POST /api/shifts/` | token |
| updateShiftById | `PATCH /api/shifts/:id` | token (owner or admin) |
| deleteShift | `DELETE /api/shifts/:id` | admin |

### Comments (`/api/comment`)

| Function | Method and route | Access |
|---|---|---|
| getAllComments | `GET /api/comment/` | admin |
| getAllUserComments | `GET /api/comment/user/:userId` | token (that user or admin) |
| getCommentById | `GET /api/comment/:id` | token (owner or admin) |
| createComment | `POST /api/comment/` | token |
| updateCommentById | `PATCH /api/comment/:id` | token (owner or admin) |
| deleteComment | `DELETE /api/comment/:id` | admin |

### Permissions (`/api/permission`)

| Function | Method and route | Access |
|---|---|---|
| getAllPermissions | `GET /api/permission/` | token |
| addPermission | by hand: `node scripts/seedPermissions.js` | - |

## Notes on the spec

- Field names follow the original Shift Builder project, not the spec's lowercase names: `firstName`, `lastName`, `hourlyWage` (spec: perHour), `startTime` / `endTime` (spec: start / end), `workplace` (spec: place), `worker` (spec: userId on Shift), `permission` on User, and `created` / `updated` on Comment.
- `GET /api/shifts/` returns the logged-in user's own shifts, because the worker pages need it. The admin-only "getAllShifts" from the spec is `GET /api/shifts/all`.
- Authentication was also moved into the user module: register and login are `POST /api/user/` and `POST /api/user/login`.

## Testing with Postman

Import `docs/ManageMyShifts.postman_collection.json` into Postman. In the collection variables, fill in `adminEmail`, `adminPassword`, `workerEmail` and `workerPassword` (no credentials are stored in the file). Then run the folders in order: User and Auth, Shifts, Comments, Permissions. The login requests save the tokens, and the create requests save the ids used by the later requests. Each request has a test for the expected status code, including the 401 and 403 cases.
