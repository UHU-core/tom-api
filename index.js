require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();
const port = process.env.PORT || 3000;

const RPC_URL = process.env.RPC_URL;
const connection = new Connection(RPC_URL);
const UHU_TOKEN_MINT = process.env.UHU_TOKEN_MINT;

app.get('/simulate', async (req, res) => {
  try {
    const slot = await connection.getSlot();
    res.json({ status: 'ok', currentSlot: slot });
  } catch (err) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Price endpoint
app.get('/price', async (req, res) => {
  try {
    const url = `https://api.dexscreener.com/latest/dex/pairs/solana/${UHU_TOKEN_MINT}`;
    const response = await fetch(url);
    const data = await response.json();
    const price = data?.pairs?.[0]?.priceUsd || null;

    if (!price) throw new Error('Price not found');

    res.json({ status: 'ok', priceUsd: price });
  } catch (err) {
    console.error('Price error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`TOM API server running at http://localhost:${port}`);
});