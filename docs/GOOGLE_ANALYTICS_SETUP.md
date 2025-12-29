# Google Analytics 4 Integration Guide

This project is configured to use Google Analytics 4 (GA4) for tracking website analytics.

## Setup Instructions

### 1. Create a Google Analytics 4 Property (if you don't have one)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon in the bottom left)
4. In the **Property** column, click **Create Property**
5. Fill in:
   - Property name: `Ferry Hinardi Portfolio` (or your preferred name)
   - Reporting time zone: Your timezone
   - Currency: Your currency
6. Click **Next**
7. Fill in business information (optional)
8. Click **Create**
9. Accept the Terms of Service

### 2. Create a Data Stream

1. After creating the property, you'll be prompted to set up a data stream
2. Select **Web**
3. Fill in:
   - Website URL: `https://ferryhinardi.vercel.app`
   - Stream name: `Ferry Hinardi Portfolio Website`
4. Click **Create stream**
5. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Configure Your Local Environment

1. Create a `.env.local` file in the project root (if it doesn't exist):
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID from step 2.

3. Restart your development server:
   ```bash
   pnpm dev
   ```

### 4. Configure Vercel (Production)

For your production deployment on Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ferryhinardi`
3. Go to **Settings** > **Environment Variables**
4. Add a new environment variable:
   - **Name**: `VITE_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your Measurement ID)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your site or push a new commit to trigger deployment

## Testing

### Local Development

1. Start the dev server: `pnpm dev`
2. Open the browser console (F12)
3. You should see: `Google Analytics initialized with ID: G-XXXXXXXXXX`
4. If you see a warning instead, check that your `.env.local` file is configured correctly

### Production

1. Deploy to Vercel
2. Visit your live site: https://ferryhinardi.vercel.app
3. Open Google Analytics Real-Time view
4. Navigate around your site
5. You should see your activity in the Real-Time report

## Verification

To verify Google Analytics is working:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Click **Reports** > **Realtime**
4. Open your website in a new tab
5. You should see your visit appear in the Real-Time report within a few seconds

## What's Being Tracked

The current implementation tracks:

- **Page Views**: Automatically tracked on initial load
- **Custom Events**: Available via `logEvent()` function (can be added to buttons, links, etc.)

### Example: Track Button Clicks

```typescript
import { logEvent } from '@/utils/analytics';

// In your component:
<Button onClick={() => {
  logEvent('Portfolio', 'View Project', 'Supertool.id');
  window.open('https://supertool.id/', '_blank');
}}>
  View Project
</Button>
```

## Troubleshooting

### Analytics not showing in Google Analytics

1. **Check Measurement ID**: Make sure the ID in `.env.local` matches the ID in Google Analytics
2. **Check Environment Variable**: For production, verify the environment variable is set in Vercel
3. **Wait**: Real-time data can take 1-2 minutes to appear
4. **Ad Blockers**: Disable ad blockers or test in incognito mode
5. **Console Errors**: Check browser console for any errors

### "Google Analytics not initialized" warning

This means the environment variable is not set or is set to the placeholder value.

- **Local**: Create/update `.env.local` file
- **Production**: Add environment variable in Vercel settings and redeploy

## Privacy & GDPR Compliance

Consider adding:

1. **Cookie Consent Banner**: Inform users about analytics tracking
2. **Privacy Policy**: Update your privacy policy to mention Google Analytics
3. **Data Anonymization**: GA4 automatically anonymizes IP addresses

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [react-ga4 Documentation](https://github.com/codler/react-ga4)
- [GA4 Event Tracking Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)

## Files

- `/src/utils/analytics.ts` - Analytics utility functions
- `/src/App.tsx` - Analytics initialization
- `/.env.local` - Local environment variables (git-ignored)
- `/.env.example` - Environment variable template
