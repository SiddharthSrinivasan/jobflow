# JobFlow - Job application Tracker

Jobflow is a full-stack web app that helps users track job applicatiions  and monitor progress through stages like **Applied**, **Interview**, **Offer** and **Rejected**.
This project was build to show practical backend skills includeing:
- REST API design
- JWT Authentication
- PostGreSQL + Prisma ORM
- Input validation using Zod
- Deployment using Render + Neon + Vercel

## Live Demo

Frontend (Vercel):  
https://jobflow-beige.vercel.app

Backend (Render):  
https://jobflow-backend-rz0e.onrender.com

Health Check:  
`GET /health`

## Features

### Authentication
- Register user
- Login user
- JWT-based auth
- Protected routes using middleware
- `/me` endpoint to fetch current user

### Job Application
- Add a job application
- Edit/update an application
- Delete an application
- View all application
- Filter/Search by company/role/status

### Analytics
- Status breakdown counts
- Total applications count
- Quick Dashboard summary

## Tech Stack
- Node.js
- TypeScript
- Express.js
- PostgreSQL (Neon)
- Prisma ORM
- JWT Auth
- Zod validation
- Docker + docker-compose (local DB)

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon (Postgres)

## Setup and Installation

### Clone the repository
git clone <your-repo-url>
cd jobflow

### Backend 

cd backend

npm install

docker compose up -d

backend/.env
Add:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobflow"
JWT_SECRET="your_local_secret_key"
PORT=3001

npx prisma migrate dev --name init
npx prisma generate

npm run dev
http://localhost:3001
GET http://localhost:3001/health

### Frontend 

cd ../frontend

npm install

frontend/.env

Add:
VITE_API_URL=http://localhost:3001

npm run dev

http://localhost:5173

Render build command:
npm install && npm run build && npx prisma generate && npx prisma migrate deploy

Start Command:
npm start

## Structure

jobflow/
  backend/
    src/
      routes/
      middleware/
      schemas/
      server.ts
    prisma/
      schema.prisma
    package.json

  frontend/
    src/
      components/
      pages/
      api.ts
    package.json

