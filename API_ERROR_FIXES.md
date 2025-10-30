# API Error Fixes Summary

## Changes Made to Fix API Connection Issues

### 1. **Backend CORS Configuration** (`backend/main.py`)

**Problem:** Restrictive CORS policy blocking frontend requests

**Fix Applied:**
- ✅ Added regex-based CORS for Vercel deployments
- ✅ Uses `allow_origin_regex=r"https://.*\.vercel\.app"` for production
- ✅ Allows all Vercel preview and production URLs
- ✅ Added `expose_headers=["*"]` for better compatibility

**Code Changes:**
```python
# For Vercel deployments, use regex to allow preview URLs
if "vercel.app" in FRONTEND_URL:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
```

### 2. **Frontend API Configuration** (`frontend/src/services/api.js`)

**Problem:** Poor error reporting making debugging difficult

**Fix Applied:**
- ✅ Added detailed error logging
- ✅ Logs the actual URL being called
- ✅ Captures and displays full error responses
- ✅ Better try-catch error handling

**Code Changes:**
```javascript
console.log('Making request to:', url);
const errorText = await res.text().catch(() => 'No error details');
console.error('API Error Response:', errorText);
throw new Error(`API error: ${res.status} - ${errorText}`);
```

### 3. **Environment Configuration**

**Files Created:**
- ✅ `frontend/.env.production` - Production API URL
- ✅ `frontend/.env.local` - Local development settings
- ✅ `frontend/.env.example` - Template for environment variables
- ✅ `backend/vercel.json` - Vercel deployment configuration

**Configuration:**
```env
# Frontend Production
REACT_APP_API_URL=https://fact-checker-app-five.vercel.app

# Backend Production
FRONTEND_URL=https://fact-checker-app-p1t4.vercel.app
MONGO_URI=mongodb+srv://fact_user:factchecker%40456@fact-checker-db.todinaf.mongodb.net/
```

---

## How to Deploy the Fixes

### Step 1: Update Backend on Vercel

1. **Push changes to Git:**
   ```bash
   git add backend/main.py backend/vercel.json
   git commit -m "Fix CORS for Vercel deployment"
   git push
   ```

2. **Verify Environment Variables in Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Select backend project: `fact-checker-app-five`
   - Go to Settings → Environment Variables
   - Ensure these are set:
     - `FRONTEND_URL=https://fact-checker-app-p1t4.vercel.app`
     - `GEMINI_API_KEY`
     - `PERPLEXITY_API_KEY`
     - `MONGO_URI`
     - `GEMINI_MODEL=gemini-2.0-flash`

3. **Redeploy:**
   - Vercel will auto-deploy on git push
   - OR manually redeploy from Vercel dashboard

### Step 2: Update Frontend on Vercel

1. **Push changes to Git:**
   ```bash
   git add frontend/src/services/api.js frontend/.env.production
   git commit -m "Add better error handling and API logging"
   git push
   ```

2. **Verify Environment Variables in Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Select frontend project: `fact-checker-app-p1t4`
   - Go to Settings → Environment Variables
   - Ensure this is set for **Production**:
     - `REACT_APP_API_URL=https://fact-checker-app-five.vercel.app`

3. **Redeploy:**
   - Vercel will auto-deploy on git push
   - OR manually redeploy from Vercel dashboard

---

## Testing After Deployment

### Test 1: Backend Health Check
Open in browser: https://fact-checker-app-five.vercel.app/

**Expected Response:**
```json
{"message": "Fact Checker API is running. Use /api/claims endpoint."}
```

### Test 2: Backend API Endpoint
Use curl or Postman:
```bash
curl -X POST https://fact-checker-app-five.vercel.app/api/claims/ \
  -H "Content-Type: application/json" \
  -d '{"claim_text": "Test claim"}'
```

### Test 3: Frontend Connection
1. Open: https://fact-checker-app-p1t4.vercel.app
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Enter a claim and submit
5. Check console logs for:
   - ✅ "Making request to: https://fact-checker-app-five.vercel.app/api/claims/"
   - ✅ Successful response data
   - ❌ NO CORS errors
   - ❌ NO 404/500 errors

---

## Common Errors and Solutions

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** Backend CORS not configured or environment variable wrong

**Solution:**
1. Check `FRONTEND_URL` in backend Vercel environment variables
2. Ensure it matches exactly: `https://fact-checker-app-p1t4.vercel.app` (no trailing slash)
3. Redeploy backend

### Error: "Failed to fetch" or "Network request failed"

**Cause:** Backend not responding or wrong URL

**Solution:**
1. Test backend directly: https://fact-checker-app-five.vercel.app/
2. Check Vercel function logs for errors
3. Verify `REACT_APP_API_URL` in frontend Vercel settings

### Error: 404 Not Found

**Cause:** Wrong API endpoint or routing issue

**Solution:**
1. Verify endpoint is `/api/claims/` (with trailing slash)
2. Check `vercel.json` is deployed with backend
3. Review Vercel build logs

### Error: 500 Internal Server Error

**Cause:** Backend code error or missing dependencies

**Solution:**
1. Check Vercel function logs for Python errors
2. Verify all environment variables are set
3. Check MongoDB connection
4. Verify Gemini API key is valid

---

## Debugging Tools

### Browser DevTools
- **Console:** See API calls and errors
- **Network Tab:** Inspect request/response details
- **Application Tab:** Check localStorage/cookies

### Vercel Dashboard
- **Function Logs:** Real-time backend errors
- **Build Logs:** Deployment issues
- **Analytics:** Monitor performance

### Test Commands
```bash
# Test backend root
curl https://fact-checker-app-five.vercel.app/

# Test API endpoint
curl -X POST https://fact-checker-app-five.vercel.app/api/claims/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://fact-checker-app-p1t4.vercel.app" \
  -d '{"claim_text": "Test"}'

# Check CORS headers
curl -I -X OPTIONS https://fact-checker-app-five.vercel.app/api/claims/ \
  -H "Origin: https://fact-checker-app-p1t4.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

---

## Next Steps

1. ✅ Commit and push all changes to Git
2. ✅ Verify environment variables in both Vercel projects
3. ✅ Redeploy both frontend and backend
4. ✅ Test backend endpoint directly
5. ✅ Test frontend → backend connection
6. ✅ Check browser console for detailed errors
7. ✅ Review Vercel function logs if issues persist

If problems continue after following these steps, check the **VERCEL_DEPLOYMENT.md** guide for detailed troubleshooting.
