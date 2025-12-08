# Debug: GitHub API Not Updating JSON

## What I Fixed

1. ✅ Changed authorization from `token` to `Bearer` (correct GitHub API format)
2. ✅ Improved error messages in browser console
3. ✅ Better error logging in API

## How to Debug

### Step 1: Check Browser Console
1. Open your site
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. Login and make a change to the schedule
5. Look for error messages

### Step 2: Check What Error You See

**If you see: "GitHub not configured"**
- Go to Vercel → Settings → Environment Variables
- Make sure `GITHUB_REPO` and `GITHUB_TOKEN` are set
- Redeploy after adding them

**If you see: "GitHub API error: 401"**
- Your `GITHUB_TOKEN` is invalid or expired
- Create a new token at: https://github.com/settings/tokens
- Update `GITHUB_TOKEN` in Vercel
- Redeploy

**If you see: "GitHub API error: 403"**
- Your token doesn't have `repo` scope
- Create a new token with `repo` scope
- Update `GITHUB_TOKEN` in Vercel
- Redeploy

**If you see: "GitHub API error: 404"**
- Check `GITHUB_REPO` format: should be `username/repo-name`
- Make sure the repo exists and is accessible
- Check that `data/schedule.json` exists in your repo

**If you see: "GitHub API error: 422"**
- The file might not exist yet
- Or there's a conflict (file was modified)
- Try committing `data/schedule.json` to your repo first

### Step 3: Verify Environment Variables

In Vercel → Settings → Environment Variables, you should have:

1. **GITHUB_REPO**
   - Format: `username/repo-name`
   - Example: `juanpaa/Evento`
   - ✅ Set for: Production, Preview, Development

2. **GITHUB_TOKEN**
   - Format: `ghp_xxxxxxxxxxxxx`
   - ✅ Set for: Production, Preview, Development

3. **GITHUB_BRANCH** (optional)
   - Format: `main` or `master`
   - ✅ Set for: Production, Preview, Development

### Step 4: Test the API Directly

Visit: `https://maldito-sur-page.vercel.app/api/schedule`

You should see JSON data. If you see an error, check the error message.

### Step 5: Check Vercel Function Logs

1. Go to Vercel → Your Project → **Functions** tab
2. Click on `api/schedule`
3. Check the logs for errors
4. Look for any GitHub API errors

### Step 6: Verify GitHub Token Permissions

1. Go to: https://github.com/settings/tokens
2. Find your token
3. Make sure it has:
   - ☑️ **repo** scope (Full control of private repositories)

### Step 7: Test GitHub API Manually

You can test if your token works:

```bash
# Replace with your values
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/data/schedule.json
```

If this returns 401 or 403, your token is wrong or doesn't have permissions.

## Common Issues

### Issue: "File doesn't exist"
**Solution**: Make sure `data/schedule.json` is committed to your repo:
```bash
git add data/schedule.json
git commit -m "Add schedule.json"
git push
```

### Issue: "SHA mismatch"
**Solution**: This happens if the file was modified. The API will retry automatically, but you might need to:
1. Pull latest changes
2. Make sure you're on the correct branch
3. Try saving again

### Issue: "Branch not found"
**Solution**: 
- Check `GITHUB_BRANCH` environment variable
- Make sure it matches your default branch (`main` or `master`)
- Or remove the variable (defaults to `main`)

## Still Not Working?

1. **Check Vercel Function Logs** - Most detailed error info
2. **Check Browser Console** - See what the frontend receives
3. **Verify Token** - Test it manually with curl
4. **Check Repo Access** - Make sure token has access to the repo

## Quick Test

After fixing, test:
1. Make a change on PC
2. Check browser console - should see "✅ Schedule saved successfully"
3. Check GitHub repo - should see a new commit
4. Check on phone - should see the changes

---

If you're still having issues, share:
- The error message from browser console
- The error from Vercel function logs
- Your environment variable names (not values!)


