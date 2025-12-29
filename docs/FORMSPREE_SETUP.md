# Formspree Contact Form Setup Guide

## Overview
Your contact form is now integrated with Formspree, a form backend service that will send form submissions directly to your email without needing a server.

## Step-by-Step Setup (5 minutes)

### Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" or "Sign Up"
3. Sign up with your email (hinardi93@gmail.com) or GitHub account
4. Verify your email address

### Step 2: Create a New Form
1. Once logged in, click "+ New Form" button
2. Give your form a name: **"Portfolio Contact Form"**
3. Set the email address where submissions should be sent: **hinardi93@gmail.com**
4. Click "Create Form"

### Step 3: Get Your Form ID
After creating the form, you'll see your form endpoint URL that looks like:
```
https://formspree.io/f/xyzabc123
```

The Form ID is the part after `/f/` - in this example: **xyzabc123**

### Step 4: Add Form ID to Environment Variable

#### For Local Development:
1. Create a file named `.env.local` in the root of your project (if it doesn't exist)
2. Add this line:
   ```bash
   VITE_FORMSPREE_FORM_ID=xyzabc123
   ```
   Replace `xyzabc123` with your actual Form ID from Step 3

#### For Vercel Deployment:
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **personal-web**
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_FORMSPREE_FORM_ID`
   - **Value**: `xyzabc123` (your actual form ID)
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 5: Test Your Form

#### Local Testing:
1. Start your dev server:
   ```bash
   pnpm dev
   ```
2. Navigate to the Contact section
3. Fill out the form with test data
4. Click "Send Message"
5. Check your email (hinardi93@gmail.com) for the form submission

#### Production Testing:
After deployment:
1. Visit https://ferryhinardi.vercel.app/#contact
2. Fill out the form
3. Submit and check your email

### Step 6: Customize Formspree Settings (Optional)

In your Formspree dashboard, you can:

1. **Add Auto-Reply Email**
   - Settings → Autoresponder
   - Enable and customize the message sent to form submitters

2. **Add reCAPTCHA Protection**
   - Settings → reCAPTCHA
   - Enable Google reCAPTCHA to prevent spam
   - Free tier includes reCAPTCHA

3. **Customize Email Template**
   - Settings → Email Templates
   - Customize how you receive form submissions

4. **Set Up Webhooks** (Advanced)
   - Settings → Webhooks
   - Send form data to other services

5. **View Submissions History**
   - Submissions tab shows all form submissions
   - Export to CSV if needed

## Formspree Free Tier Limits

✅ **50 submissions per month** - Plenty for a portfolio site
✅ **Unlimited forms**
✅ **Email notifications**
✅ **reCAPTCHA spam protection**
✅ **File uploads** (up to 10MB)
✅ **Custom redirect after submission**

## Troubleshooting

### Form Not Submitting
1. **Check Form ID**: Make sure your Form ID is correct in `.env.local` or Vercel
2. **Restart Dev Server**: After adding `.env.local`, restart `pnpm dev`
3. **Check Console**: Open browser DevTools → Console for any errors
4. **Verify Email**: Make sure you verified your Formspree email address

### Not Receiving Emails
1. **Check Spam Folder**: Formspree emails might go to spam initially
2. **Whitelist Email**: Add noreply@formspree.io to your contacts
3. **Check Formspree Dashboard**: View submissions in Formspree dashboard even if emails aren't arriving
4. **Verify Email Address**: Make sure the email in Formspree settings is correct

### Testing in Development
If you see a validation page from Formspree the first time you submit:
1. This is normal for the FIRST submission to a new form
2. Click "Confirm" on the Formspree validation page
3. All subsequent submissions will work automatically

## What Happens After Deployment

1. **Redeploy Required**: After setting environment variables in Vercel, you need to redeploy
   - Vercel Dashboard → Deployments → Click the latest → "Redeploy"
   - Or just push a new commit to trigger auto-deployment

2. **Form Will Work Immediately**: Once deployed with the correct Form ID, the form will send real emails

3. **Email Notifications**: You'll receive an email at hinardi93@gmail.com for each form submission

## Alternative: Using Formspree Email Endpoint

If you prefer not to use environment variables, you can also use Formspree's email endpoint directly in the code (less secure, but simpler):

```typescript
// In Contact.tsx, replace this line:
const [state, handleFormspreeSubmit] = useForm(formspreeId);

// With this:
const [state, handleFormspreeSubmit] = useForm('hinardi93@gmail.com');
```

**Note**: Using the email endpoint will require email verification on first submission.

## Recommended: reCAPTCHA Setup (Optional but Highly Recommended)

To prevent spam:

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v2 "I'm not a robot" Checkbox
3. Add your domains: `ferryhinardi.vercel.app` and `localhost`
4. Copy your **Site Key** and **Secret Key**
5. In Formspree Dashboard:
   - Go to your form → Settings → reCAPTCHA
   - Enable reCAPTCHA
   - Paste your keys
   - Save

## Support

- **Formspree Docs**: https://help.formspree.io/
- **Formspree Support**: support@formspree.io
- **Status Page**: https://status.formspree.io/

## Cost Comparison

### Formspree (Current Choice) ✅
- **Free**: 50 submissions/month
- **Plus ($10/month)**: 1,000 submissions/month
- **Pro ($40/month)**: 10,000 submissions/month

### Alternatives Considered
- **EmailJS**: Free 200 emails/month, requires client-side API keys
- **Vercel Serverless Functions**: Free, but requires coding backend logic
- **SendGrid**: Free 100 emails/day, but more complex setup

**Recommendation**: Start with Formspree free tier. Upgrade only if you exceed 50 submissions/month.

---

**Setup Status**: 🟡 In Progress  
**Next Steps**:
1. ✅ Code implementation complete
2. ⏳ Create Formspree account
3. ⏳ Get Form ID
4. ⏳ Add to Vercel environment variables
5. ⏳ Deploy and test

**Last Updated**: December 29, 2024
