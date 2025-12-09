export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const defaultData = {
    startTime: '18:00',
    setupMinutes: 15,
    showMinutes: 30,
    bands: ['Band 1', 'Band 2', 'Band 3']
  };

  if (req.method === 'GET') {
    const EDGE_CONFIG = process.env.EDGE_CONFIG;
    
    if (!EDGE_CONFIG) {
      return res.status(200).json({ ...defaultData, _warning: 'Edge Config not configured' });
    }

    try {
      const { get } = await import('@vercel/edge-config');
      const data = await get('band_schedule_data');
      return res.status(200).json(data || defaultData);
    } catch (err) {
      return res.status(200).json(defaultData);
    }
  }

  if (req.method === 'POST') {
    const scheduleData = req.body;
    
    if (!scheduleData || typeof scheduleData !== 'object') {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID || process.env.EDGE_CONFIG?.match(/ecfg_[a-zA-Z0-9_-]+/)?.[0];
    const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

    if (!EDGE_CONFIG_ID || !VERCEL_API_TOKEN) {
      return res.status(500).json({ error: 'Edge Config not configured' });
    }

    try {
      const response = await fetch(`https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ operation: 'upsert', key: 'band_schedule_data', value: scheduleData }],
        }),
      });

      const result = await response.json();
      return res.status(response.ok ? 200 : 500).json(
        result.status === 'ok' 
          ? { success: true, message: 'Saved' }
          : { error: 'Save failed', details: result.error }
      );
    } catch (error) {
      return res.status(500).json({ error: 'Save failed', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
