const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Email configuration
let transporter;

if (process.env.EMAIL_SERVICE === 'SendGrid') {
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  // Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// Location mapping for readable output
const locationMap = {
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

const businessTypeMap = {
  'bike-shop': 'Independent bike shop',
  'hotel': 'Small-mid hotel chain',
  'tour-operator': 'Adventure/tour operator',
  'marina': 'Marina/boat rental',
  'campground': 'Campground/glamping',
  'restaurant': 'Restaurant/café',
  'attraction': 'Attraction/heritage site',
  'other': 'Other'
};

// Save interview endpoint
app.post('/api/interviews', async (req, res) => {
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.businessName || !data.businessType || !data.location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Build email content
    const locationLabel = locationMap[data.location] || data.location;
    const businessTypeLabel = businessTypeMap[data.businessType] || data.businessType;
    
    const painPoints = Array.isArray(data.painPoints) 
      ? data.painPoints.join(', ') 
      : (data.painPoints || 'Not specified');

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Interview Submitted
        </h2>
        
        <h3 style="color: #1a1a1a; margin-top: 20px;">Partner Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Business Name</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.businessName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Business Type</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${businessTypeLabel}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Location</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${locationLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Contact Name</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.contactName || '—'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.contactEmail || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Phone</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.contactPhone || '—'}</td>
          </tr>
        </table>

        <h3 style="color: #1a1a1a; margin-top: 20px;">Current State</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Bike Rentals Offered</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.bikeRental || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">% of Guests Using Bikes</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.percentageGuests || '—'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Current Operations</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.currentOps || '—'}</td>
          </tr>
        </table>

        <h3 style="color: #1a1a1a; margin-top: 20px;">Pain Points</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Top Pain Points</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${painPoints}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">One Thing to Change</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.painDetail || '—'}</td>
          </tr>
        </table>

        <h3 style="color: #1a1a1a; margin-top: 20px;">Platform Interest & Willingness</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold; width: 40%;">Interest Score (1-10)</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold; color: #2563eb; font-size: 18px;">${data.interestScore || '—'}/10</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Pricing Model Preference</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.pricingModel || '—'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Acceptable Price Point</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.pricingPercent || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Pilot Interest</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.pilot || '—'}</td>
          </tr>
        </table>

        <h3 style="color: #1a1a1a; margin-top: 20px;">Additional Notes</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Key Features That Matter</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.keyFeatures || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">General Notes</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.generalNotes || '—'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 8px; border: 1px solid #e0e0e0; font-weight: bold;">Next Steps</td>
            <td style="padding: 8px; border: 1px solid #e0e0e0;">${data.followUpAction || '—'}</td>
          </tr>
        </table>

        <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          Submitted on: ${new Date().toLocaleString()}<br>
          Interview ID: ${data.id || 'N/A'}
        </p>
      </div>
    `;

    // Send to Discord
const discordMessage = {
  content: `🎯 **New Partner Interview Submitted**`,
  embeds: [{
    title: data.businessName,
    color: 2563371, // blue
    fields: [
      {
        name: 'Business Type',
        value: businessTypeLabel,
        inline: true
      },
      {
        name: 'Location',
        value: locationLabel,
        inline: true
      },
      {
        name: 'Interest Score',
        value: `${data.interestScore}/10`,
        inline: true
      },
      {
        name: 'Pilot Interest',
        value: data.pilot || '—',
        inline: true
      },
      {
        name: 'Pricing Model',
        value: data.pricingModel || '—',
        inline: true
      },
      {
        name: 'Pain Points',
        value: painPoints,
        inline: false
      },
      {
        name: 'General Notes',
        value: data.generalNotes || '—',
        inline: false
      }
    ],
    timestamp: new Date().toISOString()
  }]
};

const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(discordMessage)
});

if (!response.ok) {
  throw new Error(`Discord webhook failed: ${response.statusText}`);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve the form
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email configured to send to: ${process.env.RECIPIENT_EMAIL || 'pranav@wetaran.com'}`);
});
