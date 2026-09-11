# Manage My Shifts

Client-side shift tracking app to log work shifts and calculate monthly earnings. Built with HTML, CSS and JavaScript, using localStorage for data persistence — no backend required.

## Features

- User registration and login (session handled via localStorage)
- Add, edit and list work shifts across multiple workplaces
- Search shifts by name and date range
- Automatic calculation of earnings per shift and highest-earning month
- Responsive layout for desktop and mobile

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- Data persistence: `localStorage` (no server/backend)

## Project Structure

```
manage-my-shifts/
├── pages/          # HTML pages (login, register, home, add-shift, edit-profile)
├── css/            # Stylesheets
├── js/             # JavaScript, one file per page + shared storage.js
├── assets/         # Images and static assets
└── README.md
```

## Getting Started

No build step required. Just open `pages/index.html` in your browser (or use a tool like VS Code's Live Server extension for the best experience).
