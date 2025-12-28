# Vite Migration Plan

## Overview
This document outlines the step-by-step plan to migrate the personal portfolio website from Create React App 1.0.17 to Vite, upgrading React from 16.2.0 to 18.3+, and modernizing the codebase.

## Current State Analysis

### Technology Stack (Legacy)
- **Build Tool**: Create React App 1.0.17 (released 2017)
- **React Version**: 16.2.0 (class components only, no hooks)
- **Bundler**: Webpack (via CRA)
- **Data Fetching**: jQuery AJAX
- **Styling**: Static CSS files (~50KB total)
- **Package Manager**: npm/yarn
- **Dependencies**: All 7+ years outdated

### Issues with Current Setup
1. **Performance**: Slow build times (webpack-based)
2. **Developer Experience**: No HMR for CSS, slow refresh
3. **Bundle Size**: jQuery adds ~30KB unnecessarily
4. **Maintenance**: Class components harder to maintain than hooks
5. **Modern Features**: No TypeScript, no ES modules, no dynamic imports
6. **Security**: Outdated dependencies with known vulnerabilities

## Migration Strategy

### Phase 1: Setup New Vite Project (Parallel Development)

#### Step 1.1: Initialize Vite Project
```bash
# Create new Vite project in a temporary directory
npm create vite@latest personal-web-vite -- --template react-ts
cd personal-web-vite
npm install
```

#### Step 1.2: Configure Vite
Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
})
```

#### Step 1.3: Setup Project Structure
```
src/
├── assets/           # Images, fonts, static files
├── components/       # React components
│   ├── Header.tsx
│   ├── About.tsx
│   ├── Resume.tsx
│   ├── Portfolio.tsx
│   ├── Testimonials.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── hooks/           # Custom React hooks
│   └── useResumeData.ts
├── types/           # TypeScript types
│   └── resume.types.ts
├── utils/           # Utility functions
│   └── analytics.ts
├── styles/          # Global styles
│   └── index.css
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

### Phase 2: Dependency Migration

#### Step 2.1: Install Core Dependencies
```bash
# React 18
npm install react@^18.3.0 react-dom@^18.3.0

# TypeScript types
npm install -D @types/react @types/react-dom

# Vite plugins
npm install -D @vitejs/plugin-react

# Replace jQuery AJAX - use native fetch or axios
npm install axios

# Analytics - upgrade to GA4
npm install react-ga4

# HTML parser
npm install html-react-parser@latest

# Animation libraries (replacing jQuery plugins)
npm install framer-motion
npm install swiper
npm install react-intersection-observer
```

#### Step 2.2: Remove Legacy Dependencies
Remove from package.json:
- `react-scripts`
- `jquery` (replaced with fetch/axios)
- `react-ga` (upgrade to react-ga4)
- Old `html-react-parser` version

### Phase 3: Code Migration

#### Step 3.1: Convert Class Components to Functional Components

**Before (Class Component):**
```javascript
import React, {Component} from 'react';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resumeData: {},
    };
  }

  getResumeData() {
    $.ajax({
      url: '/resumeData.json',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({resumeData: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
      },
    });
  }

  componentDidMount() {
    this.getResumeData();
  }

  render() {
    return <div className="App">...</div>;
  }
}
```

**After (Functional Component with Hooks):**
```typescript
import { useState, useEffect } from 'react';
import type { ResumeData } from './types/resume.types';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/resumeData.json')
      .then(res => res.json())
      .then(data => {
        setResumeData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      {/* Components */}
    </div>
  );
}
```

#### Step 3.2: Create Custom Hook for Data Fetching

`src/hooks/useResumeData.ts`:
```typescript
import { useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume.types';

export function useResumeData() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/resumeData.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch resume data');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
```

#### Step 3.3: Create TypeScript Types

`src/types/resume.types.ts`:
```typescript
export interface Social {
  name: string;
  url: string;
  className: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface MainData {
  name: string;
  occupation: string;
  description: string;
  image: string;
  bio: string;
  contactmessage: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  resumedownload: string;
  social: Social[];
}

export interface Education {
  school: string;
  degree: string;
  graduated: string;
  description: string;
}

export interface Work {
  company: string;
  title: string;
  years: string;
  description: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface ResumeSection {
  skillmessage: string;
  education: Education[];
  work: Work[];
  skills: Skill[];
}

export interface Project {
  title: string;
  category: string;
  image: string;
  url: string;
}

export interface Portfolio {
  projects: Project[];
}

export interface Testimonial {
  text: string;
  user: string;
}

export interface Testimonials {
  testimonials: Testimonial[];
}

export interface ResumeData {
  main: MainData;
  resume: ResumeSection;
  portfolio: Portfolio;
  testimonials: Testimonials;
}
```

