# Project Startup Guide

This project consists of a React frontend (Vite) and a Node.js/Express backend.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Setup & Installation

### 1. Frontend Setup
Navigate to the root directory and install dependencies:
```bash
npm install
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

## Running the Project

You need to run both the backend and frontend servers simultaneously.

### Option 1: Single Command (Recommended)

The default `npm run dev` script now launches **both** servers via `concurrently`.

```bash
npm run dev
```

This will start Vite on port `8080` and proxy all `/api` requests to the Express
server that runs on `http://localhost:3001`.

### Option 2: Running Manually (Two Terminals)

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend only):**
```bash
npm run dev:client
```

You can also run `npm run dev:server` from the project root if you prefer not
to `cd` into `server/`.

## Environment Variables

The backend requires a `.env` file in the `server/` directory.
Ensure it contains necessary configurations (e.g., PORT, JWT_SECRET).

For the frontend you can optionally create a `.env` file in the project root.
Set `VITE_API_URL=https://<your-domain>/api` when deploying so the browser
talks to the correct backend host. During local development requests
automatically go through the Vite `/api` proxy, so no additional configuration
is needed.
