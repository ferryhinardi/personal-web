# Vercel CLI Environment Variable Setup

Complete guide for managing environment variables using Vercel CLI.

## Prerequisites

- ✅ Vercel CLI installed (`/Users/ferryhinardi/.nvm/versions/node/v20.18.0/bin/vercel`)
- ✅ Project linked to Vercel (Project: `ferryhinardi`, ID: `prj_ic5hLzcdWzguYyhU4mmmNW7fUv40`)
- ✅ Logged into Vercel CLI (`vercel whoami` to check)

---

## Quick Setup for Formspree Form ID

### Method 1: Interactive (Recommended)

```bash
# Add environment variable with interactive prompts
vercel env add VITE_FORMSPREE_FORM_ID

# When prompted:
# 1. Enter your Formspree Form ID (e.g., xyzabc123)
# 2. Select environments: Production, Preview, Development (all 3)
# 3. Press Enter to confirm

# Pull to local .env.local
vercel env pull .env.local

# Deploy to production
vercel --prod
```

### Method 2: Non-Interactive (For Scripts)

```bash
# Set your Form ID
FORM_ID="your-formspree-form-id"

# Add to all environments
echo "$FORM_ID" | vercel env add VITE_FORMSPREE_FORM_ID production
echo "$FORM_ID" | vercel env add VITE_FORMSPREE_FORM_ID preview
echo "$FORM_ID" | vercel env add VITE_FORMSPREE_FORM_ID development

# Pull to local
vercel env pull .env.local

# Deploy
vercel --prod
```

---

## Common Vercel CLI Commands

### Environment Variables

```bash
# List all environment variables
vercel env ls

# Add a new environment variable
vercel env add VARIABLE_NAME

# Remove an environment variable
vercel env rm VARIABLE_NAME

# Pull environment variables to local .env.local
vercel env pull .env.local

# Pull environment variables for specific environment
vercel env pull .env.production production
```

### Deployment

```bash
# Deploy to preview (automatic deployment URL)
vercel

# Deploy to production
vercel --prod

# Deploy with build logs
vercel --prod --debug

# List recent deployments
vercel ls

# Get deployment URL of latest production deployment
vercel ls --prod
```

### Project Management

```bash
# Show current project info
vercel project ls

# Link to a Vercel project (if not linked)
vercel link

# Switch to different project
vercel switch

# Check who you're logged in as
vercel whoami

# Login to Vercel
vercel login

# Logout
vercel logout
```

### Domains

```bash
# List domains for current project
vercel domains ls

# Add a domain
vercel domains add example.com

# Remove a domain
vercel domains rm example.com
```

### Logs & Debugging

```bash
# View deployment logs
vercel logs <deployment-url>

# View production logs
vercel logs --prod

# Follow logs in real-time
vercel logs --follow

# Inspect a deployment
vercel inspect <deployment-url>
```

---

## Current Project Configuration

```json
{
  "projectId": "prj_ic5hLzcdWzguYyhU4mmmNW7fUv40",
  "orgId": "team_aPPwF78I2RC7WfD4PqAfknaL",
  "projectName": "ferryhinardi"
}
```

**Production URL**: https://ferryhinardi.com

---

## Step-by-Step: Adding Formspree Configuration

### 1. Get Your Formspree Form ID

```bash
# Visit Formspree dashboard
open https://formspree.io/forms

# Create a new form or use existing one
# Copy the Form ID (e.g., xyzabc123)
```

### 2. Add to Vercel via CLI

```bash
# Interactive method (easiest)
vercel env add VITE_FORMSPREE_FORM_ID

# Enter value: xyzabc123
# Select: Production, Preview, Development
```

### 3. Verify Configuration

```bash
# List all environment variables
vercel env ls

# Should show:
# VITE_FORMSPREE_FORM_ID (Production, Preview, Development)
# VITE_GA_MEASUREMENT_ID (if already configured)
```

### 4. Pull to Local Development

```bash
# Download environment variables to .env.local
vercel env pull .env.local

# Verify contents
cat .env.local

# Should contain:
# VITE_GA_MEASUREMENT_ID=G-8N7QJBMRDH
# VITE_FORMSPREE_FORM_ID=xyzabc123
```

### 5. Deploy to Production

```bash
# Deploy with new environment variable
vercel --prod

# Or trigger deployment via git push
git commit --allow-empty -m "Update environment variables"
git push origin master
```

### 6. Test the Contact Form

```bash
# Local testing
pnpm dev
open http://localhost:3000/#contact

# Production testing
open https://ferryhinardi.com/#contact
```

---

## Managing Multiple Environment Variables

### Add Multiple Variables at Once

```bash
# Method 1: Add one by one interactively
vercel env add VITE_API_KEY
vercel env add VITE_API_URL
vercel env add VITE_FEATURE_FLAG

# Method 2: Script for multiple variables
#!/bin/bash
declare -A env_vars=(
  ["VITE_FORMSPREE_FORM_ID"]="xyzabc123"
  ["VITE_GA_MEASUREMENT_ID"]="G-8N7QJBMRDH"
  ["VITE_API_URL"]="https://api.example.com"
)

for var in "${!env_vars[@]}"; do
  echo "${env_vars[$var]}" | vercel env add "$var" production
  echo "${env_vars[$var]}" | vercel env add "$var" preview
  echo "${env_vars[$var]}" | vercel env add "$var" development
done
```

