# Email Setup Guide - Quick Fix

## Problem
The current setup opens the user's email client instead of sending emails directly to your Gmail.

## Solution: Use Formspree (Free & Easy)

### Step 1: Create Formspree Account
1. Go to [Formspree.io](https://formspree.io/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Create a New Form
1. Click "New Form"
2. Name it "Merzouga Bookings"
3. Copy the form endpoint (looks like: `https://formspree.io/f/xayzqjqr`)

### Step 3: Update the Code
Replace the formEndpoint in `app.js` (line ~290):

```javascript
const formEndpoint = 'YOUR_ACTUAL_FORMSPREE_ENDPOINT';
```

### Step 4: Test
1. Fill out the booking form
2. Submit
3. Check your Gmail (merzougabestactivites@gmail.com)
4. You should receive the booking email

## Alternative: Use EmailJS (More Advanced)

If you prefer EmailJS:

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Create account and set up Gmail service
3. Replace the sendFormData function with EmailJS code

## Current Status
- ✅ Booking form is organized and functional
- ✅ Dynamic pricing works
- ✅ Thank you page is ready
- ⚠️ Need to set up email endpoint

## Quick Test
For now, the form will:
1. Show success message
2. Redirect to thank you page
3. Log email content to browser console
4. You can check the console to see what would be sent

## Next Steps
1. Set up Formspree account
2. Update the formEndpoint in app.js
3. Test the booking form
4. Emails will be sent directly to your Gmail!

The form is working perfectly - we just need to connect it to an email service!
