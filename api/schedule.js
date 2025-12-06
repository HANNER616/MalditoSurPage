import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SCHEDULE_KEY = 'band_schedule_data';

  try {
    if (req.method === 'GET') {
      // Get schedule data
      const data = await kv.get(SCHEDULE_KEY);
      
      if (data) {
        return res.status(200).json(data);
      } else {
        // Return default data if nothing exists
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

      // Save to KV store
      await kv.set(SCHEDULE_KEY, scheduleData);
      
      return res.status(200).json({ success: true, message: 'Schedule saved successfully' });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling schedule data:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