### Update Existing Variable

```bash
# Remove old value
vercel env rm VITE_FORMSPREE_FORM_ID

# Add new value
vercel env add VITE_FORMSPREE_FORM_ID
```

---

## Environment Types

### Production
- Used for production deployments (`vercel --prod`)
- Deployed from default branch (main/master)
- Custom domain: https://ferryhinardi.com

### Preview
- Used for branch deployments
- Automatic preview URLs for pull requests
- Format: `https://ferryhinardi-<branch>-<team>.vercel.app`

### Development
- Used when running `vercel dev` locally
- Pulled to `.env.local` with `vercel env pull`
- Not used in actual deployments

---

## Troubleshooting

### Environment Variable Not Loading

```bash
# Check if variable is set
vercel env ls

# Pull latest variables
vercel env pull .env.local --force

# Restart dev server
pnpm dev

# Redeploy to production
vercel --prod
```

### Permission Denied

```bash
# Check login status
vercel whoami

# Re-authenticate if needed
vercel logout
vercel login
```

### Variable Not Showing in Build

```bash
# Verify variable name starts with VITE_ (for Vite projects)
# Vite only exposes variables prefixed with VITE_

# Check build logs
vercel --prod --debug

# Inspect deployment
vercel inspect <deployment-url>
```

### Wrong Project Linked

```bash
# Check current project
cat .vercel/project.json

# Unlink current project
rm -rf .vercel

# Link to correct project
vercel link
```

---

## Best Practices

### 1. Use Descriptive Names
```bash
# Good
VITE_FORMSPREE_FORM_ID
VITE_GA_MEASUREMENT_ID
VITE_API_BASE_URL

# Bad
FORM_ID
GA
API
```

### 2. Add to All Environments
Always add environment variables to all three environments unless specifically needed for one:
```bash
vercel env add VAR_NAME
# Select: Production, Preview, Development
```

### 3. Keep .env.local in .gitignore
```bash
# Verify .env.local is ignored
grep .env.local .gitignore

# If not present, add it
echo ".env.local" >> .gitignore
```

### 4. Use .env.example for Documentation
```bash
# Keep .env.example updated with variable names (not values)
cat .env.example

# Output should show:
# VITE_FORMSPREE_FORM_ID=
# VITE_GA_MEASUREMENT_ID=
```

### 5. Pull Before Development
```bash
# Always pull latest environment variables before starting
vercel env pull .env.local
pnpm dev
```

### 6. Verify After Changes
```bash
# After adding/updating variables, verify:
vercel env ls
vercel env pull .env.local
cat .env.local
```

---

## Security Notes

### ⚠️ Never Commit Secrets

```bash
# These should NEVER be in git:
.env.local          # Local environment variables
.env.production     # Production secrets
.env.*.local        # Any local env files

# These are OK to commit:
.env.example        # Template with empty values
.vercel/            # Project configuration (no secrets)
```

### ✅ Safe Variables (Frontend)

Variables prefixed with `VITE_` are embedded in frontend code and are PUBLIC:
- ✅ `VITE_GA_MEASUREMENT_ID` - Public Google Analytics ID
- ✅ `VITE_FORMSPREE_FORM_ID` - Public Formspree form ID
- ✅ `VITE_API_URL` - Public API endpoint

### ❌ Secret Variables (Backend Only)

These should NEVER start with `VITE_`:
- ❌ API keys with write access
- ❌ Database credentials
- ❌ Private tokens
- ❌ OAuth secrets

---

## Complete Example Workflow

```bash
# 1. Ensure you're logged in
vercel whoami

# 2. Verify project is linked
cat .vercel/project.json

# 3. Add Formspree Form ID (interactive)
vercel env add VITE_FORMSPREE_FORM_ID
# Enter: xyzabc123
# Select: Production, Preview, Development

# 4. Verify it was added
vercel env ls | grep FORMSPREE

# 5. Pull to local environment
vercel env pull .env.local

# 6. Verify local file
cat .env.local | grep FORMSPREE

# 7. Test locally
pnpm dev
# Visit: http://localhost:3000/#contact
# Submit test form

# 8. Deploy to production
vercel --prod

# 9. Test production
open https://ferryhinardi.com/#contact
# Submit real test form

# 10. Check Formspree dashboard
open https://formspree.io/forms
# Verify submission received
```

---

## Quick Reference

```bash
# Add environment variable
vercel env add VARIABLE_NAME

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME

# Pull to local
vercel env pull .env.local

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs --prod

# Project info
vercel project ls
```

---

## Resources

- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Project Configuration**: https://vercel.com/docs/cli/project
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Last Updated**: December 30, 2025
**Project**: ferryhinardi.com
**Status**: Ready to configure Formspree Form ID
