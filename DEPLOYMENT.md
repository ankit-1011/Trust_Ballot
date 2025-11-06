# Deployment Guide 🚀

## Overview
यह guide आपको बताएगी कि कैसे TrustBallot को Vercel (Frontend) और Render (Backend) पर deploy करें।

## Step 1: GitHub पर Push करें

### 1.1 Changes को Stage करें
```bash
git add .
```

### 1.2 Commit करें
```bash
git commit -m "Add API config with environment variables support"
```

### 1.3 GitHub पर Push करें
```bash
git push origin main
# या
git push origin master
```

## Step 2: Vercel पर Frontend Deploy करें

### 2.1 Vercel Dashboard में:
1. Vercel dashboard पर जाएं: https://vercel.com
2. "Add New Project" click करें
3. GitHub repository select करें
4. **Root Directory** set करें: `Trust_Ballot/tballot`
5. Framework Preset: **Vite** select करें

### 2.2 Environment Variables Set करें:
Vercel dashboard में **Environment Variables** section में add करें:

```
VITE_API_URL = https://trust-ballot.onrender.com
```

**Important:** 
- Production, Preview, और Development सभी environments के लिए set करें
- या सिर्फ Production के लिए set करें (local development के लिए default `http://localhost:3000` use होगा)

### 2.3 Deploy करें:
- "Deploy" button click करें
- Vercel automatically build और deploy करेगा

### 2.4 Auto-Deployment:
- हर बार जब आप GitHub पर push करेंगे, Vercel automatically नया deployment करेगा ✅

## Step 3: Render पर Backend Deploy करें

### 3.1 Render Dashboard में:
1. Render dashboard पर जाएं: https://render.com
2. "New +" → "Web Service" select करें
3. GitHub repository connect करें
4. Settings configure करें:
   - **Name:** `trust-ballot-backend`
   - **Root Directory:** `Trust_Ballot/Backend`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start` या `node dist/server.js`
   - **Environment:** `Node`

### 3.2 Environment Variables Set करें:
Render dashboard में **Environment** section में add करें:

```
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
PORT = 3000
```

### 3.3 CORS Update:
Backend में Vercel URL add करें (अगर अभी नहीं है):
- `server.ts` में CORS origin में Vercel URL add करें

### 3.4 Deploy करें:
- "Create Web Service" click करें
- Render automatically build और deploy करेगा

### 3.5 Auto-Deployment:
- हर बार जब आप GitHub पर push करेंगे, Render automatically नया deployment करेगा ✅

## Step 4: Final Configuration

### 4.1 Backend CORS में Vercel URL Add करें:
`Trust_Ballot/Backend/server.ts` में:

```typescript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://trust-ballot-hlez.vercel.app",  // आपका Vercel URL
    "https://trust-ballot.onrender.com"      // Render URL (अगर जरूरी हो)
  ],
  credentials: true
}));
```

### 4.2 Test करें:
1. Frontend: Vercel URL पर जाएं
2. Backend: Render URL पर test करें
3. Signup/Login functionality test करें

## Important Notes ⚠️

1. **Environment Variables:**
   - `.env` files GitHub पर push नहीं होनी चाहिए (already in .gitignore ✅)
   - Vercel और Render पर manually set करनी होगी

2. **Auto-Deployment:**
   - Vercel और Render दोनों GitHub webhooks use करते हैं
   - Code push करते ही automatically deploy हो जाएगा

3. **Build Time:**
   - Vercel: ~2-3 minutes
   - Render: ~3-5 minutes

4. **Updates:**
   - Code change करने के बाद GitHub पर push करें
   - Platforms automatically detect करेंगे और redeploy करेंगे

## Troubleshooting

### CORS Error:
- Backend CORS में frontend URL add करें
- Environment variables check करें

### Build Failed:
- `package.json` scripts check करें
- Root directory correct है या नहीं verify करें

### Environment Variables Not Working:
- Vercel/Render dashboard में variables correctly set हैं या नहीं check करें
- Variable names `VITE_` prefix के साथ हैं या नहीं verify करें

