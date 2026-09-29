# Quick Start - 10 Minutes to Email-Enabled Form

Get the form running locally and sending emails in 10 minutes.

---

## Prerequisites
- Node.js installed ([Download](https://nodejs.org/))
- A Gmail account

---

## Step 1: Set Up Gmail App Password (2 minutes)

1. Go to https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Turn on **2-Step Verification** (if not already on)
4. Go back to Security → **App passwords**
5. Select **Mail** → **Windows Computer**
6. Google gives you a 16-character password — **copy it**

---

## Step 2: Create .env File (1 minute)

In the project root folder, create a file named `.env` with:

```
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=YOUR_GMAIL_HERE@gmail.com
EMAIL_PASSWORD=PASTE_16_CHAR_PASSWORD_HERE
RECIPIENT_EMAIL=pranav@wetaran.com
```

Replace:
- `YOUR_GMAIL_HERE` = your Gmail address
- `PASTE_16_CHAR_PASSWORD_HERE` = the password from Step 1

---

## Step 3: Install & Start (3 minutes)

```bash
npm install
npm start
```

You'll see:
```
Server running on port 3000
Email configured to send to: pranav@wetaran.com
```

---

## Step 4: Test (4 minutes)

1. Open `http://localhost:3000` in browser
2. Fill in form (required fields marked with *)
   - Business: "Test Bike Shop"
   - Type: "Independent bike shop"
   - Location: "Niagara-on-the-Lake"
   - Rating: Click any 1-10 number
3. Click **Save interview**

**You should see:**
- Green success message
- Form clears automatically
- Check your email inbox (or spam)

---

## If It Works

**Next step:** Deploy to a server so partners can access it online.

See `DEPLOYMENT_GUIDE.md` for options:
- **Easiest:** Railway.app (5 min setup)
- **Most familiar:** Heroku (10 min setup)
- **Free tier:** Render (5 min setup)

---

## If Email Doesn't Arrive

**Check 1:** Did you enable 2FA in Gmail?
```bash
# Test email configuration:
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'YOUR_EMAIL@gmail.com', pass: 'YOUR_APP_PASSWORD' }
});
t.sendMail({
  from: 'YOUR_EMAIL@gmail.com',
  to: 'pranav@wetaran.com',
  subject: 'Test',
  text: 'Works!'
}, (e, i) => console.log(e ? 'Error: '+e.message : 'Sent!'));
"
```

**Check 2:** Is `.env` file created and filled?
```bash
cat .env
```

**Check 3:** Are all dependencies installed?
```bash
npm ls
```

**Check 4:** Server logs show error?
- Look at console output from `npm start`

---

## Stop Server

Press `Ctrl+C` in terminal

---

## Ready to Deploy?

Pick one:

| Platform | Time | Cost |
|----------|------|------|
| **Railway** | 5 min | Free tier available |
| **Render** | 5 min | Free tier available |
| **Heroku** | 10 min | $7/month |

See `DEPLOYMENT_GUIDE.md` for step-by-step instructions for each.

---

## Files You Have

- `server.js` — Backend that sends emails
- `index.html` — The form
- `package.json` — Dependencies
- `.env` — Your secrets (don't share this)
- `DEPLOYMENT_GUIDE.md` — Full deployment instructions
- `QUICKSTART.md` — This file

---

## Questions?

1. Check `DEPLOYMENT_GUIDE.md` troubleshooting section
2. Verify Gmail app password is correct (no spaces, exactly 16 chars)
3. Make sure `.env` file is in project root (same folder as `server.js`)
