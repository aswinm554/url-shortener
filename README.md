# URL Shortener API

A production-ready URL shortener platform built as a developer API. Shorten URLs, track clicks, and integrate link shortening into any app via REST API.

## Live Demo

- **API Base URL:** `https://your-app.onrender.com`
- **Swagger Docs:** `https://your-app.onrender.com/api-docs`

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Cache:** Redis (ioredis)
- **Auth:** JWT (Access + Refresh tokens)
- **Validation:** Joi
- **Rate Limiting:** express-rate-limit
- **Documentation:** Swagger (OpenAPI 3.0)
- **Deployment:** Render

---

## Features

- 🔐 JWT Authentication with access and refresh tokens
- 🔗 URL shortening with nanoid generated short codes
- ⚡ Redis caching for fast redirects (1ms vs 50ms)
- 📊 Click tracking and analytics per link
- 🛡️ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation with Joi
- 📄 Swagger API documentation
- 🗑️ Delete URLs with ownership verification

---

## Project Structure

```
url-shortener/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── redis.js           # Redis connection
│   │   └── swagger.js         # Swagger configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Register, Login logic
│   │   └── url.controller.js  # Shorten, Redirect, Delete logic
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── error.middleware.js     # Global error handler
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   └── validate.middleware.js  # Input validation
│   ├── models/
│   │   ├── user.model.js      # User schema
│   │   └── url.model.js       # URL schema
│   ├── routes/
│   │   ├── auth.routes.js     # Auth routes
│   │   └── url.routes.js      # URL routes
│   └── utils/
│       └── response.js        # Consistent response formatter
├── .env                       # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js                  # Entry point
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and get tokens | No |

### URLs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/url/shorten` | Shorten a URL | Yes |
| GET | `/url/:shortCode` | Redirect to original URL | No |
| GET | `/url/` | Get all your URLs | Yes |
| DELETE | `/url/:shortCode` | Delete a URL | Yes |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Redis Cloud account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your environment variables

# Start development server
npm run dev
```

### Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URI=redis://default:password@host:port
```

---

## Usage Example

### Register

```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "123456"
}

# Response
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

### Shorten a URL

```bash
POST /url/shorten
Authorization: Bearer YOUR_ACCESS_TOKEN
{
  "originalUrl": "https://very-long-url.com/with/many/params"
}

# Response
{
  "shortCode": "abc123",
  "originalUrl": "https://very-long-url.com/with/many/params"
}
```

### Redirect

```bash
GET /url/abc123
# Redirects to original URL
# Tracks the click automatically
```

---

## How Redis Caching Works

```
First click:
Request → Express → MongoDB (50ms) → save to Redis → Redirect

Every click after:
Request → Express → Redis (1ms) → Redirect
```

Popular links are served from Redis in under 1ms, keeping your database load minimal.

---

## Rate Limiting

| Plan | Requests | Window |
|------|----------|--------|
| All users | 100 requests | 15 minutes |

Exceeding the limit returns:
```json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}
```

---

## API Documentation

Full interactive documentation available at `/api-docs` powered by Swagger UI.

---

## What I Learned Building This

- JWT authentication with access and refresh token pattern
- Redis caching and cache consistency problems
- Rate limiting for API protection
- MongoDB aggregation and relationships
- Middleware chain architecture (MVC pattern)
- Environment-based configuration
- REST API design and Swagger documentation
- Production deployment with environment variables

---

## Author

**Aswin** — [GitHub](https://github.com/yourusername)

---

## License

MIT
