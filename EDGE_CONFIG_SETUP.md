# Edge Config Setup Guide

You've connected Edge Config to your project! Now you need to add one more environment variable to enable writing (saving) schedule data.

## Step 1: Get Your Edge Config ID

The `EDGE_CONFIG` environment variable you received looks like this:
```
https://edge-config.vercel.com/ecfg_xxxxxxxxxxxxx?token=xxx
```

The ID is the part that starts with `ecfg_`. You'll need this.

**Option A: Extract from EDGE_CONFIG**
- Your `EDGE_CONFIG` contains the ID (e.g., `ecfg_abc123`)
- Copy just the ID part (everything from `ecfg_` until the `?`)

**Option B: Find in Vercel Dashboard**
1. Go to your Vercel project
2. Go to **Settings** → **Edge Config**
3. You'll see the Edge Config ID there

## Step 2: Create a Vercel API Token

To write data to Edge Config, you need a Vercel API token:

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Give it a name (e.g., "Schedule App Token")
4. Set expiration (or leave as "No expiration")
5. Click **"Create Token"**
6. **Copy the token immediately** (you won't see it again!)

## Step 3: Add Environment Variables to Vercel

Go to your Vercel project:

1. **Settings** → **Environment Variables**
2. Add these variables:

   **Variable 1: EDGE_CONFIG_ID**
   - Name: `EDGE_CONFIG_ID`
   - Value: Your Edge Config ID (e.g., `ecfg_abc123`)
   - Environment: Select all (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2: VERCEL_API_TOKEN**
   - Name: `VERCEL_API_TOKEN`
   - Value: The API token you created in Step 2
   - Environment: Select all (Production, Preview, Development)
   - Click **"Save"**

## Step 4: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the three dots (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

## Verify It's Working

1. Visit your deployed site
2. Login as admin (username: `admin`, password: `admin`)
3. Make a change to the schedule
4. Check browser console (F12) for any errors
5. Refresh the page - changes should persist
6. Open in another browser/device - should see the same data

## Troubleshooting

### "Edge Config API error: 401"
- Your `VERCEL_API_TOKEN` is invalid or expired
- Create a new token and update the environment variable

### "Could not extract Edge Config ID"
- Make sure `EDGE_CONFIG_ID` is set correctly
- It should be just the ID (e.g., `ecfg_abc123`), not the full URL

### "Edge Config API error: 404"
- Your Edge Config ID is incorrect
- Double-check the ID in Vercel dashboard → Settings → Edge Config

### Changes not persisting
- Make sure you redeployed after adding environment variables
- Check browser console for errors
- Verify both `EDGE_CONFIG_ID` and `VERCEL_API_TOKEN` are set

## Note About Edge Config

Edge Config is **read-optimized** and writes can be slower than KV. For a schedule editor with frequent updates, consider:
- **Vercel KV** (requires Pro plan) - Better for frequent writes
- **Edge Config** (what you have) - Works but writes are slower

Your current setup with Edge Config will work fine for this use case!

