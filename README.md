# Shop CRUD Assignment

This project is split into 2 folders as requested:

- `frontend`: React + TypeScript app
- `backend`: Node.js + Express API

## Features Implemented

- User registration (create account)
- User login
- Delete logged-in user account
- Add product
- View products
- Update product
- Delete product

Products are scoped to the logged-in user.

## Project Structure

```text
shop/
  frontend/
  backend/
```

## Backend Setup (Node.js API)

1. Open terminal in `backend`:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` from example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Start backend:

```bash
npm run dev
```

API runs on `http://localhost:4000`.

## Frontend Setup (React + TypeScript)

1. Open terminal in `frontend`:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` from example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Start frontend:

```bash
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `DELETE /api/users/me` (auth required)
- `GET /api/products` (auth required)
- `POST /api/products` (auth required)
- `PUT /api/products/:id` (auth required)
- `DELETE /api/products/:id` (auth required)
