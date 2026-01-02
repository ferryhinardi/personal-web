# Testing & Quality Assurance Plan

## Current Testing Status

### Test Coverage
- Unit Tests: 3 test files
- Integration Tests: 0
- E2E Tests: 0  
- Visual Tests: 0

### Existing Tests
- `src/components/__tests__/About.test.tsx`
- `src/components/__tests__/Footer.test.tsx`
- `src/components/__tests__/Header.test.tsx`

---

## Testing Strategy

### Test Pyramid

```
           /\
          /  \         E2E Tests (5%)
         /    \        - Critical user flows
        /------\       - Cross-browser testing
       /        \      
      /          \     Integration Tests (15%)
     /            \    - Component interactions
    /--------------\   - API integration
   /                \  
  /                  \ Unit Tests (80%)
 /____________________\ - Pure functions
                        - Components
                        - Hooks
```

---

## Step 5: Implement Comprehensive Testing

### 5.1 Unit Tests (Priority: HIGH)

#### Components to Test

**High Priority:**
1. `Portfolio.tsx` - Complex filtering and state logic
2. `Resume.tsx` - Data transformation
3. `Contact.tsx` - Form validation
4. `Header.tsx` - Navigation state
5. `About.tsx` - Dynamic content

**Medium Priority:**
6. UI Components (`src/components/ui/*`)
7. Custom Hooks (`src/hooks/*`)
8. Utility Functions (`src/utils/*`)

#### Example Unit Test Template

```typescript
// __tests__/Portfolio.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Portfolio from '../Portfolio';

const mockData = {
  projects: [
    {
      title: 'Test Project',
      category: 'Web Development',
      technologies: ['React', 'TypeScript'],
      url: 'https://example.com'
    }
  ]
};

describe('Portfolio Component', () => {
  it('renders all projects', () => {
    render(<Portfolio data={mockData} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('filters projects by technology', () => {
    render(<Portfolio data={mockData} />);
    const filter = screen.getByText('React');
    fireEvent.click(filter);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('opens project modal on click', async () => {
    render(<Portfolio data={mockData} />);
    const projectCard = screen.getByText('Test Project');
    fireEvent.click(projectCard);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
```

### 5.2 Integration Tests (Priority: MEDIUM)

#### Test Scenarios

1. **Data Loading Flow**
   ```typescript
   // __tests__/integration/DataLoading.test.tsx
   it('loads resume data and displays all sections', async () => {
     render(<App />);
     
     // Wait for loading to complete
     await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
     
     // Verify all sections are rendered
     expect(screen.getByText('About')).toBeInTheDocument();
     expect(screen.getByText('Resume')).toBeInTheDocument();
     expect(screen.getByText('Portfolio')).toBeInTheDocument();
   });
   ```

2. **Form Submission**
   ```typescript
   it('submits contact form successfully', async () => {
     render(<Contact data={mockContactData} />);
     
     await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
     await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
     await userEvent.type(screen.getByLabelText(/message/i), 'Hello!');
     
     const submitButton = screen.getByRole('button', { name: /send/i });
     await userEvent.click(submitButton);
     
     await waitFor(() => {
       expect(screen.getByText(/message sent/i)).toBeInTheDocument();
     });
   });
   ```

3. **Dark Mode Toggle**
   ```typescript
   it('toggles dark mode across components', () => {
     render(<App />);
     
     const darkModeToggle = screen.getByRole('button', { name: /dark mode/i });
     fireEvent.click(darkModeToggle);
     
     expect(document.documentElement.classList).toContain('dark');
   });
   ```

### 5.3 E2E Tests with Playwright (Priority: MEDIUM)

#### Critical User Journeys

1. **Homepage to Contact**
   ```typescript
   // tests/e2e/contact-flow.spec.ts
   import { test, expect } from '@playwright/test';

   test('user can navigate and submit contact form', async ({ page }) => {
     await page.goto('/');
     
     // Verify homepage loads
     await expect(page.locator('h1')).toContainText('Ferry Hinardi');
     
     // Navigate to contact
     await page.click('text=Contact');
     await expect(page).toHaveURL('/#contact');
     
     // Fill form
     await page.fill('[name="name"]', 'Test User');
     await page.fill('[name="email"]', 'test@example.com');
     await page.fill('[name="message"]', 'Test message');
     
     // Submit
     await page.click('button[type="submit"]');
     
     // Verify success
     await expect(page.locator('.success-message')).toBeVisible();
   });
   ```

2. **Portfolio Browsing**
   ```typescript
   test('user can browse portfolio projects', async ({ page }) => {
     await page.goto('/#portfolio');
     
     // Verify projects loaded
     await expect(page.locator('.project-card')).toHaveCount(5);
     
     // Filter by technology
     await page.click('text=React.js');
     await expect(page.locator('.project-card')).not.toHaveCount(5);
     
     // Open project detail
     await page.click('.project-card:first-child');
     await expect(page.locator('[role="dialog"]')).toBeVisible();
     
     // View live demo
     const [newPage] = await Promise.all([
       page.waitForEvent('popup'),
       page.click('text=View Live Demo')
     ]);
     expect(newPage.url()).toContain('http');
   });
   ```

3. **Resume Download**
   ```typescript
   test('user can download resume PDF', async ({ page }) => {
     await page.goto('/#resume');
     
     const [download] = await Promise.all([
       page.waitForEvent('download'),
       page.click('text=Download Resume')
     ]);
     
     expect(download.suggestedFilename()).toBe('Ferry-Hinardi-Resume-2025.pdf');
   });
   ```

### 5.4 Visual Regression Testing (Priority: LOW)

Use Playwright or Percy for visual regression:

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test';

test('header matches snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toHaveScreenshot();
});

test('portfolio cards match snapshot', async ({ page }) => {
  await page.goto('/#portfolio');
  await expect(page.locator('.portfolio-section')).toHaveScreenshot();
});
```

### 5.5 Accessibility Testing

```typescript
// __tests__/a11y/accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('Portfolio has no accessibility violations', async () => {
  const { container } = render(<Portfolio data={mockData} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Test Configuration

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/dist/',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});
```

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      
      - run: pnpm install
      - run: pnpx playwright install --with-deps
      - run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Testing Commands

```json
// package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:a11y": "vitest run --testPathPattern=a11y"
  }
}
```

---

## Testing Roadmap

### Week 1: Foundation
- [ ] Add unit tests for Portfolio component
- [ ] Add unit tests for Resume component
- [ ] Add unit tests for Contact form
- [ ] Set up test coverage reporting

### Week 2: Integration & E2E
- [ ] Add integration tests for data loading
- [ ] Set up Playwright E2E framework
- [ ] Write critical user journey tests
- [ ] Add accessibility tests

### Week 3: CI/CD & Polish
- [ ] Configure GitHub Actions for testing
- [ ] Add visual regression testing
- [ ] Achieve 80% code coverage
- [ ] Document testing practices

---

## Quality Metrics

### Target Coverage
- Overall: 80%
- Components: 85%
- Utils: 90%
- Hooks: 85%

### Testing Best Practices
✅ Test user behavior, not implementation details
✅ Use data-testid sparingly (prefer accessible queries)
✅ Keep tests simple and readable
✅ Mock external dependencies
✅ Test error states
✅ Test loading states
✅ Test accessibility

---

**Last Updated**: January 2, 2026  
**Next Review**: Weekly during implementation
