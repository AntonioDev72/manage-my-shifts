# Manage My Shifts

Full-stack shift tracking app to log work shifts and calculate earnings. Workers manage their own shifts and profile; admins can view and manage all workers and shifts.

Built for the Greystone College / Wawiwa Tech Training Full Stack Shift Builder project.

## Features

**Workers**
- Register, log in and edit their profile (password optional on update)
- Add, edit and list their own shifts across multiple workplaces
- Filter shifts by name, workplace and date range
- Dashboard with weekly shifts and highest-earning month
- Earnings calculated automatically (hours × hourly wage)

**Admins**
- Dashboard with all workers' weekly shifts
- View, add and edit shifts for any worker
- List, edit and delete workers (deleting a worker also deletes their shifts)
- Filter any worker's shifts

## Tech Stack

- Frontend: Angular (standalone components, reactive forms, HTTP interceptor)
- Backend: Node.js, Express
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT (60 min) with bcryptjs password hashing, role-based access (`worker` / `admin`)

## Project Structure

```
manage-my-shifts/
├── frontend/       # Angular app
├── backend/        # Express API (routes, models, middleware)
└── README.md
```

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

Then start the API:

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

There is no admin registration screen. Register a normal account, then set `role: "admin"` on that user's document in MongoDB Atlas.
