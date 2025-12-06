# Band Schedule Application

A web application for managing and displaying band schedules with a public view and admin editor panel.

## Features

- **Public Schedule View**: Clean, responsive display of all bands with calculated time ranges
- **Admin Editor**: Login-protected panel to manage schedule settings and band information
- **Data Persistence**: Uses Vercel KV (Redis) for consistent data storage across all users
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern, visually appealing dark theme with smooth animations

## Deployment to Vercel

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, for local testing)

### Step 1: Set up Vercel KV

**Option A: Through Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com) and log in
2. Click on your **project** (or create a new one if you haven't deployed yet)
3. In the project dashboard, look for one of these tabs:
   - **"Storage"** tab (if visible in the top navigation)
   - **"Integrations"** tab → Search for "KV" or "Redis"
   - **"Settings"** → **"Storage"** section
4. Click **"Create Database"** or **"Add Integration"**
5. Select **"KV"** (Key-Value store / Redis)
6. Follow the prompts to create the KV database
7. After creation, you'll see the connection details:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - Copy these values

**Option B: Through Vercel CLI**

If you can't find it in the dashboard, you can also create it via CLI:
```bash
vercel kv create
```

**Note**: If you still can't find the Storage/Integrations option, you may need to:
- Make sure you're on a paid plan (KV requires a paid Vercel plan)
- Or use the alternative solution below (file-based storage)

### Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token (optional)
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Vercel will automatically detect the project
4. Add the environment variables in the project settings
5. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Step 4: Verify Deployment

1. Visit your deployed URL
2. The schedule should load from the Vercel KV database
3. Login as admin (username: `admin`, password: `admin`)
4. Make changes to the schedule
5. Refresh the page - changes should persist
6. Open the page in a different browser/device - data should be consistent

## Local Development

### Prerequisites

- Node.js 18+ installed
- Vercel KV database set up

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Vercel KV credentials:
```
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

3. Run the development server:
```bash
vercel dev
```

4. Open `http://localhost:3000` in your browser

## Project Structure

```
.
├── api/
│   └── schedule.js          # API endpoint for schedule data (GET/POST)
├── index.html               # Main application file
├── image.jpg                # Background image
├── package.json             # Dependencies
└── README.md                # This file
```

## API Endpoints

### GET `/api/schedule`
Retrieves the current schedule data from Vercel KV.

**Response:**
```json
{
  "startTime": "18:00",
  "setupMinutes": 15,
  "showMinutes": 30,
  "bands": ["Band 1", "Band 2", "Band 3"]
}
```

### POST `/api/schedule`
Saves schedule data to Vercel KV.

**Request Body:**
```json
{
  "startTime": "18:00",
  "setupMinutes": 15,
  "showMinutes": 30,
  "bands": ["Band 1", "Band 2", "Band 3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Schedule saved successfully"
}
```

## Data Consistency

The application uses Vercel KV (Redis) for data storage, ensuring:

- **Consistent data across all users**: All visitors see the same schedule
- **Real-time updates**: Changes made by admin are immediately available to all users
- **Persistence**: Data survives server restarts and deployments
- **Fallback mechanism**: If API fails, the app falls back to localStorage (per-browser)

## Troubleshooting

### Data not persisting

1. Check that Vercel KV is properly configured in your project
2. Verify environment variables are set correctly
3. Check browser console for API errors
4. Ensure the `/api/schedule` endpoint is accessible

### API errors

1. Verify Vercel KV credentials in environment variables
2. Check Vercel function logs in the dashboard
3. Ensure `@vercel/kv` package is installed

## License

This project is open source and available for use.

