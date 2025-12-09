# Complete Vercel Project Settings Guide

Follow these exact settings to configure your Vercel project correctly.

## Step 1: Access Project Settings

1. Go to [vercel.com](https://vercel.com)
2. Click on your project: **maldito-sur-page**
3. Click **Settings** (top navigation bar)
4. Click **General** (left sidebar)

---

## General Settings

### Framework Preset
- **Value:** `Other` or `Vite` (or leave as auto-detected)
- **Location:** General → Framework Preset

### Root Directory
- **Value:** `.` (single dot) or **leave EMPTY**
- **Location:** General → Root Directory
- **Important:** This must be empty or `.` - NOT `/vercel/path1` or any other path

### Build and Development Settings

#### Build Command
- **Value:** Leave **EMPTY** or set to: `npm install`
- **Location:** General → Build Command

#### Development Command
- **Value:** Leave **EMPTY**
- **Location:** General → Development Command
- **Important:** Must be empty to avoid recursive `vercel dev` errors

#### Output Directory
- **Value:** `public`
- **Location:** General → Output Directory
- **Reason:** Your static files (`index.html`, `image.jpg`) are in the `public/` folder

#### Install Command
- **Value:** `npm install` or leave as default
- **Location:** General → Install Command

---

## Environment Variables

Go to: **Settings** → **Environment Variables**

### Required Variables:

#### 1. EDGE_CONFIG
- **Name:** `EDGE_CONFIG`
- **Value:** `https://edge-config.vercel.com/ecfg_xxxxxxxxxxxxx?token=xxx`
  - Get this from: Storage → Edge Config → Connection URL
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **Save**

#### 2. EDGE_CONFIG_ID (Optional but Recommended)
- **Name:** `EDGE_CONFIG_ID`
- **Value:** `ecfg_xxxxxxxxxxxxx` (just the ID part, e.g., `ecfg_abc123`)
  - Extract from EDGE_CONFIG URL
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **Save**

#### 3. VERCEL_API_TOKEN
- **Name:** `VERCEL_API_TOKEN`
- **Value:** `vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Create at: [vercel.com/account/tokens](https://vercel.com/account/tokens)
- **Environment:** ☑️ Production ☑️ Preview ☑️ Development
- Click **Save**

---

## Functions Settings

Go to: **Settings** → **Functions**

### Function Region
- **Value:** Default (or choose closest to your users)
- **Location:** Functions → Function Region

### Function Execution Timeout
- **Value:** Default (10 seconds) or increase if needed
- **Location:** Functions → Function Execution Timeout

### Function Memory
- **Value:** Default (1024 MB) or adjust if needed
- **Location:** Functions → Function Memory

---

## Git Settings (If Connected)

Go to: **Settings** → **Git**

### Production Branch
- **Value:** `main` or `master` (match your default branch)
- **Location:** Git → Production Branch

### Auto-deploy
- **Value:** ☑️ Enabled (recommended)
- **Location:** Git → Auto-deploy

---

## Deployment Protection

Go to: **Settings** → **Deployment Protection**

### Production Deployment Protection
- **Value:** Disabled (unless you want manual approval)
- **Location:** Deployment Protection → Production

---

## Complete Settings Summary

Copy this checklist and verify each setting:

### General Settings
- [ ] **Framework Preset:** `Other` or auto
- [ ] **Root Directory:** `.` or EMPTY
- [ ] **Build Command:** EMPTY
- [ ] **Development Command:** EMPTY
- [ ] **Output Directory:** `public`
- [ ] **Install Command:** `npm install` or default

### Environment Variables
- [ ] **EDGE_CONFIG:** Full URL from Edge Config
- [ ] **EDGE_CONFIG_ID:** Just the ID (ecfg_xxx)
- [ ] **VERCEL_API_TOKEN:** Token from account settings
- [ ] All set for: Production, Preview, Development

### Functions
- [ ] **Function Region:** Default or closest
- [ ] **Timeout:** Default (10s)
- [ ] **Memory:** Default (1024 MB)

### Git (if connected)
- [ ] **Production Branch:** `main` or `master`
- [ ] **Auto-deploy:** Enabled

---

## Step-by-Step Configuration

### 1. Fix Root Directory (CRITICAL)

1. Go to: **Settings** → **General**
2. Find **"Root Directory"**
3. **Delete any value** (make it completely empty)
4. Or type: `.` (single dot)
5. Click **Save**

### 2. Set Output Directory

1. In the same **General** settings
2. Find **"Output Directory"**
3. Type: `public`
4. Click **Save**

### 3. Clear Development Command

1. In **General** settings
2. Find **"Development Command"**
3. **Delete any value** (make it empty)
4. Click **Save**

### 4. Add Environment Variables

1. Go to: **Settings** → **Environment Variables**
2. Add each variable (EDGE_CONFIG, EDGE_CONFIG_ID, VERCEL_API_TOKEN)
3. Make sure all are set for Production, Preview, and Development
4. Click **Save** after each one

### 5. Redeploy

1. Go to: **Deployments** tab
2. Click three dots (⋯) on latest deployment
3. Click **"Redeploy"**
4. Wait for completion

---

## Verification Checklist

After setting everything up:

- [ ] Root Directory is empty or `.`
- [ ] Output Directory is `public`
- [ ] Development Command is empty
- [ ] All 3 environment variables are set
- [ ] All variables set for all environments
- [ ] Project redeployed
- [ ] Deployment successful (green checkmark)
- [ ] Can access: `https://maldito-sur-page.vercel.app/`
- [ ] Can access: `https://maldito-sur-page.vercel.app/api/test`
- [ ] Can access: `https://maldito-sur-page.vercel.app/api/schedule`

---

## Troubleshooting

### Still Getting Root Directory Error?

1. **Double-check Root Directory:**
   - Must be completely empty OR just `.`
   - No spaces, no paths, nothing else

2. **Check .vercel folder:**
   ```bash
   # If .vercel folder exists, check its contents
   cat .vercel/project.json
   ```
   - If it has wrong root, delete `.vercel` folder and re-link:
     ```bash
     rm -rf .vercel
     vercel link
     ```

3. **Force redeploy:**
   - Make a small change to any file
   - Commit and push
   - This triggers a fresh deployment

### Still Getting 404 on API Routes?

1. **Verify file structure:**
   - `api/schedule.js` exists in root
   - File is committed to Git
   - Check: `git ls-files api/schedule.js`

2. **Check function logs:**
   - Deployments → Latest → Functions → `api/schedule`
   - Look for errors

3. **Verify vercel.json:**
   - Should exist in root
   - Should have API route configuration

---

## Quick Reference: Exact Values

```
Root Directory: . (or empty)
Output Directory: public
Build Command: (empty)
Development Command: (empty)
Framework Preset: Other
Install Command: npm install

Environment Variables:
- EDGE_CONFIG = https://edge-config.vercel.com/ecfg_xxx?token=xxx
- EDGE_CONFIG_ID = ecfg_xxx
- VERCEL_API_TOKEN = vercel_xxx
```

---

## After Configuration

Once all settings are correct:

1. ✅ Deployment should succeed
2. ✅ No more root directory errors
3. ✅ API routes should work
4. ✅ Static files should serve from `/`
5. ✅ Edge Config should work (if variables are set)

---

**Important:** The most critical setting is **Root Directory** - it MUST be empty or `.` for Vercel to find your `package.json` and project files correctly.

