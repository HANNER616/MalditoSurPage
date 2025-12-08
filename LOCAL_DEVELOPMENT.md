# Local Development Setup

## Option 1: Using Vercel CLI (Recommended - Full API Support)

This method runs the full Vercel environment locally, including API routes.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Or use npx (no installation needed):
```bash
npx vercel dev
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project (First Time Only)

```bash
vercel link
```

Follow the prompts:
- Set up and develop? **Yes**
- Which scope? (Select your account)npo
- Link to existing project? **Yes** (if already deployed)
- What's the name of your project? (Enter your project name)

### Step 4: Start Development Server

**Important:** Use `vercel dev` directly (not `npm run dev`):

```bash
vercel dev
```

This avoids recursive invocation errors.

### Step 5: Access Your App

- Open: `http://localhost:3000`
- API routes: `http://localhost:3000/api/schedule`
- Test endpoint: `http://localhost:3000/api/test`

### Environment Variables for Local Development

Create a `.env.local` file in the root directory:

```bash
# .env.local
EDGE_CONFIG=https://edge-config.vercel.com/ecfg_xxxxxxxxxxxxx?token=xxx
EDGE_CONFIG_ID=ecfg_xxxxxxxxxxxxx
VERCEL_API_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** `.env.local` is already in `.gitignore` and won't be committed.

---

## Option 2: Simple HTTP Server (Quick Test - No API)

This method only serves static files. API routes won't work, but you can test the UI.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Server

```bash
npm run serve
```

Or:
```bash
npx http-server public -p 3000 -o
```

### Step 3: Access Your App

- Opens automatically in browser at: `http://localhost:3000`
- **Note:** API routes won't work with this method

---

## Troubleshooting

### "vercel: command not found"

**Solution:**
```bash
npm install -g vercel
```

Or use npx:
```bash
npx vercel dev
```

### "Project not linked"

**Solution:**
```bash
vercel link
```

Follow the prompts to link your project.

### "Port 3000 already in use"

**Solution:**
- Kill the process using port 3000, or
- Use a different port:
  ```bash
  vercel dev -p 3001
  ```

### API Routes Return 404 Locally

**Check:**
1. Are you using `vercel dev` (not `npm run serve`)?
2. Is the `api/` folder in the root directory?
3. Check terminal for any errors

### Environment Variables Not Working

**Check:**
1. Is `.env.local` in the root directory?
2. Did you restart `vercel dev` after creating `.env.local`?
3. Are variable names correct? (EDGE_CONFIG, VERCEL_API_TOKEN, etc.)

### Edge Config Not Working Locally

**Note:** Edge Config requires:
- `EDGE_CONFIG` environment variable set
- `VERCEL_API_TOKEN` for writes
- These should be in `.env.local` for local development

---

## Quick Start Commands

```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Login (one time)
vercel login

# Link project (one time, if not already linked)
vercel link

# Start development server (use vercel dev directly)
vercel dev
```

---

## File Structure for Local Dev

```
your-project/
├── .env.local          ← Create this for local env variables
├── api/
│   └── schedule.js
├── public/
│   ├── index.html
│   └── image.jpg
└── package.json
```

---

## Testing Checklist

- [ ] Vercel CLI installed
- [ ] Logged in to Vercel
- [ ] Project linked
- [ ] `.env.local` created with environment variables
- [ ] `npm run dev` starts server
- [ ] Can access `http://localhost:3000`
- [ ] Can access `http://localhost:3000/api/test`
- [ ] Can access `http://localhost:3000/api/schedule`
- [ ] API returns data (or default data if Edge Config not set)

---

## Next Steps

After local development works:
1. Test your changes locally
2. Commit and push to Git
3. Vercel will auto-deploy
4. Test on production URL

---

For production deployment issues, see: `VERIFY_DEPLOYMENT.md`

