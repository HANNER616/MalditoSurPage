// JSON file storage using GitHub API for data consistency
// The schedule.json file is stored in the repository and updated via GitHub API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const JSON_FILE_PATH = 'data/schedule.json';
  const GITHUB_REPO = process.env.GITHUB_REPO; // Format: owner/repo (e.g., username/repo-name)
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'; // or 'master'

  // Default data if file doesn't exist
  const defaultData = {
    startTime: '18:00',
    setupMinutes: 15,
    showMinutes: 30,
    bands: ['Band 1', 'Band 2', 'Band 3']
  };

  try {
    if (req.method === 'GET') {
      // Read from JSON file
      if (!GITHUB_REPO || !GITHUB_TOKEN) {
        // If GitHub not configured, return default data with warning
        console.warn('GitHub not configured - using default data. Set GITHUB_REPO and GITHUB_TOKEN environment variables.');
        return res.status(200).json({
          ...defaultData,
          _warning: 'GitHub not configured - data not synced across devices'
        });
      }

      try {
        // Get file from GitHub
        const fileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${JSON_FILE_PATH}?ref=${GITHUB_BRANCH}`;
        const response = await fetch(fileUrl, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Band-Schedule-App'
          }
        });

        if (response.status === 404) {
          // File doesn't exist, return default
          return res.status(200).json(defaultData);
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const fileData = await response.json();
        // Decode base64 content
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const data = JSON.parse(content);
        
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error reading from GitHub:', error.message);
        // Fallback to default data
        return res.status(200).json(defaultData);
      }
    } else if (req.method === 'POST') {
      // Save schedule data
      const scheduleData = req.body;
      
      // Validate data structure
      if (!scheduleData || typeof scheduleData !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      if (!GITHUB_REPO || !GITHUB_TOKEN) {
        return res.status(500).json({ 
          error: 'GitHub not configured. Please set GITHUB_REPO and GITHUB_TOKEN environment variables.' 
        });
      }

      try {
        // First, get the current file to get its SHA (required for update)
        const getFileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${JSON_FILE_PATH}?ref=${GITHUB_BRANCH}`;
        const getResponse = await fetch(getFileUrl, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Band-Schedule-App'
          }
        });

        let sha = null;
        if (getResponse.ok) {
          const fileData = await getResponse.json();
          sha = fileData.sha;
        }

        // Prepare the new file content
        const content = JSON.stringify(scheduleData, null, 2);
        const encodedContent = Buffer.from(content).toString('base64');

        // Update or create the file
        const updateUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${JSON_FILE_PATH}`;
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Band-Schedule-App'
          },
          body: JSON.stringify({
            message: `Update schedule data - ${new Date().toISOString()}`,
            content: encodedContent,
            branch: GITHUB_BRANCH,
            ...(sha && { sha: sha }) // Include SHA if updating existing file
          })
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`GitHub API error: ${updateResponse.status} - ${errorText}`);
        }

        const result = await updateResponse.json();
        
        return res.status(200).json({ 
          success: true, 
          message: 'Schedule saved successfully',
          commit: result.commit
        });
      } catch (error) {
        console.error('Error writing to GitHub:', error.message);
        return res.status(500).json({ 
          error: 'Failed to save schedule', 
          details: error.message 
        });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling schedule data:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
