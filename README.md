# Ontario Tourism Mobility Platform - Phase 1 Partner Validation

A web form for conducting structured partner interviews to validate demand for an Ontario tourism bike rental platform.

## Overview

Phase 1 partner validation platform for collecting and emailing partner interview responses. When a partner interview is submitted, an automated email is sent to `pranav@wetaran.com` with all response data.

## Features

- **5-section structured interview form**
  - Partner information (name, business type, location, contact)
  - Current bike rental operations
  - Pain points & challenges
  - Platform interest & pricing preferences
  - Notes & follow-up actions

- **15 Ontario locations** in dropdown: Muskoka, Niagara-on-the-Lake, Blue Mountains, Prince Edward County, Collingwood, St. Jacobs, Tobermory, Gananoque, Grand Bend, Stratford, Elora, Amherstburg, Perth, Bayfield, Picton

- **Automated email notifications** with formatted HTML email containing all interview data

- **Responsive design** - works on mobile and desktop

- **Cloud-ready** - deployable to Railway, Heroku, Render, DigitalOcean, or any Node.js host

## Tech Stack

- **Backend**: Node.js / Express
- **Email**: Nodemailer (Gmail, SendGrid, Outlook, Mailgun supported)
- **Frontend**: HTML5 / CSS3 / JavaScript
- **Hosting**: Any Node.js platform (Railway recommended)

## Quick Start

### Prerequisites
- Node.js v14+ 
- npm
- Gmail account (or other email provider)

### Local Setup (5 minutes)

1. **Clone repo**
```bash
git clone https://github.com/YOUR-USERNAME/ontario-tourism-validation.git
cd ontario-tourism-validation
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (copy from .env.example)
```bash
cp .env.example .env
```

4. **Add Gmail app password to .env**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Enable 2FA if needed
   - Security → App passwords → Mail + Windows Computer
   - Copy 16-char password to .env

5. **Start server**
```bash
npm start
```

6. **Open form**
   - Browser: `http://localhost:3000`
   - Fill out test interview
   - Check email for notification

## Deployment

### Railway (Recommended - 5 minutes)

1. Push code to GitHub (see instructions below)
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub → Select repo
4. Add environment variables (EMAIL_USER, EMAIL_PASSWORD, RECIPIENT_EMAIL, etc.)
5. Railway auto-deploys

Your form is live at: `https://your-project.up.railway.app`

### Other Platforms

See `DEPLOYMENT_GUIDE.md` for:
- Heroku
- Render
- DigitalOcean
- Your own VPS

## Environment Variables

```
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=pranav@wetaran.com
```

## File Structure

```
.
├── server.js              # Express server + email logic
├── index.html             # Interview form (frontend)
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
├── README.md              # This file
├── DEPLOYMENT_GUIDE.md    # Full deployment instructions
├── QUICKSTART.md          # 10-minute quick start
└── public/                # Static files (auto-served by Express)
```

## How It Works

1. **Partner fills form** at `your-domain.com`
2. **Clicks "Save interview"**
3. **Form data sent to backend** via POST to `/api/interviews`
4. **Backend formats HTML email** with all response data
5. **Email sent to `pranav@wetaran.com`** with:
   - Partner info (name, type, location, contact)
   - Current operations (bike rentals, guest %)
   - Pain points selected
   - Interest score (1-10) **← KEY METRIC**
   - Pricing preference & what they'd pay
   - Willingness to pilot
   - Notes & next steps

6. **Automatic response** shown on form: "Interview saved"
7. **Form clears** for next interview

## Email Template

Each email includes:
- **Partner Information** table
- **Current State** table
- **Pain Points** table
- **Platform Interest & Willingness** table
- **Additional Notes** table
- Timestamp & Interview ID

Professional HTML formatting, ready for stakeholder review.

## Phase 1 Validation Process

**Goal**: Collect 12-15 partner interviews across 2 locations (Niagara-on-the-Lake, Prince Edward County)

**Success Criteria**:
- 4-5 partners with 7+/10 interest score
- Clear pricing model preference (% revenue share or flat fee)
- 70%+ mention same pain point
- 1-2 partners willing to pilot

**Timeline**: 3-4 weeks

## Troubleshooting

### Email not sending
- Check `.env` has correct Gmail app password
- Verify 2FA is enabled on Gmail account
- Check server logs: `npm start` will show errors

### Form won't load
- Verify Node.js installed: `node --version`
- Check dependencies: `npm install`
- Ensure server running: `npm start`

### Port already in use
- Change PORT in `.env` to 3001 or higher
- Or kill process: `lsof -ti:3000 | xargs kill -9`

## Support

See `DEPLOYMENT_GUIDE.md` for:
- Detailed troubleshooting
- Multiple platform deployments
- Alternative email providers
- Custom domain setup

See `QUICKSTART.md` for 10-minute setup walkthrough.

## Next Steps

1. ✅ Deploy form to Railway/Heroku/your server
2. 📞 Begin Phase 1 partner outreach (cold email + calls)
3. 📝 Fill form during/after each interview
4. 📊 After 12-15 interviews, analyze:
   - Interest score distribution
   - Common pain points
   - Pricing preferences
   - Pilot interest count
5. 🚀 Proceed to Phase 2 (user validation) or pivot

## License

MIT
