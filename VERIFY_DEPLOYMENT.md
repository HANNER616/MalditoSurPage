# Verify API Deployment - Fix 404 Error

## Step 1: Test Simple Endpoint First

Before testing `/api/schedule`, test the simple endpoint:

**Visit:** `https://maldito-sur-page.vercel.app/api/test`

**Expected Result:**
```json
{
  "message": "API is working!",
  "timestamp": "2024-..."
}
```

### If `/api/test` works:
✅ API routes are functioning  
❌ The issue is with `schedule.js` specifically  

### If `/api/test` also 404s:
❌ Vercel isn't recognizing your `api/` folder  
→ Check deployment logs and file structure  

---

## Step 2: Check Vercel Deployment

### Check Deployment Status
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Check the latest deployment:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed (check logs)
   - ⏳ Building = Wait for it to finish

### Check Function Logs
1. Go to **Functions** tab (or click on deployment)
2. Look for `api/schedule` function
3. Check for errors:
   - Import errors
   - Syntax errors
   - Missing dependencies

---

## Step 3: Verify File Structure

Your project should have:
```
your-project/
├── api/
│   ├── schedule.js    ← Must exist
│   └── test.js        ← Test endpoint
├── public/
│   ├── index.html
│   └── image.jpg
└── package.json
```

### Verify Files Are Committed
```bash
git status
git log --oneline -5
```

Make sure `api/schedule.js` is in your Git repository.

---

## Step 4: Check Package Installation

1. Go to Vercel → Settings → **General**
2. Check **"Install Command"** - should be `npm install` or auto
3. Check deployment logs for:
   - `npm install` running
   - `@vercel/edge-config` being installed
   - Any installation errors

---

## Step 5: Force Redeploy

Sometimes Vercel needs a fresh deployment:

1. **Option A: Make a small change**
   - Add a comment to `api/schedule.js`
   - Commit and push
   - Triggers new deployment

2. **Option B: Redeploy from Dashboard**
   - Deployments → Latest deployment → Three dots → Redeploy

---

## Step 6: Check Vercel Function Configuration

1. Go to Vercel → Settings → **Functions**
2. Verify:
   - Functions are enabled
   - No function size limits exceeded
   - Runtime is Node.js (auto-detected)

---

## Step 7: Test Locally (Optional)

If you have Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Then visit: `http://localhost:3000/api/schedule`

If it works locally but not on Vercel:
- Check environment variables
- Check deployment configuration

---

## Common Issues & Solutions

### Issue: "Cannot find module '@vercel/edge-config'"

**Solution:**
1. Check `package.json` has the dependency
2. Redeploy (Vercel will install it)
3. Check deployment logs for npm install errors

### Issue: File exists but 404

**Possible causes:**
1. File not committed to Git
2. Deployment didn't include the file
3. Vercel cache issue

**Solution:**
1. Verify file is in Git: `git ls-files api/schedule.js`
2. Force redeploy
3. Clear Vercel cache (if available)

### Issue: Syntax Error

**Solution:**
1. Check Vercel function logs
2. Test file locally with Node.js
3. Fix syntax errors
4. Redeploy

---

## Quick Diagnostic Commands

```bash
# Check if file exists
ls api/schedule.js

# Check if committed
git ls-files api/schedule.js

# Check syntax (if Node.js installed)
node -c api/schedule.js
```

---

## Still Not Working?

1. **Check Vercel Function Logs** - Most detailed info
2. **Test `/api/test` first** - Isolates the issue
3. **Check Deployment Logs** - Look for build errors
4. **Verify File in Git** - Make sure it's committed
5. **Force Redeploy** - Sometimes fixes caching issues

---

## Expected Behavior

After fixing:
- ✅ `/api/test` returns JSON
- ✅ `/api/schedule` returns JSON (default data if Edge Config not set up)
- ✅ No 404 errors in browser console

If you're still getting 404, share:
- Does `/api/test` work?
- What do Vercel function logs show?
- Is the file committed to Git?

