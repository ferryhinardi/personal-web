# GitHub Automation Configuration

This directory contains configurations for automated workflows, AI agents, and skills for the personal portfolio website.

## Directory Structure

```
.github/
├── workflows/           # GitHub Actions workflows
│   ├── ci.yml          # Main CI/CD pipeline
│   └── dependency-update.yml  # Automated dependency updates
├── agent/              # AI Agent configurations
│   ├── config.yml      # Agent capabilities and settings
│   └── prompt.md       # Agent instructions and context
├── skill/              # Automated skills
│   ├── performance-optimization.yml  # Performance monitoring
│   ├── dependency-management.yml     # Dependency updates
│   └── content-validation.yml        # Content validation
└── README.md           # This file
```

## Workflows

### CI Workflow (`ci.yml`)

Main CI/CD pipeline that runs on every push and pull request.

**Jobs:**
1. **Lint & Type Check** - Validates TypeScript types
2. **Build** - Creates production build and uploads artifacts
3. **Lighthouse** - Runs performance audits (PR only)
4. **Deploy Preview** - Deploys to Vercel preview (PR only)
5. **Deploy Production** - Deploys to production (main branch only)

**Triggers:**
- Push to `main` or `feat/vite-migration`
- Pull requests to `main`

**Required Secrets:**
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Dependency Update Workflow (`dependency-update.yml`)

Automated dependency management workflow.

**Features:**
- Runs weekly (Monday 9am UTC)
- Updates all dependencies to latest versions
- Runs type check and build
- Creates automated PR with changes
- Includes co-author attribution

**Manual Trigger:**
```bash
gh workflow run dependency-update.yml
```

## AI Agent

The AI agent is configured to help maintain and improve the website automatically.

### Capabilities

- **Code Review** - Reviews PRs for TypeScript safety, performance, and best practices
- **Dependency Management** - Monitors and updates dependencies
- **Performance Optimization** - Analyzes bundle size and Lighthouse scores
- **Content Updates** - Assists with updating resume data
- **Bug Fixes** - Identifies and fixes TypeScript/build errors
- **Documentation** - Keeps docs up to date

### Configuration (`agent/config.yml`)

Defines agent capabilities, tech stack awareness, code standards, and performance thresholds.

**Key Settings:**
- Bundle size limit: 220KB
- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- Time to Interactive: <3s

### Prompt (`agent/prompt.md`)

Detailed instructions for the AI agent covering:
- Responsibilities and tasks
- Tech stack context
- Code standards and examples
- Performance guidelines
- Commit message format
- Review checklist
- Escalation criteria

## Skills

Automated skills that can be triggered manually or automatically.

### Performance Optimization

**Trigger:**
- Comment `/optimize-performance` on PR
- Weekly schedule
- Lighthouse regression detected

**Actions:**
1. Analyzes bundle size
2. Runs Lighthouse audit (3 runs)
3. Analyzes dependencies
4. Generates optimization report
5. Comments on PR/issue

**Metrics Tracked:**
- Bundle size (KB)
- Lighthouse scores
- Time to Interactive (ms)
- First Contentful Paint (ms)

### Dependency Management

**Trigger:**
- Comment `/update-deps` on PR
- Weekly schedule (Monday 9am UTC)
- Security alert detected

**Actions:**
1. Audits dependencies for vulnerabilities
2. Categorizes updates (critical/major/minor/patch)
3. Creates separate PRs for each category
4. Runs tests and builds
5. Auto-merges safe updates

**Safety Checks:**
- Never auto-update: React, TypeScript
- Manual review required for breaking changes
- Rollback if build fails or bundle >30KB increase

### Content Validation

**Trigger:**
- Changes to `public/resumeData.json`
- Comment `/validate-content` on PR

**Actions:**
1. Validates JSON structure against TypeScript schema
2. Checks image references
3. Validates external links
4. Runs content quality checks (spelling, formatting)
5. Generates validation report
6. Updates type definitions if needed

**Auto-fixes:**
- Trims whitespace
- Normalizes URLs
- Formats dates
- Optimizes images >500KB
- Fixes common typos

## Usage

### Manual Workflow Triggers

```bash
# Run dependency update
gh workflow run dependency-update.yml

# Run main CI workflow
gh workflow run ci.yml
```

### PR Comments (Skills)

Add these comments to PRs to trigger skills:

```
/optimize-performance    # Run performance analysis
/update-deps            # Update dependencies
/validate-content       # Validate resumeData.json
```

### Setting Up Vercel Secrets

1. Get your Vercel token:
   ```bash
   npx vercel login
   npx vercel link
   ```

2. Add secrets to GitHub:
   - Go to Settings → Secrets and variables → Actions
   - Add `VERCEL_TOKEN`
   - Add `VERCEL_ORG_ID`
   - Add `VERCEL_PROJECT_ID`

3. Get IDs from `.vercel/project.json`:
   ```bash
   cat .vercel/project.json
   ```

## Branch Strategy

- `main` - Production branch
- `feat/*` - New features
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks

## Performance Thresholds

| Metric | Target | Alert If |
|--------|--------|----------|
| Bundle Size | <220KB | +20KB |
| Lighthouse Performance | >90 | <85 |
| Lighthouse Accessibility | >95 | <90 |
| Time to Interactive | <3s | >3.5s |
| First Contentful Paint | <1.5s | >2s |

## Best Practices

1. **Always include co-author:**
   ```
   Co-Authored-By: Warp <agent@warp.dev>
   ```

2. **Use conventional commits:**
   ```
   feat(components): add dark mode
   fix(build): resolve TypeScript error
   chore(deps): update dependencies
   ```

3. **Wait for CI before merging:**
   - Type check must pass
   - Build must succeed
   - Lighthouse scores acceptable

4. **Test locally first:**
   ```bash
   pnpm exec tsc --noEmit
   pnpm run build
   pnpm run preview
   ```

## Troubleshooting

### Workflow Fails

1. Check workflow logs in Actions tab
2. Verify all secrets are set correctly
3. Ensure pnpm-lock.yaml is committed
4. Run commands locally to reproduce

### Agent Not Responding

1. Check agent configuration is valid YAML
2. Verify triggers are correctly formatted
3. Review agent logs (if available)

### Build Failures

1. Clear cache and reinstall:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. Run type check:
   ```bash
   pnpm exec tsc --noEmit
   ```

3. Check for missing dependencies:
   ```bash
   pnpm audit
   ```

## Contributing

When adding new workflows or skills:

1. Test thoroughly in a feature branch
2. Document all new features
3. Update this README
4. Add appropriate triggers and safeguards
5. Include error handling and rollback strategies

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [pnpm Documentation](https://pnpm.io)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
