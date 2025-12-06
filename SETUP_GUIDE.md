# Step-by-Step Guide: Setting Up Vercel KV

## Method 1: Through Vercel Dashboard (Easiest)

### Step 1: Deploy Your Project First

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click "Deploy" (even without KV, it will deploy)

### Step 2: Find the Storage/Integrations Section

After your project is deployed:

1. **Go to your project dashboard** on Vercel
2. Look at the **top navigation bar** - you should see tabs like:
   - Overview
   - Deployments
   - **Storage** ← Look for this!
   - Settings
   - etc.

3. **If you see "Storage" tab:**
   - Click on it
   - Click "Create Database"
   - Select "KV" (Key-Value)

4. **If you DON'T see "Storage" tab:**
   - Go to **Settings** tab
   - Look for **"Integrations"** in the left sidebar
   - Click "Browse Integrations"
   - Search for "KV" or "Redis"
   - Click "Add Integration"
   - Follow the prompts

### Step 3: Get Your Credentials

After creating the KV database:

1. You'll see a page with connection details
2. Look for these values:
   - `KV_REST_API_URL` (something like `https://xxx.vercel-storage.com`)
   - `KV_REST_API_TOKEN` (a long token string)
3. **Copy both values**

### Step 4: Add Environment Variables

1. In your Vercel project, go to **Settings** tab
2. Click **"Environment Variables"** in the left sidebar
3. Click **"Add New"**
4. Add these two variables:

   **Variable 1:**
   - Name: `KV_REST_API_URL`
   - Value: (paste the URL you copied)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

   **Variable 2:**
   - Name: `KV_REST_API_TOKEN`
   - Value: (paste the token you copied)
   - Environment: Select all
   - Click "Save"

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

## Method 2: Using Vercel CLI

If you prefer command line:

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link your project (if not already linked)
cd your-project-directory
vercel link

# 4. Create KV database
vercel kv create

# 5. This will prompt you and show the credentials
# Copy the KV_REST_API_URL and KV_REST_API_TOKEN

# 6. Add environment variables
vercel env add KV_REST_API_URL
# (paste the URL when prompted)

vercel env add KV_REST_API_TOKEN
# (paste the token when prompted)

# 7. Deploy
vercel --prod
```

## Troubleshooting

### "I don't see Storage tab"

**Possible reasons:**
1. **You need a paid Vercel plan** - KV requires a Pro plan or higher
   - Free plan doesn't include KV storage
   - Upgrade at: vercel.com/account/billing

2. **Project not fully set up** - Make sure your project is deployed first

3. **Different UI** - Vercel sometimes updates their interface
   - Try: Settings → Integrations → Browse → Search "KV"

### "I can't find Integrations"

1. Go to: **Settings** → Look for **"Integrations"** in left sidebar
2. Or try: **Project Settings** → **Integrations**

### Alternative: Use Free Solution

If you don't want to pay for Vercel Pro, you can:
- Use a free alternative like **Supabase** (free tier available)
- Use **MongoDB Atlas** (free tier)
- Use **Firebase** (free tier)

Would you like me to set up one of these alternatives instead?

## Verify It's Working

After setup:

1. Visit your deployed site
2. Open browser console (F12)
3. Login as admin
4. Make a change to the schedule
5. Check console for any errors
6. Refresh page - changes should persist
7. Open in incognito/another browser - should see same data

## Still Having Issues?

If you're still stuck:
1. Take a screenshot of your Vercel dashboard
2. Check what plan you're on (Free/Pro/Enterprise)
3. Let me know and I can provide a different solution

