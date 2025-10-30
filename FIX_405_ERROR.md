# Fix for 405 Error - Method Not Allowed

## Problem
Getting "405 Method Not Allowed" error when making API requests in production.

## Root Cause
FastAPI requires a proper ASGI adapter (Mangum) to work on Vercel's serverless infrastructure.

---

## ✅ Solution Applied

### 1. Added Mangum Package
**File:** `backend/requirements.txt`

Added `mangum` to requirements:
```
fastapi
uvicorn
mangum    ← NEW
google-genai
...
```

### 2. Added Vercel Handler
**File:** `backend/main.py`

Added at the end of the file:
```python
# Vercel serverless function handler
from mangum import Mangum
handler = Mangum(app)
```

### 3. Updated vercel.json
**File:** `backend/vercel.json`

Added PYTHONPATH environment variable for proper module loading.

---

## 🚀 Deploy the Fix

### Step 1: Commit and Push
```bash
cd C:\Users\Asus\OneDrive\Desktop\fact-checker-app

git add backend/requirements.txt backend/main.py backend/vercel.json
git commit -m "Fix 405 error - add Mangum handler for Vercel"
git push
```

### Step 2: Vercel Will Auto-Deploy
If your project is connected to Git, Vercel will automatically:
1. Detect the changes
2. Rebuild with new dependencies
3. Deploy the updated backend

**OR manually deploy:**
```bash
cd backend
vercel --prod
```

### Step 3: Wait for Deployment
- Go to: https://vercel.com/dashboard
- Select your backend project: `fact-checker-app-five`
- Wait for deployment to complete (usually 1-2 minutes)

### Step 4: Test the Fix
```bash
# Test root endpoint
curl https://fact-checker-app-five.vercel.app/

# Test POST endpoint
curl -X POST https://fact-checker-app-five.vercel.app/api/claims/ \
  -H "Content-Type: application/json" \
  -d '{"claim_text": "Test claim"}'
```

---

## 🧪 Verify Frontend Connection

1. Open: https://fact-checker-app-p1t4.vercel.app
2. Open DevTools (F12) → Console tab
3. Enter a fact-check claim
4. Should see successful API response (no 405 error)

---

## 📋 What Changed

| File | Change | Purpose |
|------|--------|---------|
| `requirements.txt` | Added `mangum` | ASGI adapter for serverless |
| `main.py` | Added `handler = Mangum(app)` | Vercel entry point |
| `vercel.json` | Added PYTHONPATH env var | Module path resolution |

---

## ⚠️ Important Notes

1. **Mangum is required** for FastAPI on Vercel serverless functions
2. The `handler` variable in `main.py` is what Vercel calls to process requests
3. Make sure to redeploy **after** committing these changes

---

## 🔍 Why This Happened

Vercel uses AWS Lambda-style serverless functions. FastAPI is an ASGI application that needs an adapter (Mangum) to convert between:
- **ASGI** (FastAPI's interface)
- **Lambda/Serverless** (Vercel's interface)

Without Mangum, FastAPI couldn't properly handle HTTP methods (POST, GET, etc.) on Vercel.

---

## ✅ After Deployment

Your backend should now:
- ✅ Accept POST requests to `/api/claims/`
- ✅ Accept multimodal requests to `/api/claims/multimodal`
- ✅ Work properly with your frontend
- ✅ No more 405 errors!

---

## 🆘 If Still Getting 405 Error

1. **Check deployment logs:**
   - Go to Vercel Dashboard → Backend Project → Deployments
   - Click latest deployment → View Function Logs
   - Look for errors during build or runtime

2. **Verify Mangum installed:**
   - Check deployment build logs
   - Should see: "Installing mangum..."

3. **Clear Vercel cache:**
   - Vercel Dashboard → Settings → General
   - Scroll to "Delete Project" section
   - Click "Redeploy" or manually trigger new deployment

4. **Check environment variables:**
   - Verify all environment variables are set in Vercel Dashboard
   - Especially: `FRONTEND_URL`, `GEMINI_API_KEY`, `MONGO_URI`

---

## 🎉 Success!

After redeploying, your fact-checker API should work perfectly on Vercel!
