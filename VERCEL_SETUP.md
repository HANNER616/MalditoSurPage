# Fix 404 Error - Vercel Configuration

## Problem
Getting `404 (Not Found)` when accessing the root URL because Vercel is looking for a `public/` folder.

## Solution: Configure Output Directory

### Step 1: Go to Vercel Project Settings

1. Open your Vercel dashboard: [vercel.com](https://vercel.com)
2. Select your project: **maldito-sur-page**
3. Click **Settings** (top navigation)
4. Click **General** (left sidebar)

### Step 2: Update Output Directory

1. Scroll down to **"Build & Development Settings"**
2. Find **"Output Directory"** field
3. **Change it from `public` to `.`** (a single dot) or **leave it empty**
4. Click **Save**

### Step 3: Update Framework Preset (if needed)

1. In the same **General** settings page
2. Find **"Framework Preset"**
3. Set it to **"Other"** or **"Vite"** (if available)
4. Or leave it as auto-detected

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯) menu
4. Click **"Redeploy"**
5. Wait for deployment to complete

### Step 5: Verify

1. Visit: `https://maldito-sur-page.vercel.app/`
2. Should now show your page (not 404)

## Alternative: If Settings Don't Work

If you can't change the Output Directory setting:

1. Create an empty `public` folder
2. Move `index.html` and `image.jpg` back to `public/`
3. Update `vercel.json` to route correctly

But the Output Directory setting should fix it!

## Current File Structure (Correct)

```
your-project/
├── api/
│   └── schedule.js
├── index.html          ← Should be served from root
├── image.jpg
├── package.json
└── vercel.json
```

After changing Output Directory to `.`, Vercel will serve `index.html` from the root.


