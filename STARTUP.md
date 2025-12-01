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

### Option 1: Using the Convenience Script (Recommended)

We have added a script to run both servers with a single command:

```bash
npm run dev:all
```

### Option 2: Running Manually (Two Terminals)

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
The backend will start on `http://localhost:3001` (or the port specified in .env).

**Terminal 2 (Frontend):**
```bash
# In the root directory
npm run dev
```
The frontend will start on `http://localhost:8080` (or similar, check console output).

## Environment Variables

The backend requires a `.env` file in the `server/` directory.
Ensure it contains necessary configurations (e.g., PORT, JWT_SECRET).
