# Deployment Guide

## Backend Deployment (Render/Railway/Heroku)

### 1. Environment Variables
Set these in your deployment platform:
```
PORT=5001
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
SERPAPI_KEY=your_serpapi_key
```

### 2. Build Command
```bash
npm install
```

### 3. Start Command
```bash
npm start
```

### 4. Update package.json
Make sure you have a start script:
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "node --watch src/server.js"
}
```

---

## Frontend Deployment (Vercel/Netlify)

### 1. Environment Variables
Set in your deployment platform:
```
VITE_API_BASE_URL=https://your-backend-url.com
```

### 2. Build Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

### 3. Update API Base URL

Update `Frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
```

---

## Deployment Platforms

### Recommended for Backend:
- **Render** (Free tier available)
- **Railway** (Free tier available)
- **Heroku** (Paid)
- **DigitalOcean App Platform**

### Recommended for Frontend:
- **Vercel** (Free tier, best for React)
- **Netlify** (Free tier)
- **Cloudflare Pages** (Free tier)

---

## Pre-Deployment Checklist

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] All API keys obtained
- [ ] Environment variables configured
- [ ] CORS updated for production domain
- [ ] Database connection tested

### Frontend
- [ ] Backend URL updated in .env
- [ ] Build tested locally (`npm run build`)
- [ ] API calls tested with production backend
- [ ] Environment variables set in platform

---

## Quick Deploy Commands

### Vercel (Frontend)
```bash
cd Frontend
npm install -g vercel
vercel
```

### Render (Backend)
1. Connect GitHub repository
2. Select `Backend_Assigment` folder
3. Set environment variables
4. Deploy

---

## Post-Deployment

1. **Test API**: Visit `https://your-backend.com/api/articles`
2. **Test Frontend**: Visit your frontend URL
3. **Run Scripts**: 
   ```bash
   # SSH into backend or use platform CLI
   npm run seed
   npm run enhance
   ```

---

## Troubleshooting

**CORS Errors:**
- Update `Backend_Assigment/src/app.js` CORS configuration
- Add your frontend domain to allowed origins

**API Connection Failed:**
- Check `VITE_API_BASE_URL` in frontend
- Ensure backend is running
- Check network/firewall settings

**MongoDB Connection:**
- Whitelist IP addresses in MongoDB Atlas
- Check connection string format
- Verify credentials
