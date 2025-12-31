# System Architecture & Data Flow

## Overview

This document describes the architecture of the Blog Management System, including component interactions, data flow, and system design decisions.

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI]
        Router[React Router]
        API_Client[Axios API Client]
    end

    subgraph "Backend Layer"
        Express[Express Server]
        Routes[API Routes]
        Controllers[Controllers]
        Services[Services]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB Database)]
    end

    subgraph "External Services"
        LLM[OpenAI/Gemini API]
        Search[SerpAPI Google Search]
        Web[External Websites]
    end

    UI --> Router
    Router --> API_Client
    API_Client -->|HTTP Requests| Express
    Express --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> MongoDB
    Services --> LLM
    Services --> Search
    Services --> Web
    
    MongoDB -->|Data| Services
    LLM -->|Enhanced Content| Services
    Search -->|Competitor URLs| Services
    Web -->|Scraped Content| Services
    
    Services -->|Response| Controllers
    Controllers -->|JSON| Express
    Express -->|HTTP Response| API_Client
    API_Client --> UI

    style Frontend Layer fill:#e1f5ff
    style Backend Layer fill:#fff4e1
    style Data Layer fill:#e8f5e9
    style External Services fill:#fce4ec
```

## Component Architecture

### Frontend Components

```mermaid
graph LR
    App[App.jsx]
    Layout[Layout]
    Dashboard[Dashboard]
    Detail[ArticleDetail]
    Form[ArticleForm]
    
    App --> Layout
    Layout --> Dashboard
    Layout --> Detail
    Layout --> Form
    
    Dashboard --> ArticleCard
    Detail --> ComparisonView
    Detail --> References
    
    ArticleCard --> API[API Service]
    Form --> API
    Detail --> API
    Dashboard --> API
```

### Backend Services

```mermaid
graph TB
    Controller[Article Controller]
    
    Controller --> Scraper[Scraper Service]
    Controller --> Search[Search Service]
    Controller --> LLM[LLM Service]
    
    Scraper -->|Cheerio| Websites[External Sites]
    Search -->|SerpAPI| Google[Google Search]
    LLM -->|OpenAI/Gemini| AI[AI Models]
    
    Controller --> Model[Article Model]
    Model --> DB[(MongoDB)]
```

## Data Flow Diagrams

### Phase 1: Article Seeding Flow

```mermaid
sequenceDiagram
    participant Script as seed.js
    participant Scraper as Scraper Service
    participant Web as beyondchats.com
    participant DB as MongoDB

    Script->>Scraper: scrapeOldestArticles(5)
    Scraper->>Web: HTTP GET /blogs
    Web-->>Scraper: HTML Response
    Scraper->>Scraper: Parse with Cheerio
    Scraper-->>Script: Array of Articles
    Script->>DB: insertMany(articles)
    DB-->>Script: Success
    Script->>Script: Exit
```

### Phase 2: Article Enhancement Flow

```mermaid
sequenceDiagram
    participant Script as enhanceArticles.js
    participant API as Backend API
    participant Search as Search Service
    participant Scraper as Scraper
    participant LLM as LLM Service
    participant DB as MongoDB

    Script->>API: GET /api/articles
    API->>DB: Article.find()
    DB-->>API: Articles Array
    API-->>Script: JSON Response
    
    loop For each article
        Script->>Search: searchGoogle(title)
        Search->>SerpAPI: Search Query
        SerpAPI-->>Search: Competitor URLs
        Search-->>Script: URLs Array
        
        Script->>Scraper: scrapeCompetitorContent(url)
        Scraper->>Web: HTTP GET
        Web-->>Scraper: HTML
        Scraper-->>Script: Text Content
        
        Script->>LLM: generateEnhancedContent()
        LLM->>OpenAI: API Call
        OpenAI-->>LLM: Enhanced Text
        LLM-->>Script: Enhanced Content
        
        Script->>Script: Append Citations
        Script->>API: PUT /api/articles/:id
        API->>DB: Article.save()
        DB-->>API: Updated Article
        API-->>Script: Success
    end
