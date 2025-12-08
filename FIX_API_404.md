# Fix API 404 Error

## The Problem
Getting `404 (Not Found)` when accessing `/api/schedule`

## What I Fixed

1. ✅ Changed Edge Config import to dynamic import (prevents 404 if package fails to load)
2. ✅ Added error handling for missing package
3. ✅ Created test endpoint at `/api/test` to verify API routes work

## Steps to Fix

### Step 1: Commit and Push Changes

```bash
git add .
git commit -m "Fix API route 404 - dynamic Edge Config import"
git push
```

### Step 2: Verify Deployment

1. Go to Vercel → Your Project → **Deployments**
2. Wait for new deployment to complete
3. Check for any build errors

### Step 3: Test API Routes

**Test 1: Simple Test Endpoint**
- Visit: `https://maldito-sur-page.vercel.app/api/test`
- Should see: `{"message":"API is working!","timestamp":"..."}`
- If this works, API routes are functioning ✅

**Test 2: Schedule Endpoint**
- Visit: `https://maldito-sur-page.vercel.app/api/schedule`
- Should see JSON data (even if Edge Config isn't configured yet)
- If you see data, the route is working ✅

### Step 4: Check Vercel Function Logs

1. Go to Vercel → Your Project → **Functions** tab
2. Look for `api/schedule` function
3. Check logs for any errors
4. Common errors:
   - Import errors
   - Missing environment variables
   - Package installation issues

## Common Issues

### Issue: Still Getting 404

**Check:**
1. Is `api/schedule.js` in your repository?
2. Did you commit and push the file?
3. Is the deployment successful?
4. Check Vercel deployment logs

**Solution:**
- Make sure the file is in the `api/` folder
- Verify it's committed to Git
- Redeploy in Vercel

### Issue: "Cannot find module '@vercel/edge-config'"

**Solution:**
1. Make sure `package.json` includes the dependency
2. Redeploy (Vercel will install dependencies)
3. Check deployment logs for npm install errors

### Issue: API works but returns errors

**Solution:**
- This is expected if Edge Config isn't configured yet
- The API will return default data
- Follow `EDGE_CONFIG_SETUP_COMPLETE.md` to set it up

## Verify File Structure

Your project should have:
```
your-project/
├── api/
│   ├── schedule.js    ← Main API endpoint
│   └── test.js       ← Test endpoint
├── public/
│   ├── index.html
│   └── image.jpg
└── package.json
```

## Next Steps

After the API route works:

1. **If `/api/test` works but `/api/schedule` doesn't:**
   - Check Vercel function logs for `api/schedule`
   - Look for import or syntax errors

2. **If both work:**
   - Follow `EDGE_CONFIG_SETUP_COMPLETE.md` to set up Edge Config
   - Then data will persist across devices

## Quick Test

1. Visit: `https://maldito-sur-page.vercel.app/api/test`
   - Should work immediately ✅

2. Visit: `https://maldito-sur-page.vercel.app/api/schedule`
   - Should return JSON (default data if Edge Config not set up)

If both work, your API routes are functioning! 🎉

