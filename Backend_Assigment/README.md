# Blog Management System - Full Stack Assignment

A comprehensive blog management system with AI-powered content enhancement, built with Node.js, Express, MongoDB, and React.

## 📋 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Usage](#usage)

## ✨ Features

### Backend (Phase 1 & 2)
- ✅ Scrape 5 oldest articles from beyondchats.com/blogs
- ✅ Store articles in MongoDB with full CRUD operations
- ✅ AI-powered content enhancement using OpenAI/Gemini
- ✅ Competitor research via Google Search API
- ✅ Automatic citation and reference management
- ✅ RESTful API with Express

### Frontend
- ✅ Modern React UI with Tailwind CSS
- ✅ Side-by-side comparison view (Original vs AI-Enhanced)
- ✅ Full CRUD interface for article management
- ✅ Responsive design for mobile and desktop
- ✅ Error handling with toast notifications
- ✅ Loading states and empty states

## 🔧 Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or Atlas cloud)
- **API Keys**:
  - OpenAI API Key OR Gemini API Key
  - SerpAPI Key (for Google search)

## 🚀 Local Setup

### 1. Clone the Repository
```bash
cd Desktop/Unified/Backend_Assigment
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `Backend_Assigment` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
```

### 4. Seed Initial Data
Scrape and store 5 oldest articles:
```bash
npm run seed
```

### 5. Start Backend Server
```bash
npm run dev
```
Server will run on `http://localhost:5001`

### 6. (Optional) Enhance Articles with AI
Run the enhancement script (requires server to be running):
```bash
# In a new terminal
npm run enhance
```

### 7. Setup Frontend
```bash
cd ../Frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api/articles
```

### Endpoints

#### Get All Articles
```http
GET /api/articles
```
**Response**: Array of article objects

#### Get Article by ID
```http
GET /api/articles/:id
```
**Response**: Single article object

#### Create Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Article Title",
  "original_content": "Content here...",
  "original_url": "https://example.com",
  "updated_content": "Enhanced content...",
  "references": ["https://ref1.com", "https://ref2.com"]
}
```

#### Update Article
```http
PUT /api/articles/:id
Content-Type: application/json

{
  "updated_content": "New content...",
  "references": ["https://ref1.com"]
}
```

#### Delete Article
```http
DELETE /api/articles/:id
```

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture diagram and data flow.

### High-Level Overview
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│   MongoDB   │
│   (React)   │◀─────│  (Express)  │◀─────│  (Database) │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ├─────▶ OpenAI/Gemini (LLM)
                            ├─────▶ SerpAPI (Search)
                            └─────▶ Cheerio (Scraping)
```

## 📖 Usage

### Running Scripts

#### Seed Database
```bash
npm run seed
```
Scrapes 5 oldest articles from beyondchats.com and stores them in MongoDB.

#### Enhance Articles
```bash
npm run enhance
```
**Prerequisites**: Backend server must be running.

Process:
1. Fetches articles via API
2. Searches Google for competitor articles
3. Scrapes competitor content
4. Uses LLM to rewrite content
5. Appends citations to bottom of content
6. Updates articles via API

#### Start Development Server
```bash
npm run dev
```
Starts server with auto-reload on file changes.

### Frontend Usage

1. **View Articles**: Navigate to dashboard to see all articles
2. **Compare Versions**: Click on an article to see original vs AI-enhanced side-by-side
3. **Create Article**: Click "Create New Article" button
4. **Edit Article**: Click edit icon on article card or "Edit Article" in detail view
5. **Delete Article**: Click delete icon with confirmation

## 🔍 Project Structure

```
Backend_Assigment/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Seed & enhancement scripts
│   ├── services/        # Business logic (scraper, search, LLM)
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env                 # Environment variables
└── package.json

Frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # API client
│   └── App.jsx          # Main app component
└── package.json
```

## 🧪 Testing

1. Verify backend is running: `http://localhost:5001/`
2. Test API endpoints using Postman or curl
3. Run enhancement script and check database for updated content
4. Test frontend CRUD operations

## 📝 Notes

- Port 5001 is used instead of 5000 (macOS reserves 5000)
- Citations are automatically appended to `updated_content`
- Enhancement script uses API layer (not direct DB access)
- Frontend build ready for Vercel/Netlify deployment

## 🤝 Contributing

This is an assignment project. For production use, consider:
- Adding authentication
- Implementing rate limiting
- Adding comprehensive tests
- Setting up CI/CD pipeline
- Adding logging and monitoring

## 📄 License

ISC
