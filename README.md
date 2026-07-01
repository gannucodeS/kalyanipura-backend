# Kalyanipura Church — Backend API

A production-ready REST API backend for the Kalyanipura Church React application. Built with Node.js, Express, MongoDB, and Mongoose.

## Features

**Data Models**
- Service Times, Gallery, Ministries, Events
- Prayer Requests, Contact Messages, Giving Records
- Event RSVPs, Ministry Interests

**Security**
- Helmet security headers
- CORS allowlist configuration
- Rate limiting (general + auth-specific)
- Request size limits
- Input validation (Joi)
- NoSQL injection prevention (mongo-sanitize)
- HTTP parameter pollution prevention
- Centralized error handler (no stack traces in production)
- JWT-based admin authentication (httpOnly cookies)

**Performance**
- Compression middleware
- MongoDB connection pooling
- Pagination, filtering, sorting, search on all list endpoints
- In-memory cache abstraction layer (Redis-ready)

**Admin Panel**
- Login-protected admin dashboard
- View/manage prayer requests, contact messages, giving records
- Full CRUD for service times, events, gallery, ministries
- View event RSVPs and ministry interests

**Logging**
- Morgan HTTP request logging
- Winston application logging with daily rotation

## Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)

## Setup

```bash
# 1. Clone and install
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start MongoDB (if local)
mongod

# 4. Start the server
npm run dev    # Development with nodemon
# or
npm start      # Production
```

The server starts on `http://localhost:5000`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `MONGODB_URI` | `mongodb://localhost:27017/kalyanipura-church` | MongoDB connection string |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |
| `ADMIN_EMAIL` | `admin@kalyanipurachurch.org` | Admin login email |
| `ADMIN_PASSWORD` | `admin123` | Admin login password (plaintext or bcrypt hash) |
| `JWT_SECRET` | (auto-generated) | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | J token expiry |

## API Endpoints

All API routes are prefixed with `/api/v1`.

### Public Endpoints (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/service-times` | List service times |
| GET | `/api/v1/service-times/:id` | Get service time |
| GET | `/api/v1/gallery` | List gallery items |
| GET | `/api/v1/gallery/:id` | Get gallery item |
| GET | `/api/v1/ministries` | List ministries |
| GET | `/api/v1/ministries/:id` | Get ministry |
| GET | `/api/v1/events` | List events |
| GET | `/api/v1/events/:id` | Get event |
| POST | `/api/v1/events/:eventId/rsvp` | RSVP to event |
| GET | `/api/v1/prayer-requests` | List approved prayer requests |
| POST | `/api/v1/prayer-requests` | Submit prayer request |
| POST | `/api/v1/prayer-requests/:id/pray` | Pray for a request |
| POST | `/api/v1/contact` | Submit contact form |
| POST | `/api/v1/giving` | Record a donation |
| GET | `/health` | Health check |

### Admin Endpoints (Bearer token required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/login` | Login (returns JWT) |
| POST | `/api/v1/admin/logout` | Logout |
| GET | `/api/v1/admin/me` | Get current admin |
| POST/PUT/DELETE | `/api/v1/service-times/*` | Manage service times |
| POST/PUT/DELETE | `/api/v1/gallery/*` | Manage gallery |
| POST/PUT/DELETE | `/api/v1/ministries/*` | Manage ministries |
| POST/PUT/DELETE | `/api/v1/events/*` | Manage events |
| GET/DELETE | `/api/v1/prayer-requests/*` | Manage prayer requests |
| GET/DELETE | `/api/v1/contact/*` | Manage contact messages |
| GET/DELETE | `/api/v1/giving/*` | Manage giving records |

### Admin Panel (Browser, cookie auth)

| Route | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Dashboard |
| `/admin/prayer-requests` | View/manage prayer requests |
| `/admin/messages` | View/manage contact messages |
| `/admin/giving` | View giving records |
| `/admin/service-times` | CRUD service times |
| `/admin/events` | CRUD events |
| `/admin/gallery` | CRUD gallery |
| `/admin/ministries` | CRUD ministries |
| `/admin/event-rsvps` | View RSVPs |
| `/admin/ministry-interests` | View interests |

## Example Requests

### Submit a prayer request
```bash
curl -X POST http://localhost:5000/api/v1/prayer-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah",
    "category": "Healing",
    "request": "Praying for full recovery after surgery.",
    "isAnonymous": false
  }'
```

### RSVP to an event
```bash
curl -X POST http://localhost:5000/api/v1/events/{eventId}/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Admin login
```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kalyanipurachurch.org",
    "password": "admin123"
  }'
```

### Create a service time (admin)
```bash
curl -X POST http://localhost:5000/api/v1/service-times \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Sunday Worship",
    "time": "9:00 AM & 11:00 AM",
    "tagline": "LIVE & ONLINE",
    "category": "SANCTUARY",
    "icon": "sun"
  }'
```

### List events with pagination and filtering
```bash
curl "http://localhost:5000/api/v1/events?page=1&limit=10&sort=-createdAt"
```

### Contact form submission
```bash
curl -X POST http://localhost:5000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "topic": "Volunteering",
    "message": "I would like to volunteer for the children ministry."
  }'
```

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

**Paginated:**
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "\"title\" is required"
    }
  ]
}
```

## Project Structure

```
backend/
├── server.js                    # Entry point
├── src/
│   ├── app.js                   # Express setup
│   ├── config/                  # DB, env config
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Auth, validation, error handling, security
│   ├── models/                  # Mongoose schemas (9 models)
│   ├── routes/                  # Route definitions
│   ├── services/                # Business logic layer
│   ├── validators/              # Joi validation schemas
│   ├── utils/                   # Helpers (ApiError, ApiResponse, logger, cache)
│   └── views/                   # Admin EJS templates
├── .env
├── .env.example
├── package.json
├── README.md
└── swagger.yaml
```

## Swagger Documentation

Import `swagger.yaml` into Swagger UI, Postman, or any OpenAPI-compatible tool for interactive API documentation.
