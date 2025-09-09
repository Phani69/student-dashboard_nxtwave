
# MERN Guardian Wings – Full-stack Auth, RBAC, and Student CRUD

This project demonstrates a full MERN stack app with authentication (JWT), role-based access control (admin, student), email verification, password reset, and CRUD operations for students with pagination.

Assumptions:
- Backend on port 5000
- Frontend on port 3000
- MongoDB Atlas recommended

## Getting Started

### 1) Backend Setup

1. Navigate to backend and install dependencies
```sh
cd backend
npm install
```

2. Create your environment file
```sh
cp env.example .env
```
Fill `.env` with your values:
- `MONGO_URI`: MongoDB Atlas URI
- `JWT_SECRET`: any strong secret
- `CLIENT_URL`: http://localhost:3000
- `EMAIL_USER`, `EMAIL_PASS`: Gmail SMTP (app password recommended)

3. Seed initial admin user
```sh
npm run seed
```
This creates `admin@example.com` / `admin123` with role `admin` and verified=true.

4. Start backend
```sh
npm run dev
```
The server starts on http://localhost:5000

### 2) Frontend Setup

From project root:
```sh
npm install
npm run dev
```
The frontend starts on http://localhost:3000

## Key Backend Endpoints

Auth:
- POST `/api/auth/signup` – register user (sends verification email)
- POST `/api/auth/login` – login (requires verified email)
- POST `/api/auth/verify-email` – verify with `{ token }`
- POST `/api/auth/forgot-password` – send reset email `{ email }`
- POST `/api/auth/reset-password` – reset `{ token, password }`
- POST `/api/auth/change-password` – auth required `{ oldPassword, newPassword }`

Students (JWT required):
- GET `/api/students` – admin: all with `?page=&limit=`, student: own profile only
- POST `/api/students` – admin only
- PUT `/api/students/:id` – admin any; student own only
- DELETE `/api/students/:id` – admin only

## Security & Validation
- JWT auth with middleware (`Authorization: Bearer <token>`)
- Role-based guard for admin routes
- Joi input validation on auth and students
- Rate limiting on `/api/auth` routes
- CORS allowed for `CLIENT_URL`

## Test Flow
1. Signup a student; check email (console or real inbox) and verify
2. Login as student; access Student Dashboard; edit own profile
3. Login as admin (`admin@example.com` / `admin123`); manage students list (pagination 10/page), add/edit/delete
4. Forgot password flow: request reset -> link -> reset
5. Change password from dashboard for logged-in user

## Notes
- Verification and reset emails are sent via SMTP. In dev, use a Gmail app password and your Gmail address.
- Enrollment date auto-sets at creation.
