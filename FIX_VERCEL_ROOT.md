# Fix Vercel Root Directory Error

## The Problem

Vercel is looking for `package.json` in `/vercel/path1/` but it's in the root directory. This means Vercel has the wrong root directory configured.

## Solution: Fix Root Directory in Vercel Settings

### Step 1: Go to Vercel Project Settings

1. Open [vercel.com](https://vercel.com)
2. Go to your project: **maldito-sur-page**
3. Click **Settings** (top navigation)
4. Click **General** (left sidebar)

### Step 2: Fix Root Directory

1. Scroll down to **"Root Directory"** section
2. **Clear the field** (make it empty) or set it to `.` (dot)
3. Click **Save**

**Important:** The root directory should be empty or `.` (not `/vercel/path1` or any other path)

### Step 3: Fix Other Settings

While you're in General settings, also check:

1. **Framework Preset**: Should be **"Other"** or auto-detected
2. **Build Command**: Can be empty or `npm install`
3. **Output Directory**: Should be `public` (since your files are in `public/` folder)
4. **Install Command**: Should be `npm install` or auto

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Alternative: Check .vercel Folder

If you have a `.vercel` folder, check if it has incorrect configuration:

```bash
# Check if .vercel folder exists
ls -la .vercel

# If it exists, you might need to delete it and re-link
rm -rf .vercel
vercel link
```

## Verify File Structure

Your project should have this structure:

```
your-project/ (root)
├── api/
│   └── schedule.js
├── public/
│   ├── index.html
│   └── image.jpg
├── package.json        ← Should be here
└── vercel.json
```

## Quick Fix Checklist

- [ ] Go to Vercel → Settings → General
- [ ] Clear or set Root Directory to `.` (empty or dot)
- [ ] Set Output Directory to `public`
- [ ] Save settings
- [ ] Redeploy project
- [ ] Check deployment logs for errors

## Still Not Working?

If the error persists:

1. **Delete and re-link project:**
   ```bash
   rm -rf .vercel
   vercel link
   ```

2. **Check Vercel deployment logs:**
   - Go to Deployments → Latest deployment → View logs
   - Look for where it's trying to find package.json

3. **Verify package.json is committed:**
   ```bash
   git ls-files package.json
   ```
   Should show: `package.json`

4. **Force push to trigger new deployment:**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

---

After fixing the root directory, Vercel should find `package.json` in the correct location and the deployment should succeed.

