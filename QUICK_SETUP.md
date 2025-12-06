# 🚀 Quick Setup for Data Consistency (5 Minutes)

Your app is currently using localStorage (per-device storage). To enable data consistency across all devices, you need to set up GitHub API access.

## Step 1: Create GitHub Token (2 minutes)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `Band Schedule App`
4. Select scope: ☑️ **`repo`** (Full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (starts with `ghp_`) - you won't see it again!

## Step 2: Get Your Repository Name (30 seconds)

Your repo name format: `username/repo-name`

Example:
- If your GitHub URL is: `https://github.com/juanpaa/Evento`
- Then use: `juanpaa/Evento`

## Step 3: Add Environment Variables in Vercel (2 minutes)

1. Go to: https://vercel.com → Your project → **Settings** → **Environment Variables**

2. Add **GITHUB_REPO**:
   - Name: `GITHUB_REPO`
   - Value: `your-username/repo-name` (e.g., `juanpaa/Evento`)
   - Environment: ☑️ Production ☑️ Preview ☑️ Development
   - Click **Save**

3. Add **GITHUB_TOKEN**:
   - Name: `GITHUB_TOKEN`
   - Value: `ghp_xxx` (the token you copied)
   - Environment: ☑️ Production ☑️ Preview ☑️ Development
   - Click **Save**

4. (Optional) Add **GITHUB_BRANCH**:
   - Name: `GITHUB_BRANCH`
   - Value: `main` (or `master` if that's your branch)
   - Environment: ☑️ Production ☑️ Preview ☑️ Development
   - Click **Save**

## Step 4: Redeploy (30 seconds)

1. Go to **Deployments** tab
2. Click three dots (⋯) on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

## Step 5: Test (1 minute)

1. Visit your site: `https://maldito-sur-page.vercel.app/`
2. Open browser console (F12)
3. Login as admin
4. Make a change to the schedule
5. Check console - should see no errors
6. Open site on your phone - changes should be there! ✅

## Verify It's Working

1. Make a change on your PC
2. Check your GitHub repo - you should see a new commit updating `data/schedule.json`
3. Check on your phone - should see the same changes

## Troubleshooting

### Still using localStorage?
- Check browser console (F12) for errors
- Verify all 3 environment variables are set
- Make sure you redeployed after adding variables

### "GitHub not configured" error?
- Make sure `GITHUB_REPO` and `GITHUB_TOKEN` are set
- Check the repo format: `username/repo-name`

### Changes not syncing?
- Check GitHub repo - do you see commits when you save?
- If no commits, the API isn't writing to GitHub
- Check Vercel function logs for errors

---

**That's it!** After these 5 steps, all devices will see the same data! 🎉

