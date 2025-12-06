# JSON Storage Setup Guide

Your app now uses a JSON file (`data/schedule.json`) stored in your GitHub repository for data consistency. All users will read/write from the same file.

## Step 1: Remove Edge Config Integration (Optional)

If you want to clean up, you can remove the Edge Config integration:
1. Go to Vercel project → Settings → Integrations
2. Find Edge Config integration
3. Click "Remove" or "Delete"

**Note**: You don't have to remove it - it won't interfere with the new JSON storage.

## Step 2: Create GitHub Personal Access Token

### 2.1: Go to GitHub Settings
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Or: GitHub → Your Profile (top right) → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**

### 2.2: Generate New Token
1. Click **"Generate new token"** → **"Generate new token (classic)"**
2. Give it a name: `Band Schedule App`
3. Set expiration (or "No expiration" for production)
4. Select scopes:
   - ☑️ **`repo`** (Full control of private repositories)
     - This gives read/write access to your repository
5. Click **"Generate token"**

### 2.3: Copy the Token
⚠️ **IMPORTANT**: Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- You won't be able to see it again
- Save it somewhere safe

## Step 3: Get Your Repository Name

You need your repository in the format: `username/repo-name`

Example:
- If your repo URL is: `https://github.com/juanpaa/Evento`
- Then the format is: `juanpaa/Evento`

## Step 4: Add Environment Variables to Vercel

### 4.1: Go to Environment Variables
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**

### 4.2: Add GITHUB_REPO
1. Click **"Add New"**
2. Fill in:
   - **Name**: `GITHUB_REPO`
   - **Value**: Your repo in format `username/repo-name` (e.g., `juanpaa/Evento`)
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
3. Click **"Save"**

### 4.3: Add GITHUB_TOKEN
1. Click **"Add New"** again
2. Fill in:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: The GitHub token you created (starts with `ghp_`)
   - **Environment**: Select all three (Production, Preview, Development)
3. Click **"Save"**

### 4.4: Add GITHUB_BRANCH (Optional)
1. Click **"Add New"** again
2. Fill in:
   - **Name**: `GITHUB_BRANCH`
   - **Value**: Your default branch name (usually `main` or `master`)
   - **Environment**: Select all three
3. Click **"Save"**

**Note**: If you don't set `GITHUB_BRANCH`, it defaults to `main`.

## Step 5: Commit the JSON File

Make sure `data/schedule.json` is committed to your repository:

1. The file should be at: `data/schedule.json` in your repo
2. If it's not there, commit and push it:
   ```bash
   git add data/schedule.json
   git commit -m "Add schedule.json data file"
   git push
   ```

## Step 6: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the three dots (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger deployment

## Step 7: Verify It's Working

### Test Reading:
1. Visit: `https://maldito-sur-page.vercel.app/api/schedule`
2. You should see JSON data from `data/schedule.json`

### Test Writing:
1. Go to your site: `https://maldito-sur-page.vercel.app/`
2. Login as admin (username: `admin`, password: `admin`)
3. Make a change to the schedule
4. Check browser console (F12) - should see no errors
5. Refresh the page - changes should persist
6. Check your GitHub repo - you should see a new commit updating `data/schedule.json`
7. Open the site in another browser/device - should see the same data ✅

## How It Works

- **Reading**: The API reads `data/schedule.json` from your GitHub repository
- **Writing**: The API updates the file via GitHub API, creating a new commit
- **Consistency**: All users read/write from the same file, so data is always consistent
- **History**: Every change creates a commit, so you have a full history of changes

## Troubleshooting

### "GitHub not configured" error
- Make sure `GITHUB_REPO` and `GITHUB_TOKEN` are set in environment variables
- Verify the repo format is correct: `username/repo-name`
- Redeploy after adding variables

### "GitHub API error: 404"
- Check that `data/schedule.json` exists in your repository
- Verify the `GITHUB_REPO` format is correct
- Make sure the token has `repo` scope

### "GitHub API error: 401" (Unauthorized)
- Your `GITHUB_TOKEN` is invalid or expired
- Create a new token and update the environment variable
- Make sure the token has `repo` scope

### "GitHub API error: 403" (Forbidden)
- Your token doesn't have the right permissions
- Make sure you selected `repo` scope when creating the token
- If it's a private repo, the token needs `repo` scope

### Changes not persisting
- Check browser console for errors
- Verify all environment variables are set
- Make sure you redeployed after adding variables
- Check GitHub repo - you should see commits when you save

## Environment Variables Summary

You need these 3 environment variables:

1. **GITHUB_REPO** = `username/repo-name` (e.g., `juanpaa/Evento`)
2. **GITHUB_TOKEN** = `ghp_xxx` (GitHub personal access token)
3. **GITHUB_BRANCH** = `main` (optional, defaults to `main`)

All should be set for: Production, Preview, and Development

## Benefits of JSON Storage

✅ **Data Consistency**: All users see the same data  
✅ **Version History**: Every change is a Git commit  
✅ **Simple**: Just a JSON file, easy to understand  
✅ **Free**: No database costs  
✅ **Backup**: Your data is in your Git repository  
✅ **Transparent**: You can see all changes in GitHub  

## Security Note

- The GitHub token has access to your repository
- Keep it secure and don't share it
- If compromised, revoke it immediately and create a new one
- Consider using a token with minimal permissions (just `repo` scope)

---

That's it! Your app now uses JSON file storage with full data consistency! 🎉

