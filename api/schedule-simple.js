// Simple file-based storage alternative (no KV required)
// This uses a JSON file stored in Vercel's file system
// Note: This is a simpler alternative but has limitations (read-only in production)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const fs = require('fs').promises;
  const path = require('path');
  const dataFile = path.join(process.cwd(), 'data', 'schedule.json');

  try {
    if (req.method === 'GET') {
      // Get schedule data
      try {
        const fileData = await fs.readFile(dataFile, 'utf8');
        const data = JSON.parse(fileData);
        return res.status(200).json(data);
      } catch (error) {
        // Return default data if file doesn't exist
        const defaultData = {
          startTime: '18:00',
          setupMinutes: 15,
          showMinutes: 30,
          bands: ['Band 1', 'Band 2', 'Band 3']
        };
        return res.status(200).json(defaultData);
      }
    } else if (req.method === 'POST') {
      // Save schedule data
      const scheduleData = req.body;
      
      // Validate data structure
      if (!scheduleData || typeof scheduleData !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Ensure data directory exists
      const dataDir = path.dirname(dataFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      // Save to file
      await fs.writeFile(dataFile, JSON.stringify(scheduleData, null, 2), 'utf8');
      
      return res.status(200).json({ success: true, message: 'Schedule saved successfully' });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling schedule data:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

