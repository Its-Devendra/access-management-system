# User Access Management System

A full-stack application that allows users to request software access permissions and managers to approve or reject these requests.

## Features

- **User Authentication**
  - Registration with role selection (Employee, Manager, Admin)
  - JWT-based authentication
  - Role-based access control

- **Software Management**
  - Create software with customizable access levels (Admin only)
  - View available software

- **Request Management**
  - Request access to software with specific level (Employee)
  - View and manage personal requests (Employee)
  - Approve or reject pending requests (Manager)

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- TypeORM for ORM
- JWT for authentication
- bcrypt for password encryption

### Frontend
- React
- React Router for navigation
- Custom CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=access_management
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
  - Body: `{ username, password, role }`
  - Role defaults to "Employee" if not specified

- `POST /api/auth/login` - Login a user
  - Body: `{ username, password }`
  - Returns: JWT token and user data

### Software Endpoints
- `POST /api/software` - Create new software (Admin only)
  - Body: `{ name, description, accessLevels }`
  - accessLevels must be an array with valid values ["Read", "Write", "Admin"]

- `GET /api/software` - Get all software
  - Returns: List of all software in the database

- `GET /api/software/:id` - Get software by ID
  - Returns: Software details

### Request Endpoints
- `POST /api/requests` - Create access request (Employee only)
  - Body: `{ softwareId, accessType, reason }`
  - accessType must be one of the valid access levels for the software

- `GET /api/requests/user` - Get current user's requests
  - Returns: List of all requests created by the authenticated user

- `GET /api/requests/pending` - Get all pending requests (Manager only)
  - Returns: List of all pending access requests

- `PATCH /api/requests/:id` - Update request status (Manager only)
  - Body: `{ status }`
  - status must be either "Approved" or "Rejected"

## System Architecture

The application follows a traditional client-server architecture:

1. **Frontend (React)**
   - Components for different user roles
   - Authentication context for managing user state
   - Service modules for API communication

2. **Backend (Node.js/Express)**
   - RESTful API endpoints
   - Authentication middleware
   - Role-based authorization

3. **Database (PostgreSQL)**
   - User entity (id, username, password, role)
   - Software entity (id, name, description, accessLevels)
   - Request entity (id, user, software, accessType, reason, status)

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected routes on both frontend and backend
- Input validation