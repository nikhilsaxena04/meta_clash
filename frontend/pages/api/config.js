// frontend/pages/api/config.js

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8080';
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.WS_URL || 'ws://localhost:8080/api/ws';
  
  res.status(200).send(`
    window.__ENV__ = {
      NEXT_PUBLIC_API_URL: ${JSON.stringify(apiUrl)},
      NEXT_PUBLIC_WS_URL: ${JSON.stringify(wsUrl)}
    };
  `);
}
