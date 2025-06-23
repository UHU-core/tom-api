const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// โหลดตัวแปรจาก .env เช่น PORT
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// API ดึงราคาจาก Dexscreener ตาม Mint Address ของ UHU Token
app.get('/price', async (req, res) => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/9wDpfCPZkGqZqouZaWByjhNp138C9nRLz8sb8uvFK1gC');
    const data = await response.json();
    const price = data?.pairs?.[0]?.priceUsd;

    if (!price) throw new Error("Price not found");

    res.json({ status: 'ok', priceUsd: price });
  } catch (err) {
    console.error('Price error:', err);
    res.status(500).json({ error: err.message });
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`TOM API server running at http://localhost:${port}`);
});
