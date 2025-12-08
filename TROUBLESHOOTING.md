# Troubleshooting 404 Error

If you're getting a `404: NOT_FOUND` error when accessing `/api/schedule`, try these steps:

## Step 1: Verify API Route File Exists

Make sure you have:
- ✅ `api/schedule.js` file in your project root
- ✅ File is committed to your Git repository
- ✅ File is deployed to Vercel

## Step 2: Check Vercel Deployment

1. Go to your Vercel project dashboard
2. Click on **"Deployments"** tab
3. Check the latest deployment:
   - Is it successful? (green checkmark)
   - Are there any build errors?
   - Click on the deployment to see logs

## Step 3: Check Function Logs

1. In Vercel dashboard, go to **"Functions"** tab (or check deployment logs)
2. Look for any errors related to `api/schedule`
3. Common errors:
   - Import errors (missing packages)
   - Environment variable issues
   - Syntax errors

## Step 4: Verify Package Installation

Make sure `package.json` includes:
```json
{
  "dependencies": {
    "@vercel/kv": "^1.0.1",
    "@vercel/edge-config": "^1.0.1"
  }
}
```

Then in Vercel:
1. Go to **Settings** → **General**
2. Make sure **"Install Command"** is set to `npm install` (or `yarn install`)
3. Redeploy your project

## Step 5: Test API Route Directly

1. After deploying, visit: `https://your-project.vercel.app/api/schedule`
2. You should see JSON data (either schedule data or default data)
3. If you get 404, the route isn't being recognized

## Step 6: Check File Structure

Your project should look like this:
```
your-project/
├── api/
│   └── schedule.js    ← This file must exist
├── index.html
├── package.json
└── (other files)
```

## Step 7: Force Redeploy

Sometimes Vercel needs a fresh deployment:

1. Make a small change to `api/schedule.js` (add a comment)
2. Commit and push to Git
3. Or in Vercel dashboard: **Deployments** → **Redeploy**

## Step 8: Check Vercel Project Settings

1. Go to **Settings** → **General**
2. Verify:
   - **Framework Preset**: Should be "Other" or auto-detected
   - **Root Directory**: Should be `.` (root)
   - **Build Command**: Can be empty or `echo "No build"`
   - **Output Directory**: Can be empty

## Step 9: Alternative - Test with Simple Route

Create a test file `api/test.js`:

```javascript
export default async function handler(req, res) {
  return res.status(200).json({ message: 'API is working!' });
}
```

Deploy and visit: `https://your-project.vercel.app/api/test`

- If this works → The issue is with `schedule.js`
- If this also 404s → Vercel isn't recognizing your `api/` folder

## Step 10: Check Environment Variables

Even if the route works, make sure you have:
- `EDGE_CONFIG` (you have this)
- `EDGE_CONFIG_ID` (optional, but recommended)
- `VERCEL_API_TOKEN` (needed for writes)

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Go to your deployment
   - Click "Functions" tab
   - Look for `api/schedule` function
   - Check for any error messages

2. **Try Local Testing:**
   ```bash
   npm install -g vercel
   vercel dev
   ```
   Then visit `http://localhost:3000/api/schedule`

3. **Contact Support:**
   - Share your Vercel deployment URL
   - Share the error message
   - Share function logs from Vercel dashboard

## Quick Fix: Use Fallback

The frontend code already falls back to localStorage if the API fails. So even if the API route has issues, the app will still work (but data won't be shared across devices).

To verify fallback is working:
1. Open browser console (F12)
2. Make a change to the schedule
3. You should see: "Saved to local storage as fallback"
4. Refresh page - changes should still be there (but only in that browser)