```

### Frontend CRUD Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as React UI
    participant API as API Service
    participant Backend as Express Server
    participant DB as MongoDB

    User->>UI: Click "Create Article"
    UI->>UI: Show Form
    User->>UI: Fill & Submit
    UI->>API: POST /api/articles
    API->>Backend: HTTP Request
    Backend->>DB: Article.create()
    DB-->>Backend: New Article
    Backend-->>API: JSON Response
    API-->>UI: Success
    UI->>UI: Navigate to Dashboard
    UI->>User: Show Success Toast
```

## Database Schema

### Article Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  original_content: String (required),
  original_url: String (required, unique),
  updated_content: String (optional),
  references: [String] (optional),
  created_at: Date (default: now)
}
```

## API Request/Response Flow

### Example: Get All Articles

```mermaid
sequenceDiagram
    participant Client
    participant Express
    participant Controller
    participant Model
    participant MongoDB

    Client->>Express: GET /api/articles
    Express->>Controller: getArticles()
    Controller->>Model: Article.find()
    Model->>MongoDB: Query
    MongoDB-->>Model: Documents
    Model-->>Controller: Articles Array
    Controller->>Controller: res.json(articles)
    Controller-->>Express: JSON Response
    Express-->>Client: HTTP 200 + JSON
```

### Example: Update Article

```mermaid
sequenceDiagram
    participant Client
    participant Express
    participant Controller
    participant Model
    participant MongoDB

    Client->>Express: PUT /api/articles/:id
    Express->>Controller: updateArticle(req, res)
    Controller->>Model: Article.findById(id)
    Model->>MongoDB: Query by ID
    MongoDB-->>Model: Document
    Model-->>Controller: Article Object
    Controller->>Controller: Update fields
    Controller->>Model: article.save()
    Model->>MongoDB: Update Document
    MongoDB-->>Model: Updated Document
    Model-->>Controller: Updated Article
    Controller-->>Express: JSON Response
    Express-->>Client: HTTP 200 + JSON
```

## Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Web Scraping**: Cheerio
- **HTTP Client**: Axios
- **AI Integration**: OpenAI API / Gemini API
- **Search**: SerpAPI

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Design Decisions

### 1. API-First Enhancement Script
**Decision**: `enhanceArticles.js` uses REST API instead of direct database access.

**Rationale**:
- Follows separation of concerns
- Tests API endpoints
- Allows script to run independently of database credentials
- Easier to scale (script can run on different machine)

### 2. Citations in Content
**Decision**: Append references to `updated_content` string.

**Rationale**:
- Satisfies requirement of citations "at the bottom of article"
- Ensures citations are always displayed with content
- Simplifies frontend rendering (no separate logic needed)

### 3. Port 5001
**Decision**: Use port 5001 instead of 5000.

**Rationale**:
- macOS reserves port 5000 for AirPlay
- Avoids port conflicts
- Better developer experience

### 4. Separate Frontend/Backend
**Decision**: Maintain separate directories and servers.

**Rationale**:
- Clear separation of concerns
- Independent deployment
- Easier to scale horizontally
- Frontend can be deployed to CDN (Vercel/Netlify)

## Security Considerations

### Current Implementation
- CORS enabled for all origins (development)
- No authentication/authorization
- API keys in environment variables
- No rate limiting

### Production Recommendations
- Implement JWT authentication
- Add rate limiting middleware
- Restrict CORS to specific origins
- Use API key rotation
- Add input validation and sanitization
- Implement logging and monitoring
- Use HTTPS only

## Scalability Considerations

### Current Limitations
- Single server instance
- No caching layer
- Synchronous article processing
- No queue system

### Future Improvements
- Add Redis for caching
- Implement job queue (Bull/BullMQ) for article enhancement
- Use CDN for frontend assets
- Implement database indexing
- Add horizontal scaling with load balancer
- Implement microservices architecture for different concerns

## Performance Optimizations

1. **Database Queries**: Use `.lean()` for read-only operations
2. **API Responses**: Implement pagination for article lists
3. **Frontend**: Code splitting and lazy loading
4. **Caching**: Add Redis for frequently accessed data
5. **CDN**: Serve static assets from CDN
