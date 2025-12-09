// Edge Config storage for data persistence
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
  const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
  const EDGE_CONFIG = process.env.EDGE_CONFIG;
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

  // Default data if nothing exists
  const defaultData = {
    startTime: '18:00',
    setupMinutes: 15,
    showMinutes: 30,
    bands: ['Band 1', 'Band 2', 'Band 3']
  };

  // Extract Edge Config ID from connection string if not provided
  function getEdgeConfigId() {
    if (EDGE_CONFIG_ID) {
      return EDGE_CONFIG_ID;
    }
    if (EDGE_CONFIG) {
      const match = EDGE_CONFIG.match(/ecfg_[a-zA-Z0-9_-]+/);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  const edgeConfigId = getEdgeConfigId();

  try {
    if (req.method === 'GET') {
      // Read from Edge Config
      if (!EDGE_CONFIG) {
        return res.status(200).json({
          ...defaultData,
          _warning: 'Edge Config not configured - data not synced across devices'
        });
      }

      try {
        const { get } = await import('@vercel/edge-config');
        const data = await get(SCHEDULE_KEY);
        
        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(200).json(defaultData);
        }
      } catch (error) {
        console.error('Error reading from Edge Config:', error.message);
        return res.status(200).json(defaultData);
      }
    } else if (req.method === 'POST') {
      // Save schedule data
      const scheduleData = req.body;
      
      if (!scheduleData || typeof scheduleData !== 'object') {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      if (!edgeConfigId) {
        return res.status(500).json({ 
          error: 'Edge Config ID not found. Please set EDGE_CONFIG_ID environment variable.' 
        });
      }

      if (!VERCEL_API_TOKEN) {
        return res.status(500).json({ 
          error: 'VERCEL_API_TOKEN not set. Please create a Vercel API token.' 
        });
      }

      try {
        const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              {
                operation: 'upsert',
                key: SCHEDULE_KEY,
                value: scheduleData,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Edge Config API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        if (result.status === 'ok') {
          return res.status(200).json({ 
            success: true, 
            message: 'Schedule saved successfully',
            timestamp: new Date().toISOString()
          });
        } else {
          throw new Error(result.error || 'Failed to update Edge Config');
        }
      } catch (error) {
        console.error('Error writing to Edge Config:', error.message);
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
