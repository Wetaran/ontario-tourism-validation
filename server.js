const express = require('express');
const https = require('https');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(express.json());
app.use(express.static('.'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', webhook: DISCORD_WEBHOOK_URL ? 'configured' : 'missing' });
});

// Interview form submission
app.post('/api/interviews', (req, res) => {
  const {
    businessName,
    businessType,
    location,
    contactName,
    contactPhone,
    currentRentals,
    guestUsagePercent,
    managementMethod,
    painPoints,
    interestLevel,
    pricingPreference,
    pilotWillingness,
    notes
  } = req.body;

  console.log('📝 Interview received:', businessName);

  if (!DISCORD_WEBHOOK_URL) {
    console.error('❌ DISCORD_WEBHOOK_URL not set in environment variables');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  // Build Discord embed
  const embed = {
    title: `🎯 New Partner Interview: ${businessName}`,
    color: 5814783, // Teal
    fields: [
      { name: 'Business Type', value: businessType || 'N/A', inline: true },
      { name: 'Location', value: location || 'N/A', inline: true },
      { name: 'Contact Name', value: contactName || 'N/A', inline: true },
      { name: 'Contact Phone', value: contactPhone || 'N/A', inline: true },
      { name: 'Current Rentals', value: currentRentals || 'N/A', inline: true },
      { name: 'Guest Usage %', value: guestUsagePercent || 'N/A', inline: true },
      { name: 'Management Method', value: managementMethod || 'N/A', inline: false },
      { name: '⚡ Pain Points', value: painPoints || 'None mentioned', inline: false },
      { name: '📊 Interest Level', value: `${interestLevel}/10`, inline: true },
      { name: '💰 Pricing Preference', value: pricingPreference || 'N/A', inline: true },
      { name: '🚀 Pilot Willing', value: pilotWillingness || 'N/A', inline: true },
      { name: '📝 Notes', value: notes || 'None', inline: false }
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Ontario Tourism Partner Validation' }
  };

  const payload = JSON.stringify({ embeds: [embed] });

  // Parse webhook URL
  const url = new URL(DISCORD_WEBHOOK_URL);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  // Send to Discord
  const req = https.request(options, (discordRes) => {
    let data = '';
    discordRes.on('data', (chunk) => { data += chunk; });
    discordRes.on('end', () => {
      if (discordRes.statusCode === 204) {
        console.log('✅ Discord webhook sent successfully');
        res.json({
          success: true,
          message: `Interview for "${businessName}" saved successfully!`,
          discordStatus: 'sent'
        });
      } else {
        console.error(`❌ Discord error (${discordRes.statusCode}):`, data);
        res.status(500).json({
          success: false,
          error: `Discord webhook failed: ${discordRes.statusCode}`
        });
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Webhook request error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  });

  req.write(payload);
  req.end();
});

// Serve form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Form: http://localhost:${PORT}`);
  console.log(`🔗 Discord webhook: ${DISCORD_WEBHOOK_URL ? '✅ configured' : '❌ missing'}`);
});
