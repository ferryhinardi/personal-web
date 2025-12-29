# Contact Form Setup with Formspree

This guide walks you through setting up the contact form integration with Formspree for ferryhinardi.com.

## Overview

The contact form is already integrated with Formspree in `src/components/Contact.tsx`. You just need to:
1. Create a Formspree account
2. Create a form
3. Add the Form ID to environment variables

---

## Step 1: Create Formspree Account

1. Visit [https://formspree.io/](https://formspree.io/)
2. Click **"Sign Up"** (it's free)
3. You can sign up with:
   - Email address
   - GitHub account
   - Google account

**Free Tier Includes**:
- 50 submissions per month
- Unlimited forms
- Email notifications
- Spam filtering
- Basic analytics

---

## Step 2: Create a New Form

### 2.1 Create Form in Dashboard

1. After logging in, click **"+ New Form"** button
2. Enter form details:
   - **Form Name**: `Portfolio Contact Form` (or any name you prefer)
   - **Form Email**: Your email address where you want to receive submissions
   - **Form ID**: Will be auto-generated (e.g., `xyzabc123`)

### 2.2 Configure Form Settings (Optional)

Click on your form to access settings:

**Email Notifications**:
- ✅ Enable email notifications
- Set notification email (can be different from signup email)
- Customize email subject line

**Spam Protection**:
- ✅ Enable reCAPTCHA (recommended)
- ✅ Enable honeypot field
- Set spam filter sensitivity

**Submissions**:
- View submission history
- Export submissions as CSV
- Set up webhooks (Pro feature)

**Integrations** (Paid features):
- Slack notifications
- Google Sheets
- Zapier integration
- Webhook endpoints

---

## Step 3: Get Your Form ID

1. In the Formspree dashboard, click on your form
2. Look for the **Form ID** (also called Form Endpoint)
3. It will look like: `https://formspree.io/f/xyzabc123`
4. Copy just the ID part: **`xyzabc123`**

---

## Step 4: Configure Environment Variables

### 4.1 Local Development

1. Create `.env.local` file in project root (if not exists):
   ```bash
   cp .env.example .env.local
   ```

2. Add your Formspree Form ID:
   ```bash
   # .env.local
   VITE_GA_MEASUREMENT_ID=G-8N7QJBMRDH
   VITE_FORMSPREE_FORM_ID=xyzabc123  # Replace with your actual Form ID
   ```

3. Restart dev server:
   ```bash
   pnpm dev
   ```

### 4.2 Production (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `personal-web`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_FORMSPREE_FORM_ID`
   - **Value**: `xyzabc123` (your Form ID)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. Redeploy your site:
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push origin master
   ```

---

## Step 5: Test the Contact Form

### 5.1 Local Testing

1. Start dev server:
   ```bash
   pnpm dev
   ```

2. Navigate to contact section: `http://localhost:3000/#contact`

3. Fill out the form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Subject**: Test Submission
   - **Message**: This is a test message

4. Click **Send Message**

5. Check for success message:
   ```
   ✓ Your message was sent successfully! I'll get back to you soon.
   ```

### 5.2 Production Testing

1. Visit: `https://ferryhinardi.com/#contact`
2. Submit a real test message
3. Verify you receive the email notification

### 5.3 Verify in Formspree Dashboard

1. Go to [Formspree Dashboard](https://formspree.io/forms)
2. Click on your form
3. Check **Submissions** tab
4. You should see your test submission with all fields

---

## Form Features

### Current Features ✅

1. **Client-side Validation**
   - Required fields: Name, Email, Message
   - Email format validation
   - Real-time error messages

2. **Formspree Integration**
   - Automatic spam filtering
   - Email notifications
   - Submission storage
   - Error handling

3. **User Experience**
   - Loading states during submission
   - Success/error messages with animations
   - Form disabled while submitting
   - Auto-clear form on success
   - Accessible form labels and errors

4. **Styling**
   - Consistent with design system
   - Dark mode support
   - Responsive layout
   - Error states with red borders
   - Icon indicators

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | text | ✅ Yes | Non-empty |
| Email | email | ✅ Yes | Valid email format |
| Subject | text | ❌ No | - |
| Message | textarea | ✅ Yes | Non-empty |

---

## Customization

### Change Email Recipient

**Option 1: In Formspree Dashboard**
1. Go to form settings
2. Update **Form Email**
3. Save changes

**Option 2: Create Multiple Forms**
- Create separate forms for different purposes
- Sales inquiries: `sales-form-id`
- Support requests: `support-form-id`
- General contact: `contact-form-id`

### Customize Success Message

Edit `src/components/Contact.tsx` (line 232-237):

```tsx
<p className="font-medium">
  Your message was sent successfully! I'll get back to you soon.
</p>
```

### Add Custom Fields

1. Add field to form state (line 39-44):
   ```tsx
   const [formData, setFormData] = useState<FormData>({
     name: '',
     email: '',
     subject: '',
     message: '',
     phone: '', // New field
   });
   ```

2. Add input in JSX:
   ```tsx
   <Input
     id="phone"
     name="phone"
     type="tel"
     value={formData.phone}
     onChange={(e) => handleChange('phone', e.target.value)}
     placeholder="Your phone number"
   />
   ```

### Add File Upload

Formspree supports file uploads on paid plans:

```tsx
<Input
  type="file"
  name="attachment"
  accept=".pdf,.doc,.docx"
/>
```

---

## Spam Protection

### Built-in Protection ✅

Formspree includes:
1. **Honeypot fields** - Hidden fields to catch bots
2. **Rate limiting** - Prevent spam submissions
3. **Email verification** - Verify sender emails
4. **reCAPTCHA** - Google's bot detection

### Enable reCAPTCHA (Recommended)

1. Go to Formspree form settings
2. Enable **reCAPTCHA v3**
3. No changes needed in code - handled by Formspree

### Custom Spam Rules

In Formspree dashboard:
1. Go to **Spam Protection** settings
2. Add blocked words/phrases
3. Add blocked email domains
4. Set spam sensitivity level

---

## Troubleshooting

### Form Not Submitting

**Check 1: Environment Variable**
```bash
# Verify .env.local has correct Form ID
cat .env.local | grep FORMSPREE

# Should output:
VITE_FORMSPREE_FORM_ID=xyzabc123
```

**Check 2: Console Errors**
- Open browser DevTools → Console
- Look for Formspree errors
- Common errors:
  - 404: Invalid Form ID
  - 403: Form disabled or spam detected
  - 429: Rate limit exceeded

**Check 3: Network Tab**
- DevTools → Network tab
- Submit form
- Look for request to `formspree.io`
- Check response status and body

### Not Receiving Emails

**Check 1: Spam Folder**
- Check your email spam/junk folder
- Mark Formspree emails as "Not Spam"

**Check 2: Email Settings**
- Log into Formspree dashboard
- Go to form settings
- Verify notification email is correct
- Check if email notifications are enabled

**Check 3: Email Deliverability**
- Some email providers may block Formspree
- Try adding `submissions@formspree.io` to contacts
- Use a different email provider if issues persist

### Form ID Not Found Error

If you see "YOUR_FORM_ID" in the console:

1. Environment variable not loaded:
   ```bash
   # Restart dev server
   pnpm dev
   ```

2. Variable not set:
   ```bash
   # Check .env.local exists and has Form ID
   cat .env.local
   ```

3. Vercel deployment:
   - Add environment variable in Vercel dashboard
   - Redeploy site

---

## Rate Limits

### Free Plan Limits
- **50 submissions/month**
- **1,000 submissions stored**
- **Email notifications** included
- **Basic spam protection** included

### Paid Plans

**Gold Plan** ($10/month):
- 1,000 submissions/month
- Priority support
- File uploads
- Webhooks
- Advanced integrations

**Platinum Plan** ($40/month):
- 10,000 submissions/month
- White-label forms
- Advanced analytics
- Custom domains
- SLA guarantee

### Upgrading

When you exceed 50 submissions:
1. Formspree will send you an email
2. Upgrade to paid plan to continue receiving submissions
3. Or wait until next month for quota reset

---

## Security Best Practices

### 1. Never Commit Form ID to Git ✅
Already configured:
- Form ID stored in environment variables
- `.env.local` in `.gitignore`
- `.env.example` for documentation only

### 2. Enable Spam Protection ✅
- Enable reCAPTCHA in Formspree settings
- Use honeypot fields (already implemented)
- Set reasonable rate limits

### 3. Validate Input ✅
Already implemented:
- Client-side validation
- Email format checking
- Required field checking
- Formspree server-side validation

### 4. Use HTTPS ✅
- Production site uses HTTPS (Vercel)
- Formspree API uses HTTPS
- All data encrypted in transit

---

## Monitoring & Analytics

### View Submissions

1. Log into [Formspree Dashboard](https://formspree.io/forms)
2. Click on your form
3. View submissions with filters:
   - Date range
   - Spam status
   - Search by email/name

### Export Data

1. Go to form submissions
2. Click **Export** button
3. Download as CSV
4. Import to Excel/Google Sheets

### Email Notifications

Each submission email includes:
- Sender name and email
- Message content
- Timestamp
- Link to view in dashboard

---

## Alternative Solutions

If Formspree doesn't meet your needs:

### 1. EmailJS (Free tier available)
- Similar to Formspree
- 200 emails/month free
- Multiple email services

### 2. Netlify Forms (If using Netlify)
- Built into Netlify
- 100 submissions/month free
- Spam filtering included

### 3. Custom Backend
- AWS SES + Lambda
- More control, more setup
- Pay per email sent

### 4. Google Forms
- Free, unlimited submissions
- Less customizable
- Google branding

---

## Testing Checklist

Before going live:

- [ ] Form ID configured in `.env.local`
- [ ] Form ID configured in Vercel
- [ ] Test submission on localhost
- [ ] Test submission on production
- [ ] Verify email received
- [ ] Check submission in Formspree dashboard
- [ ] Test all required fields
- [ ] Test email validation
- [ ] Test success message
- [ ] Test error handling
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Enable reCAPTCHA
- [ ] Add Formspree email to contacts
- [ ] Set up email filters for submissions

---

## Support & Resources

### Formspree Resources
- [Documentation](https://help.formspree.io/)
- [API Reference](https://formspree.io/docs/)
- [Status Page](https://status.formspree.io/)
- [Support Email](mailto:support@formspree.io)

### React Integration
- [@formspree/react Docs](https://formspree.io/docs/react/)
- [GitHub Repository](https://github.com/formspree/formspree-react)
- [Examples](https://formspree.io/docs/examples/)

### Project Files
- Contact Component: `src/components/Contact.tsx`
- Environment Config: `.env.example`
- Type Definitions: `src/types/resume.types.ts`

---

## Quick Start Summary

```bash
# 1. Sign up at Formspree
open https://formspree.io/

# 2. Create form and copy Form ID

# 3. Add to environment
echo "VITE_FORMSPREE_FORM_ID=your-form-id" >> .env.local

# 4. Restart dev server
pnpm dev

# 5. Test form at http://localhost:3000/#contact

# 6. Deploy to production
git push origin master

# 7. Add Form ID to Vercel environment variables
```

---

**Status**: Contact form is fully implemented and ready to use!
**Next Step**: Create Formspree account and add Form ID to environment variables.

**Last Updated**: December 30, 2025
