// Vercel Serverless Function - proxies PUT requests to Planhat API
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PUT" && req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });
  try {
    const resp = await fetch("https://api.planhat.com/companies", {
      method: req.method,
      headers: { "Content-Type": "application/json", "Authorization": authHeader },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    return res.status(resp.ok ? 200 : resp.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Proxy error" });
  }
};
