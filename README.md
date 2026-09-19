# QuickDine

A full-stack restaurant discovery and table-booking application with separate experiences for diners, restaurant owners, and administrators.

## Features

- Restaurant discovery and search
- Restaurant detail pages
- Protected table-booking flow
- User dashboard
- Restaurant-owner dashboard
- Admin dashboard
- Role-based protected routes
- Authentication and authorization
- Restaurant and booking management
- Image upload support

## Tech stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcrypt
- Multer
- Cloudinary
- CORS

## Project structure

```text
QuickDine/
├── Client/          React + TypeScript frontend
└── server/          Express + MongoDB backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/
```

## Run locally

### Frontend

```bash
cd Client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run server
```

The backend requires the appropriate environment variables for the database, authentication, and external services such as Cloudinary.

## Main application routes

The frontend includes public restaurant discovery pages plus protected user, owner, and admin dashboards. The backend exposes separate routes for authentication, restaurants, bookings, owners, and administrators.

---

Built by [Divyansh Singh](https://github.com/divbytes-prog).
