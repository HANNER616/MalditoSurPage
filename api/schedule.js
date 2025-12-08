// Edge Config storage for data persistence
// Uses Vercel Edge Config for fast, global data storage

export default async function handler(req, res) {
  // Dynamic import to prevent 404 if package isn't available
  let get;
  try {
    const edgeConfig = await import('@vercel/edge-config');
    get = edgeConfig.get;
  } catch (e) {
    console.error('Failed to import @vercel/edge-config:', e.message);
  }
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
      // Extract ID from URL: https://edge-config.vercel.com/ecfg_xxx?token=xxx
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
        console.warn('Edge Config not configured - using default data. Set EDGE_CONFIG environment variable.');
        return res.status(200).json({
          ...defaultData,
          _warning: 'Edge Config not configured - data not synced across devices'
        });
      }

      try {
        if (!get) {
          throw new Error('Edge Config package not available');
        }
        
        const data = await get(SCHEDULE_KEY);
        
        if (data) {
          return res.status(200).json(data);
        } else {
          // Return default data if key doesn't exist
          return res.status(200).json(defaultData);
        }
      } catch (error) {
        console.error('Error reading from Edge Config:', error.message);
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

      if (!edgeConfigId) {
        return res.status(500).json({ 
          error: 'Edge Config ID not found. Please set EDGE_CONFIG_ID environment variable or ensure EDGE_CONFIG contains the ID (ecfg_xxx).' 
        });
      }

      if (!VERCEL_API_TOKEN) {
        return res.status(500).json({ 
          error: 'VERCEL_API_TOKEN not set. Please create a Vercel API token and add it as VERCEL_API_TOKEN environment variable.' 
        });
      }

      try {
        // Write to Edge Config using Vercel API
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
          let errorMessage = `Edge Config API error: ${response.status}`;
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage += ` - ${errorData.error || errorText}`;
          } catch {
            errorMessage += ` - ${errorText}`;
          }
          
          throw new Error(errorMessage);
        }

        const result = await response.json();
        
        if (result.status === 'ok') {
          return res.status(200).json({ 
            success: true, 
            message: 'Schedule saved successfully to Edge Config',
            timestamp: new Date().toISOString()
          });
        } else {
          throw new Error(result.error || 'Failed to update Edge Config');
        }
      } catch (error) {
        console.error('Error writing to Edge Config:', error.message);
        return res.status(500).json({ 
          error: 'Failed to save schedule to Edge Config', 
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
