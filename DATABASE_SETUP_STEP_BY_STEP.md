# Step-by-Step: Setting Up Edge Config Database

This guide will walk you through setting up Edge Config for your band schedule application.

## Prerequisites
- ✅ Your project is deployed on Vercel
- ✅ You have a Vercel account

---

## Part 1: Create Edge Config Database

### Step 1: Go to Your Vercel Project
1. Open [vercel.com](https://vercel.com) in your browser
2. Log in to your account
3. Click on your project: **maldito-sur-page**

### Step 2: Navigate to Storage/Edge Config
Look for one of these options in your project dashboard:

**Option A: Storage Tab (Easiest)**
- In the top navigation bar, look for a **"Storage"** tab
- Click on it

**Option B: Settings → Integrations**
- Click **"Settings"** (top navigation)
- In the left sidebar, click **"Integrations"**
- Click **"Browse Integrations"**
- Search for **"Edge Config"** or **"KV"**
- Click **"Add Integration"**

**Option C: Settings → Storage**
- Click **"Settings"** (top navigation)
- In the left sidebar, look for **"Storage"** section
- Click **"Create Database"** or **"Add Storage"**

### Step 3: Create Edge Config
1. Click **"Create Database"** or **"Add Integration"**
2. Select **"Edge Config"** (or **"KV"** if you prefer, but Edge Config is what you have)
3. Give it a name (e.g., "band-schedule-db")
4. Click **"Create"** or **"Add"**

### Step 4: Copy Your Credentials
After creation, you'll see connection details. You'll see:
- **EDGE_CONFIG** - A URL that looks like: `https://edge-config.vercel.com/ecfg_xxxxxxxxxxxxx?token=xxx`
- Copy this entire URL

**Also extract the ID:**
- From the URL, copy the part that starts with `ecfg_` (e.g., `ecfg_abc123xyz`)
- This is your Edge Config ID

---

## Part 2: Add Environment Variables

### Step 5: Go to Environment Variables
1. In your Vercel project, click **"Settings"** (top navigation)
2. In the left sidebar, click **"Environment Variables"**

### Step 6: Add EDGE_CONFIG Variable
1. Click **"Add New"** button
2. Fill in:
   - **Name**: `EDGE_CONFIG`
   - **Value**: Paste the full URL you copied (starts with `https://edge-config.vercel.com/...`)
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
3. Click **"Save"**

### Step 7: Add EDGE_CONFIG_ID Variable (Optional but Recommended)
1. Click **"Add New"** again
2. Fill in:
   - **Name**: `EDGE_CONFIG_ID`
   - **Value**: Paste just the ID part (e.g., `ecfg_abc123xyz`)
   - **Environment**: Select all three (Production, Preview, Development)
3. Click **"Save"**

---

## Part 3: Create Vercel API Token (For Writing Data)

### Step 8: Go to Vercel Account Tokens
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Or: Click your profile icon (top right) → **"Settings"** → **"Tokens"**

### Step 9: Create New Token
1. Click **"Create Token"** button
2. Fill in:
   - **Token Name**: `Schedule App Token` (or any name you like)
   - **Expiration**: Choose:
     - **"No expiration"** (recommended for production)
     - Or set a specific date
3. Click **"Create Token"**

### Step 10: Copy the Token
⚠️ **IMPORTANT**: Copy the token immediately! You won't be able to see it again.
- It will look like: `vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Copy the entire token

### Step 11: Add VERCEL_API_TOKEN to Environment Variables
1. Go back to your Vercel project
2. **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Fill in:
   - **Name**: `VERCEL_API_TOKEN`
   - **Value**: Paste the token you just copied
   - **Environment**: Select all three (Production, Preview, Development)
5. Click **"Save"**

---

## Part 4: Redeploy Your Project

### Step 12: Trigger a New Deployment
You need to redeploy for the environment variables to take effect.

**Option A: Redeploy from Dashboard**
1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the three dots (⋯) menu
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again

**Option B: Push a New Commit**
1. Make a small change (add a comment to any file)
2. Commit and push to your Git repository
3. Vercel will automatically deploy

### Step 13: Wait for Deployment
- Wait for the deployment to complete (usually 1-2 minutes)
- You'll see a green checkmark when it's done

---

## Part 5: Verify It's Working

### Step 14: Test the API Endpoint
1. Open your deployed site: `https://maldito-sur-page.vercel.app/`
2. Open browser Developer Tools (Press F12)
3. Go to **"Console"** tab
4. The page should load without errors

### Step 15: Test Reading Data
1. Visit: `https://maldito-sur-page.vercel.app/api/schedule`
2. You should see JSON data like:
   ```json
   {
     "startTime": "18:00",
     "setupMinutes": 15,
     "showMinutes": 30,
     "bands": ["Band 1", "Band 2", "Band 3"]
   }
   ```
3. If you see this, **reading is working!** ✅

### Step 16: Test Writing Data
1. Go to your site: `https://maldito-sur-page.vercel.app/`
2. Login as admin:
   - Username: `admin`
   - Password: `admin`
3. Make a change to the schedule (e.g., change a band name)
4. Check the browser console (F12) for any errors
5. Refresh the page - your changes should persist
6. Open the site in an incognito window - you should see the same data

If all of this works, **writing is working!** ✅

---

## Troubleshooting

### Problem: "Could not extract Edge Config ID"
**Solution**: Make sure you added `EDGE_CONFIG_ID` environment variable with just the ID (e.g., `ecfg_abc123`)

### Problem: "Edge Config writes require VERCEL_API_TOKEN"
**Solution**: Make sure you:
1. Created a token at vercel.com/account/tokens
2. Added it as `VERCEL_API_TOKEN` environment variable
3. Redeployed after adding it

### Problem: API returns 404
**Solution**: 
1. Check that `api/schedule.js` file exists in your project
2. Check deployment logs for errors
3. Make sure you redeployed after adding environment variables

### Problem: Changes don't persist
**Solution**:
1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Make sure you redeployed after adding variables
4. Check Vercel function logs in the dashboard

### Problem: Can't find Storage/Edge Config option
**Possible reasons**:
- You might need a Vercel Pro plan (Edge Config requires paid plan)
- Try: Settings → Integrations → Browse → Search "Edge Config"

---

## Summary Checklist

- [ ] Created Edge Config database in Vercel
- [ ] Copied EDGE_CONFIG URL
- [ ] Extracted Edge Config ID (ecfg_xxx)
- [ ] Added EDGE_CONFIG environment variable
- [ ] Added EDGE_CONFIG_ID environment variable (optional)
- [ ] Created Vercel API token
- [ ] Added VERCEL_API_TOKEN environment variable
- [ ] Redeployed the project
- [ ] Tested reading data (visit /api/schedule)
- [ ] Tested writing data (login and make changes)

---

## Quick Reference: Environment Variables Needed

Make sure you have these 3 environment variables in Vercel:

1. **EDGE_CONFIG** = `https://edge-config.vercel.com/ecfg_xxx?token=xxx`
2. **EDGE_CONFIG_ID** = `ecfg_xxx` (just the ID part)
3. **VERCEL_API_TOKEN** = `vercel_xxx` (from account tokens)

All should be set for: Production, Preview, and Development

---

## Need Help?

If you're stuck at any step:
1. Check the error message in browser console (F12)
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Make sure you redeployed after adding variables

Good luck! 🚀

