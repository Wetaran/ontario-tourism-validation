const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Location names
const locations = {
  'muskoka': 'Muskoka Region',
  'niagara': 'Niagara-on-the-Lake',
  'blue-mountains': 'Blue Mountains',
  'pec': 'Prince Edward County',
  'collingwood': 'Collingwood',
  'st-jacobs': 'St. Jacobs',
  'tobermory': 'Tobermory',
  'gananoque': 'Gananoque',
  'grand-bend': 'Grand Bend',
  'stratford': 'Stratford',
  'elora': 'Elora',
  'amherstburg': 'Amherstburg',
  'perth': 'Perth',
  'bayfield': 'Bayfield',
  'picton': 'Picton'
};

// Business types
const types = {
  'bike-shop': 'Independent bike shop',
  'hotel': 'Small-mid hotel chain',
  'tour-operator': 'Adventure/tour operator',
  'marina': 'Marina/boat rental',
  'campground': 'Campground/glamping',
  'restaurant': 'Restaurant/café',
  'attraction': 'Attraction/heritage site',
  'other': 'Other'
};

// Save interview
app.post('/api/interviews', async (req, res) => {
  try {
    const data = req.body;
    
    if (!data.businessName || !data.businessType || !data.location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const locationLabel = locations[data.location] || data.location;
    const typeLabel = types[data.businessType] || data.businessType;
    const painPoints = Array.isArray(data.painPoints) ? data.painPoints.join(', ') : (data.painPoints || 'Not specified');

    // Send Discord webhook
    if (process.env.DISCORD_WEBHOOK_URL) {
      const msg = {
        content: `🎯 **New Interview: ${data.businessName}**`,
        embeds: [{
          title: data.businessName,
          description: `${typeLabel} | ${locationLabel}`,
          color: 2563371,
          fields: [
            { name: 'Contact', value: `${data.contactName || '—'} | ${data.contactEmail || '—'}`, inline: false },
            { name: 'Interest Score', value: `${data.interestScore || '—'}/10`, inline: true },
            { name: 'Pilot', value: data.pilot || '—', inline: true },
            { name: 'Pricing', value: data.pricingModel || '—', inline: true },
            { name: 'Pain Points', value: painPoints, inline: false },
            { name: 'Notes', value: data.generalNotes || '—', inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
    }

    return res.json({ success: true, message: 'Interview saved', id: data.id });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