#### Step 3.4: Update Components

Convert each component from class to functional:

**Header Component:**
```typescript
// src/components/Header.tsx
import { MainData } from '@/types/resume.types';

interface HeaderProps {
  data?: MainData;
}

export default function Header({ data }: HeaderProps) {
  if (!data) return null;

  const { name, occupation, description, address, social } = data;

  return (
    <header id="home">
      <nav id="nav-wrap">
        <ul id="nav" className="nav">
          <li className="current">
            <a className="smoothscroll" href="#home">Home</a>
          </li>
          <li><a className="smoothscroll" href="#about">About</a></li>
          <li><a className="smoothscroll" href="#resume">Resume</a></li>
          <li><a className="smoothscroll" href="#portfolio">Works</a></li>
          <li><a className="smoothscroll" href="#testimonials">Testimonials</a></li>
          <li><a className="smoothscroll" href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          <h1 className="responsive-headline">I'm {name}.</h1>
          <h3>
            I'm a {address.city} based <span>{occupation}</span>. {description}.
          </h3>
          <hr />
          <ul className="social">
            {social.map((network) => (
              <li key={network.name}>
                <a href={network.url} aria-label={network.name}>
                  <i className={network.className}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="scrolldown">
        <a className="smoothscroll" href="#about">
          <i className="icon-down-circle"></i>
        </a>
      </p>
    </header>
  );
}
```

### Phase 4: Asset Migration

#### Step 4.1: Move Static Assets
```bash
# Copy images to src/assets
cp -r public/images src/assets/images

# Keep resumeData.json and PDF in public
# Keep favicon in public
```

#### Step 4.2: Update Index.html

`index.html` (root level for Vite):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Ferry Hinardi - Software Engineer Portfolio" />
    <title>Ferry Hinardi - Software Engineer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### Step 4.3: Update CSS Imports

Instead of linking CSS in HTML, import in TypeScript:

`src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Import legacy CSS temporarily (will be replaced with Tailwind)
import '../public/css/default.css'
import '../public/css/layout.css'
import '../public/css/media-queries.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Phase 5: Replace jQuery Plugins

#### Step 5.1: Smooth Scroll (Replace jQuery smoothscroll)
```bash
npm install react-scroll
```

```typescript
import { Link } from 'react-scroll';

<Link to="about" smooth={true} duration={500}>
  About
</Link>
```

#### Step 5.2: Carousel (Replace Flexslider)
```bash
npm install swiper
```

```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

<Swiper spaceBetween={50} slidesPerView={1}>
  <SwiperSlide>Slide 1</SwiperSlide>
</Swiper>
```

#### Step 5.3: Modal (Replace Magnific Popup)
```bash
npm install @headlessui/react
```

```typescript
import { Dialog } from '@headlessui/react';

const [isOpen, setIsOpen] = useState(false);

<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
  <Dialog.Panel>
    {/* Modal content */}
  </Dialog.Panel>
</Dialog>
```

### Phase 6: Analytics Migration

Replace Google Analytics Universal with GA4:

```typescript
// src/utils/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your GA4 ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
```

### Phase 7: Testing & Validation

#### Step 7.1: Test Checklist
- [ ] All pages render correctly
- [ ] Navigation works (smooth scroll)
- [ ] Resume download button works
- [ ] Portfolio images load
- [ ] Contact form submits
- [ ] Social links work
- [ ] Mobile responsive
- [ ] Analytics tracking works
- [ ] Performance (Lighthouse score)

#### Step 7.2: Build & Deploy Test
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Test on local network
npm run build && npx serve -s build
```

### Phase 8: Deployment

#### Step 8.1: Update Vercel Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

#### Step 8.2: Deploy
```bash
vercel --prod
```

## Migration Timeline

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 1: Setup | 2 hours | High |
| Phase 2: Dependencies | 1 hour | High |
| Phase 3: Code Migration | 4-6 hours | High |
| Phase 4: Asset Migration | 1 hour | Medium |
| Phase 5: jQuery Replacement | 2-3 hours | High |
| Phase 6: Analytics | 30 mins | Low |
| Phase 7: Testing | 2 hours | High |
| Phase 8: Deployment | 30 mins | High |
| **Total** | **13-16 hours** | - |

## Rollback Plan

If issues occur:
1. Keep old CRA branch: `git checkout -b cra-backup`
2. Revert Vercel to previous deployment
3. Document issues for next attempt

## Success Metrics

- Build time: < 5 seconds (vs ~30s with CRA)
- Bundle size: < 200KB (vs ~500KB with jQuery)
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
