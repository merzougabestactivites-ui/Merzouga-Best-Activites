# Simple Email Setup - Get Emails Working Now!

## Quick Fix (5 minutes)

### Step 1: Get Your Formspree Endpoint
1. Go to [Formspree.io](https://formspree.io/)
2. Click "Sign Up" (free)
3. Create account with your email: `merzougabestactivites@gmail.com`
4. Click "New Form"
5. Name it "Merzouga Bookings"
6. Copy the form endpoint (looks like: `https://formspree.io/f/xayzqjqr`)

### Step 2: Update the Code
In `index.html`, find this line:
```html
<form id="emailForm" action="https://formspree.io/f/xayzqjqr" method="POST" style="display:none;">
```

Replace `https://formspree.io/f/xayzqjqr` with your actual endpoint.

### Step 3: Test
1. Fill out the booking form
2. Submit
3. Check your Gmail: `merzougabestactivites@gmail.com`
4. You should receive the booking email!

## What This Does
- ✅ Actually sends emails to your Gmail
- ✅ No user email client needed
- ✅ Works immediately after setup
- ✅ Free service (250 submissions/month)

## Current Status
- ✅ Booking form is working
- ✅ Dynamic pricing works
- ✅ Thank you page is ready
- ⚠️ Just need to replace the formspree endpoint

## Alternative: Use Web3Forms
If Formspree doesn't work:
1. Go to [Web3Forms.com](https://web3forms.com/)
2. Get your access key
3. Update the JavaScript code

The form is ready - just need to connect it to an email service!
