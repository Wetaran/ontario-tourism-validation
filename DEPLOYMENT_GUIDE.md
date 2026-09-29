# Ontario Tourism Partner Validation Platform - Deployment Guide

This guide covers setting up and deploying the form with email notifications.

---

## Table of Contents
1. [Local Setup](#local-setup)
2. [Gmail Configuration](#gmail-configuration)
3. [Deployment Options](#deployment-options)
4. [Testing](#testing)

---

## Local Setup

### Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- A Gmail account (or email provider)

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web server framework
- **cors** - Cross-origin requests
- **dotenv** - Environment variable management
- **nodemailer** - Email sending

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your email credentials:

```
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=pranav@wetaran.com
```

### Step 3: Get Gmail App Password

If using Gmail (recommended for reliability):

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in left menu
3. Enable **2-Step Verification** (if not already enabled)
4. Go back to Security > **App passwords**
5. Select **Mail** and **Windows Computer**
6. Copy the 16-character app password
7. Paste it into `.env` as `EMAIL_PASSWORD`

**Do NOT use your regular Gmail password** — use the app password.

### Step 4: Run Locally

```bash
npm start
```

The server will start at `http://localhost:3000`

**For development with auto-reload:**

```bash
npm run dev
```

(Requires `nodemon` - installed in devDependencies)

### Step 5: Test the Form

1. Open `http://localhost:3000` in your browser
2. Fill out a test interview
3. Click **Save interview**
4. Check your email inbox for the notification

---

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway.app is a modern hosting platform that makes deployment simple.

#### Step 1: Sign Up
- Go to [railway.app](https://railway.app)
- Sign up with GitHub, GitLab, or email

#### Step 2: Create a New Project
- Click **New Project**
- Select **Deploy from GitHub**
- Connect your GitHub account and select this repository

#### Step 3: Add Environment Variables
- In Railway dashboard, go to **Variables**
- Add:
  ```
  PORT=3000
  EMAIL_SERVICE=gmail
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=your-app-password
  RECIPIENT_EMAIL=pranav@wetaran.com
  ```

#### Step 4: Deploy
- Railway auto-deploys on push to main branch
- Your app will be live at `https://your-project.railway.app`

**Cost:** Free tier available; paid plans start at $5/month

---

### Option 2: Heroku

Heroku is a classic platform-as-a-service option.

#### Step 1: Install Heroku CLI
```bash
# macOS with Homebrew
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login
```bash
heroku login
```

#### Step 3: Create App
```bash
heroku create your-app-name
```

#### Step 4: Set Environment Variables
```bash
heroku config:set PORT=3000
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set RECIPIENT_EMAIL=pranav@wetaran.com
```

#### Step 5: Deploy
```bash
git push heroku main
```

Your app will be live at `https://your-app-name.herokuapp.com`

**Cost:** Free tier removed (as of Nov 2022); paid plans start at $7/month

---

### Option 3: Render

Render is a modern alternative with free tier.

#### Step 1: Sign Up
- Go to [render.com](https://render.com)
- Sign up with GitHub

#### Step 2: Create New Web Service
- Click **New +** > **Web Service**
- Connect your GitHub repository
- Name: `ontario-tourism-form`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

#### Step 3: Add Environment Variables
- In **Environment** section, add:
  ```
  PORT=3000
  EMAIL_SERVICE=gmail
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=your-app-password
  RECIPIENT_EMAIL=pranav@wetaran.com
  ```

#### Step 4: Deploy
- Click **Create Web Service**
- Render deploys automatically
- URL: `https://your-service-name.onrender.com`

**Cost:** Free tier available; always-on paid plans start at $7/month

---

### Option 4: DigitalOcean App Platform

DigitalOcean offers reliable hosting for Node.js apps.

#### Step 1: Sign Up
- Go to [digitalocean.com](https://www.digitalocean.com)
- Create account and add payment method

#### Step 2: Create App
- Click **Apps** (left menu)
- Click **Create Apps**
- Connect GitHub and select repository

#### Step 3: Configure
- Source: GitHub repo
- Branch: `main`
- Build Command: `npm install`
- Run Command: `npm start`
- HTTP Port: `3000`

#### Step 4: Environment Variables
- Add in **App Spec** section:
  ```
  PORT=3000
  EMAIL_SERVICE=gmail
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=your-app-password
  RECIPIENT_EMAIL=pranav@wetaran.com
  ```

#### Step 5: Deploy
- Click **Create Resources**
- DigitalOcean deploys automatically
- URL: `https://your-app.ondigitalocean.app`

**Cost:** Starts at $5/month

---

## Alternative Email Providers

If you don't want to use Gmail, here are other options:

### SendGrid (Free tier: 100 emails/day)

```
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxx
RECIPIENT_EMAIL=pranav@wetaran.com
```

Get API key at [sendgrid.com](https://sendgrid.com)

### Mailgun (Free tier: 5,000 emails/month)

```
EMAIL_SERVICE=Mailgun
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-api-key
RECIPIENT_EMAIL=pranav@wetaran.com
```

### Outlook/Office 365

```
EMAIL_SERVICE=Outlook365
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
RECIPIENT_EMAIL=pranav@wetaran.com
```

---

## Testing

### Test Form Submission Locally

1. Run `npm start`
2. Go to `http://localhost:3000`
3. Fill out form completely
4. Click **Save interview**
5. Check your email

### Check Server Logs

**Local:**
```bash
npm start
# Watch console for requests and errors
```

**Heroku:**
```bash
heroku logs --tail
```

**Railway:**
- View in Railway dashboard > **Logs** tab

**Render:**
- View in Render dashboard > **Logs** tab

### Verify Email Configuration

Test your email setup with this Node.js script:

```bash
node test-email.js
```

Create `test-email.js`:
```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.RECIPIENT_EMAIL,
  subject: 'Test Email',
  text: 'This is a test email from the form server.'
}, (err, info) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Email sent:', info.response);
  }
  process.exit(0);
});
```

Run: `node test-email.js`

---

## Troubleshooting

### "Cannot find module 'express'"
**Solution:** Run `npm install`

### "Error: invalid login: 535-5.7.8 Username and password not accepted"
**Solution:** 
- Make sure you're using Gmail **App Password**, not regular password
- Enable 2FA on your Gmail account first
- Regenerate app password

### Form submits but no email received
**Solution:**
1. Check `.env` file exists and has correct credentials
2. Run `node test-email.js` to verify email setup
3. Check email spam folder
4. Check server logs for errors

### "CORS error" on form submission
**Solution:** CORS is already configured in `server.js`, but if issues persist:
- Check that frontend and backend are on same domain (or backend allows cross-origin)
- For local testing, ensure you're accessing `http://localhost:3000` (not `127.0.0.1`)

### Port already in use
**Solution:** Change `PORT` in `.env` to an unused port (e.g., 3001)

---

## File Structure

```
.
├── server.js              # Express server and email logic
├── index.html             # Form frontend
├── package.json           # Dependencies
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Template for environment variables
├── DEPLOYMENT_GUIDE.md    # This file
└── public/                # Static files (auto-served)
    └── index.html         # Form page
```

---

## Next Steps

1. **Deploy** using your preferred platform
2. **Test** the form with a sample interview
3. **Share** the URL (e.g., `https://your-app.railway.app`) with your team
4. **Monitor** incoming emails from partner interviews
5. **Export** interviews periodically (data is also shown in email)

---

## Support & Customization

### Change recipient email
Edit `RECIPIENT_EMAIL` in `.env`:
```
RECIPIENT_EMAIL=your-email@company.com
```

### Change email service
Update `EMAIL_SERVICE` and credentials in `.env`:
```
EMAIL_SERVICE=mailgun
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-api-key
```

### Customize email template
Edit the `emailHTML` string in `server.js` (lines 63-160)

### Add database storage
Currently, interviews are only emailed. To also store in database:
- Add MongoDB, PostgreSQL, or Firebase connection
- Modify `/api/interviews` endpoint to save to database before sending email
- Create `/api/interviews` GET endpoint to view stored interviews

---

## Cost Summary

| Platform | Startup Cost | Monthly (Basic) |
|----------|-------------|-----------------|
| Railway  | $0          | $0 (free tier) or $5 |
| Heroku   | $0          | $7 (upgraded) |
| Render   | $0          | $0 (free tier) or $7 |
| DigitalOcean | $0      | $5 |

**Email:** Gmail (free with app password) or SendGrid (free 100/day)

---

## Questions?

- Check server logs for error details
- Verify `.env` file has all required variables
- Test email setup with `test-email.js`
- Ensure Node.js version is 14 or higher: `node --version`
