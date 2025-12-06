// Support both Vercel KV and Edge Config
// Dynamic imports to prevent 404 errors if packages aren't available

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

  // Determine storage type based on available environment variables
  function getStorageType() {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return 'kv';
    } else if (process.env.EDGE_CONFIG) {
      return 'edge-config';
    }
    return 'edge-config'; // Default to edge-config
  }

  const storageType = getStorageType();

  try {
    if (req.method === 'GET') {
      let data = null;

      if (storageType === 'kv') {
        // Use KV storage
        try {
          const { kv } = await import('@vercel/kv');
          data = await kv.get(SCHEDULE_KEY);
        } catch (e) {
          console.error('KV read error:', e.message);
          data = null;
        }
      } else {
        // Use Edge Config
        try {
          const { get } = await import('@vercel/edge-config');
          data = await get(SCHEDULE_KEY);
        } catch (e) {
          // Edge Config might not have the key yet or not configured
          console.log('Edge Config read error:', e.message);
          data = null;
        }
      }
      
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

      if (storageType === 'kv') {
        // Save to KV store
        try {
          const { kv } = await import('@vercel/kv');
          await kv.set(SCHEDULE_KEY, scheduleData);
          return res.status(200).json({ success: true, message: 'Schedule saved successfully' });
        } catch (e) {
          console.error('KV write error:', e.message);
          return res.status(500).json({ error: 'Failed to save to KV', details: e.message });
        }
      } else {
        // Use Edge Config
        // Extract Edge Config ID from connection string
        // EDGE_CONFIG format: https://edge-config.vercel.com/ecfg_xxx?token=xxx
        let edgeConfigId = process.env.EDGE_CONFIG_ID;
        
        if (!edgeConfigId && process.env.EDGE_CONFIG) {
          // Extract ID from URL: https://edge-config.vercel.com/ecfg_xxx?token=xxx
          const match = process.env.EDGE_CONFIG.match(/ecfg_[a-zA-Z0-9_-]+/);
          if (match) {
            edgeConfigId = match[0];
          }
        }
        
        const vercelApiToken = process.env.VERCEL_API_TOKEN;

        if (!edgeConfigId) {
          return res.status(500).json({ 
            error: 'Could not extract Edge Config ID from EDGE_CONFIG. Please set EDGE_CONFIG_ID environment variable with your Edge Config ID (e.g., ecfg_xxx).' 
          });
        }

        if (!vercelApiToken) {
          return res.status(500).json({ 
            error: 'Edge Config writes require VERCEL_API_TOKEN. Please create a Vercel API token at vercel.com/account/tokens and add it as VERCEL_API_TOKEN environment variable.' 
          });
        }

        try {
          const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${vercelApiToken}`,
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
            return res.status(200).json({ success: true, message: 'Schedule saved successfully' });
          } else {
            throw new Error(result.error || 'Failed to update Edge Config');
          }
        } catch (e) {
          console.error('Edge Config write error:', e.message);
          return res.status(500).json({ error: 'Failed to save to Edge Config', details: e.message });
        }
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling schedule data:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
