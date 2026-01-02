# Features & Functionality Roadmap

**Step 6 of 8** - Website Enhancement Plan  
**Status:** 📋 Documented  
**Last Updated:** January 2, 2026

---

## Overview

This document outlines planned features and functionality improvements for Ferry Hinardi's portfolio website. These enhancements will improve user experience, engagement, and demonstrate technical capabilities.

---

## Table of Contents

1. [Current Feature Inventory](#current-feature-inventory)
2. [Planned Features](#planned-features)
3. [Feature Priority Matrix](#feature-priority-matrix)
4. [Technical Implementation](#technical-implementation)
5. [Feature: Blog Section](#feature-blog-section)
6. [Feature: Enhanced Dark Mode](#feature-enhanced-dark-mode)
7. [Feature: Advanced Animations](#feature-advanced-animations)
8. [Feature: Enhanced Contact Form](#feature-enhanced-contact-form)
9. [Feature: Portfolio Filtering](#feature-portfolio-filtering)
10. [Feature: Print-Friendly Resume](#feature-print-friendly-resume)
11. [Feature: Skills Visualization](#feature-skills-visualization)
12. [Feature: Project Timeline](#feature-project-timeline)
13. [Implementation Roadmap](#implementation-roadmap)
14. [Technical Considerations](#technical-considerations)

---

## Current Feature Inventory

### ✅ Implemented Features

**Core Functionality:**
- Single-page application (SPA) with smooth scrolling
- Responsive design (mobile, tablet, desktop)
- Dark mode toggle with persistence
- Portfolio project showcase with modals
- Resume/CV display with download
- Contact form with Formspree integration
- GitHub activity feed integration
- LinkedIn testimonials display
- Tech stack badges with icons
- Live demo buttons for projects
- PWA capabilities (offline support, installable)

**Performance Features:**
- Lazy loading for components
- Code splitting (vite + React.lazy)
- Image optimization (WebP format)
- Resource hints (preconnect, dns-prefetch)

**Analytics & Monitoring:**
- Google Analytics 4 integration
- Core Web Vitals tracking
- Error boundary for crash recovery

---

## Planned Features

### High Priority (High Impact, Medium Effort)

1. **Blog Section** 📝
   - Technical blog posts and tutorials
   - Markdown support with syntax highlighting
   - SEO-optimized article pages
   - RSS feed for subscribers
   - **Impact:** Content marketing, thought leadership, SEO boost
   - **Effort:** 2-3 weeks

2. **Enhanced Portfolio Filtering** 🔍
   - Filter by tech stack (React, TypeScript, GraphQL, etc.)
   - Filter by project type (E-commerce, Finance, SaaS)
   - Search functionality
   - Sort by date, complexity, or impact
   - **Impact:** Better user experience, easier project discovery
   - **Effort:** 1 week

3. **Advanced Animations** ✨
   - Scroll-triggered animations (Framer Motion)
   - Smooth page transitions
   - Interactive hero section
   - Micro-interactions (hover effects, button animations)
   - **Impact:** Modern feel, higher engagement
   - **Effort:** 1-2 weeks

4. **Skills Visualization** 📊
   - Interactive skill radar/bar charts
   - Years of experience indicators
   - Proficiency levels
   - Technology timeline
   - **Impact:** Visual demonstration of expertise
   - **Effort:** 1 week

### Medium Priority (Medium Impact, Low-Medium Effort)

5. **Enhanced Contact Form** 📧
   - Multi-step form with progress indicator
   - File upload for project inquiries
   - Calendar integration for scheduling calls
   - Email confirmation/autoresponder
   - **Impact:** Better lead qualification, professionalism
   - **Effort:** 1 week

6. **Project Timeline Visualization** 📅
   - Chronological project history
   - Interactive timeline with milestones
   - Filterable by year or company
   - **Impact:** Clear career progression narrative
   - **Effort:** 1 week

7. **Enhanced Dark Mode** 🌓
   - System preference detection
   - Smooth theme transitions
   - Theme preview before switching
   - Custom color themes (not just light/dark)
   - **Impact:** Better UX, modern feel
   - **Effort:** 3-4 days

8. **Print-Optimized Resume** 🖨️
   - Dedicated print stylesheet
   - Single-page PDF-ready layout
   - QR code linking to portfolio
   - Print preview mode
   - **Impact:** Easy resume sharing, offline accessibility
   - **Effort:** 2-3 days

### Low Priority (Nice to Have)

9. **Testimonials Carousel** 💬
   - Auto-rotating testimonials
   - Manual navigation
   - Video testimonials support
   - **Effort:** 2-3 days

10. **Language Switcher** 🌐
    - English/Indonesian toggle
    - i18n setup with react-i18next
    - **Effort:** 1 week

11. **Easter Eggs** 🎁
    - Konami code activation
    - Hidden developer console messages
    - Interactive 404 page
    - **Effort:** 1-2 days

12. **Code Playground** 💻
    - Embedded code examples
    - Live code editor (CodeSandbox/StackBlitz)
    - **Effort:** 3-4 days

---

## Feature Priority Matrix

| Feature | Impact | Effort | Priority | ROI |
|---------|--------|--------|----------|-----|
| Blog Section | High | High | P0 | High |
| Portfolio Filtering | High | Low | P0 | Very High |
| Advanced Animations | High | Medium | P1 | High |
| Skills Visualization | Medium | Low | P1 | High |
| Enhanced Contact Form | Medium | Low | P1 | Medium |
| Project Timeline | Medium | Low | P2 | Medium |
| Enhanced Dark Mode | Medium | Low | P2 | Medium |
| Print-Optimized Resume | Medium | Low | P2 | Medium |
| Testimonials Carousel | Low | Low | P3 | Low |
| Language Switcher | Low | High | P3 | Low |
| Easter Eggs | Low | Very Low | P4 | Fun |
| Code Playground | Medium | Medium | P3 | Medium |

**Legend:**
- **P0:** Critical - Implement ASAP
- **P1:** High - Implement soon
- **P2:** Medium - Nice to have
- **P3:** Low - Future consideration
- **P4:** Optional - Time permitting

---

## Technical Implementation

### Technology Stack for New Features

**Blog Section:**
- **Content:** Markdown with frontmatter (MDX)
- **Parser:** `remark` + `rehype` ecosystem
- **Syntax Highlighting:** `shiki` or `prism-react-renderer`
- **Routing:** React Router v6 (dynamic routes)
- **CMS Option:** Contentful, Sanity, or file-based
- **Build:** Static generation at build time

**Animations:**
- **Library:** Framer Motion
- **Alternatives:** React Spring, GSAP
- **Scroll Detection:** `intersection-observer` API
- **Performance:** Use `will-change`, `transform`, `opacity` only

**Charts/Visualizations:**
- **Library:** Recharts (already in use)
- **Alternatives:** Chart.js, D3.js (for custom visualizations)
- **Responsive:** Use percentage-based sizing

**Form Enhancements:**
- **Validation:** React Hook Form + Zod
- **File Upload:** Formspree Pro or Cloudinary
- **Calendar:** Cal.com embed or Calendly integration

---

## Feature: Blog Section

### Requirements

**Content Management:**
- Markdown files in `content/blog/` directory
- Frontmatter metadata (title, date, tags, excerpt, cover image)
- Author information
- Reading time calculation
- Table of contents generation

**Features:**
- Blog post list with pagination
- Individual blog post pages
- Syntax highlighting for code blocks
- Image optimization
- Social sharing buttons
- Related posts suggestions
- Comment system (optional - Disqus, Utterances, or Giscus)

**SEO:**
- Dynamic meta tags per post
- Open Graph images
- Structured data (Article schema)
- RSS/Atom feed
- Sitemap inclusion

### File Structure

```
content/
  blog/
    2024-01-15-react-hooks-deep-dive.md
    2024-02-20-graphql-best-practices.md
    2024-03-10-performance-optimization.md
src/
  components/
    blog/
      BlogList.tsx
      BlogPost.tsx
      BlogCard.tsx
      BlogTag.tsx
      BlogSearch.tsx
  pages/
    Blog.tsx
    BlogPost.tsx
  utils/
    markdown.ts
    blogHelpers.ts
```

### Implementation Steps

1. **Setup Markdown Processing** (1 day)
   ```bash
   pnpm add remark remark-html remark-gfm rehype-highlight gray-matter
   ```

2. **Create Blog Components** (2 days)
   - BlogList component with grid layout
   - BlogCard with image, title, excerpt, tags
   - BlogPost component with MDX rendering
   - BlogTag filtering component

3. **Add Routing** (1 day)
   ```bash
   pnpm add react-router-dom
   ```
   - Setup routes: `/blog`, `/blog/:slug`
   - Add navigation to Header component

4. **Implement Search & Filter** (1 day)
   - Search by title/content
   - Filter by tags/categories
   - Sort by date

5. **SEO & Social Sharing** (1 day)
   - Generate dynamic meta tags
   - Add Open Graph images
   - Create RSS feed

6. **Write Initial Blog Posts** (2-3 days)
   - React performance optimization
   - GraphQL API design patterns
   - TypeScript tips and tricks
   - Traveloka project retrospective

### Code Example: Blog Post Component

```tsx
// src/pages/BlogPost.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogPostData {
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  content: string;
  coverImage?: string;
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/content/blog/${slug}.md`);
        const markdown = await response.text();
        
        // Parse frontmatter and content
        const parsed = parseMarkdown(markdown);
        setPost(parsed);
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Helmet>
        <title>{post.title} | Ferry Hinardi</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          {post.coverImage && (
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString()}
            </time>
            <span>by {post.author}</span>
            <span>{calculateReadingTime(post.content)} min read</span>
          </div>
          <div className="flex gap-2 mt-4">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-12 pt-8 border-t">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Share on Twitter
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Share on LinkedIn
            </button>
          </div>
        </footer>
      </article>
    </>
  );
};

// Helper functions
function parseMarkdown(markdown: string): BlogPostData {
  // Simple frontmatter parser (use gray-matter in production)
  const lines = markdown.split('\n');
  const frontmatter: any = {};
  let contentStart = 0;

  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        contentStart = i + 1;
        break;
      }
      const [key, ...value] = lines[i].split(':');
      frontmatter[key.trim()] = value.join(':').trim();
    }
  }

  return {
    ...frontmatter,
    content: lines.slice(contentStart).join('\n'),
  };
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

### Example Blog Post Content

```markdown
---
title: "Deep Dive: React Performance Optimization"
date: 2024-01-15
author: Ferry Hinardi
tags: [React, Performance, JavaScript, Web Development]
excerpt: "Learn advanced techniques for optimizing React applications, from memoization to code splitting and beyond."
coverImage: "/images/blog/react-performance.jpg"
---

# Deep Dive: React Performance Optimization

React is fast, but as your application grows, you might notice performance bottlenecks. In this article, I'll share practical techniques I've used at Traveloka to keep our React apps blazing fast.

## Table of Contents

1. [Understanding React Rendering](#understanding-react-rendering)
2. [Memoization Techniques](#memoization-techniques)
3. [Code Splitting Strategies](#code-splitting-strategies)
4. [Virtual Scrolling](#virtual-scrolling)

## Understanding React Rendering

React's rendering process is generally fast, but unnecessary re-renders can slow down your app...

```jsx
// Bad: Re-renders on every parent update
function ExpensiveComponent({ data }) {
  const result = heavyComputation(data);
  return <div>{result}</div>;
}

// Good: Only re-renders when data changes
const ExpensiveComponent = React.memo(({ data }) => {
  const result = useMemo(() => heavyComputation(data), [data]);
  return <div>{result}</div>;
});
```

[... rest of blog content ...]
```

---

## Feature: Enhanced Dark Mode

### Current Implementation

**Status:** Basic dark mode implemented  
**Location:** `src/hooks/useDarkMode.ts`, `src/components/ui/theme-toggle.tsx`

**Current Features:**
- Toggle between light and dark themes
- Persists preference in localStorage
- CSS variables for theme colors

### Enhancements Needed

1. **System Preference Detection**
   ```tsx
   useEffect(() => {
     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
     
     // Set initial theme based on system preference if no saved preference
     if (!localStorage.getItem('theme')) {
       setTheme(mediaQuery.matches ? 'dark' : 'light');
     }

     // Listen for system preference changes
     const handler = (e: MediaQueryListEvent) => {
       if (!localStorage.getItem('theme')) {
         setTheme(e.matches ? 'dark' : 'light');
       }
     };

     mediaQuery.addEventListener('change', handler);
     return () => mediaQuery.removeEventListener('change', handler);
   }, []);
   ```

2. **Smooth Transitions**
   ```css
   /* Add to index.css */
   :root {
     --transition-theme: 200ms ease-in-out;
   }

   * {
     transition: 
       background-color var(--transition-theme),
       color var(--transition-theme),
       border-color var(--transition-theme);
   }

   /* Disable transitions during page load */
   .no-transition * {
     transition: none !important;
   }
   ```

3. **Theme Preview**
   - Hover effect showing theme preview
   - Click to confirm theme change

4. **Additional Themes**
   - Light (current)
   - Dark (current)
   - High Contrast
   - Sepia (for reading)

### Implementation

**Dependencies:**
```bash
# Already installed, no new dependencies needed
```

**Code Changes:**

```tsx
// src/hooks/useDarkMode.ts (enhanced)
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast' | 'sepia';

export const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Load saved theme or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPreference);
    }
  }, [systemPreference]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  };

  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { 
    theme, 
    toggleTheme, 
    setTheme: setSpecificTheme,
    systemPreference,
    isUsingSystemPreference: !localStorage.getItem('theme')
  };
};
```

**CSS Variables:**

```css
/* src/index.css - Add theme variants */
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2b2b2b;
  --text-secondary: #6c757d;
  --accent: #11ABB0;
}

:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e5e5e5;
  --text-secondary: #b0b0b0;
  --accent: #11ABB0;
}

:root[data-theme="high-contrast"] {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent: #ffff00;
}

:root[data-theme="sepia"] {
  --bg-primary: #f4ecd8;
  --bg-secondary: #e8dcc0;
  --text-primary: #5b4636;
  --text-secondary: #8b7355;
  --accent: #b8860b;
}
```

---

## Feature: Advanced Animations

### Animation Strategy

**Goals:**
- Enhance user engagement
- Create smooth, delightful interactions
- Maintain 60fps performance
- Respect `prefers-reduced-motion`

### Types of Animations

1. **Page Load Animations**
   - Fade in from bottom
   - Stagger children elements
   - Hero section entrance

2. **Scroll-Based Animations**
   - Fade in on scroll
   - Parallax effects
   - Progress indicators

3. **Micro-interactions**
   - Button hover/press states
   - Card hover effects
   - Form input focus animations

4. **Page Transitions**
   - Smooth route changes
   - Loading states

### Implementation with Framer Motion

**Installation:**
```bash
pnpm add framer-motion
```

**Code Examples:**

```tsx
// src/components/ui/fade-in.tsx
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0,
  direction = 'up' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};
```

```tsx
// src/components/ui/stagger-container.tsx
import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children,
  staggerDelay = 0.1 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
};
```

**Usage in Components:**

```tsx
// src/components/Portfolio.tsx
import { FadeIn } from './ui/fade-in';
import { StaggerContainer, StaggerItem } from './ui/stagger-container';

export const Portfolio: React.FC = () => {
  return (
    <section id="portfolio">
      <FadeIn>
        <h1>My Portfolio</h1>
      </FadeIn>

      <StaggerContainer>
        {projects.map(project => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};
```

**Respect User Preferences:**

```tsx
// src/utils/animations.ts
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// In components
const transition = shouldReduceMotion() 
  ? { duration: 0 } 
  : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };
```

---

## Feature: Enhanced Contact Form

### Current Implementation

**Status:** Basic form with Formspree  
**Location:** `src/components/Contact.tsx`

**Current Features:**
- Name, email, message fields
- Basic validation
- Formspree integration
- Success/error feedback

### Enhancements

1. **Multi-Step Form**
   - Step 1: Contact info (name, email, phone)
   - Step 2: Project details (budget, timeline, type)
   - Step 3: Message & attachments
   - Progress indicator

2. **Advanced Validation**
   - Real-time validation with Zod
   - Phone number formatting
   - Email verification
   - Character count for message

3. **File Upload**
   - Drag & drop interface
   - Multiple file support
   - File type validation
   - Preview uploaded files

4. **Calendar Integration**
   - "Schedule a call" option
   - Cal.com or Calendly embed
   - Time zone detection

### Implementation

**Dependencies:**
```bash
pnpm add react-hook-form zod @hookform/resolvers react-dropzone
```

**Code Example:**

```tsx
// src/components/ContactFormEnhanced.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  projectType: z.enum(['web-app', 'mobile-app', 'consulting', 'other']),
  budget: z.enum(['5k-10k', '10k-25k', '25k-50k', '50k+']),
  timeline: z.enum(['asap', '1-3-months', '3-6-months', '6-months+']),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactFormEnhanced: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ['name', 'email', 'phone'] 
      : ['projectType', 'budget', 'timeline'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (data: ContactFormData) => {
    console.log('Form submitted:', data);
    // Submit to Formspree
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`flex-1 h-2 mx-1 rounded ${
                i <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Step {step} of {totalSteps}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl mb-4">Contact Information</h3>
            
            <div className="mb-4">
              <label className="block mb-2">Name *</label>
              <input
                {...register('name')}
                className="w-full p-3 border rounded"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full p-3 border rounded"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Phone (optional)</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full p-3 border rounded"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl mb-4">Project Details</h3>
            
            <div className="mb-4">
              <label className="block mb-2">Project Type *</label>
              <select {...register('projectType')} className="w-full p-3 border rounded">
                <option value="">Select...</option>
                <option value="web-app">Web Application</option>
                <option value="mobile-app">Mobile App</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
              {errors.projectType && (
                <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Budget *</label>
              <select {...register('budget')} className="w-full p-3 border rounded">
                <option value="">Select...</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k+">$50,000+</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Timeline *</label>
              <select {...register('timeline')} className="w-full p-3 border rounded">
                <option value="">Select...</option>
                <option value="asap">ASAP</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-months+">6+ months</option>
              </select>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl mb-4">Tell Me About Your Project</h3>
            
            <div className="mb-4">
              <label className="block mb-2">Message *</label>
              <textarea
                {...register('message')}
                className="w-full p-3 border rounded h-32"
                placeholder="Describe your project, goals, and any specific requirements..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Attachments (optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
                <p className="text-gray-600">Drag & drop files here, or click to select</p>
                <p className="text-sm text-gray-400 mt-2">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border rounded hover:bg-gray-100"
          >
            Previous
          </button>
        )}
        
        {step < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};
```

---

## Feature: Portfolio Filtering

### Enhancement Overview

**Current State:** Projects displayed in grid, no filtering  
**Goal:** Allow users to filter/search projects by technology, type, or keyword

### Implementation

**Dependencies:**
```bash
# Already have React, no new dependencies needed
```

**Code Example:**

```tsx
// src/components/PortfolioFilters.tsx
import { useState } from 'react';
import { Badge } from './ui/badge';

interface PortfolioFiltersProps {
  allTechnologies: string[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  technologies: string[];
  type: string;
}

export const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  allTechnologies,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    technologies: [],
    type: 'all',
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleTechnology = (tech: string) => {
    const newTechs = filters.technologies.includes(tech)
      ? filters.technologies.filter(t => t !== tech)
      : [...filters.technologies, tech];
    updateFilter('technologies', newTechs);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search projects..."
        value={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        className="w-full p-3 border rounded"
      />

      {/* Technology Filters */}
      <div>
        <h4 className="mb-2 font-semibold">Technologies:</h4>
        <div className="flex flex-wrap gap-2">
          {allTechnologies.map(tech => (
            <Badge
              key={tech}
              variant={filters.technologies.includes(tech) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTechnology(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="mb-2 font-semibold">Project Type:</h4>
        <div className="flex gap-2">
          {['all', 'e-commerce', 'finance', 'saas', 'tool'].map(type => (
            <button
              key={type}
              onClick={() => updateFilter('type', type)}
              className={`px-4 py-2 rounded ${
                filters.type === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.technologies.length > 0 || filters.search || filters.type !== 'all') && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.technologies.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
              <button
                onClick={() => toggleTechnology(tech)}
                className="ml-2 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
          <button
            onClick={() => {
              setFilters({ search: '', technologies: [], type: 'all' });
              onFilterChange({ search: '', technologies: [], type: 'all' });
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## Implementation Roadmap

### Phase 1: High Priority Features (4-6 weeks)

**Week 1-2: Portfolio Filtering**
- [ ] Design filter UI
- [ ] Implement filter logic
- [ ] Add search functionality
- [ ] Add URL state management (query params)
- [ ] Test across devices

**Week 3-5: Blog Section**
- [ ] Setup markdown processing
- [ ] Create blog components
- [ ] Add routing
- [ ] Implement SEO features
- [ ] Write 3-5 initial blog posts
- [ ] Setup RSS feed

**Week 6: Advanced Animations**
- [ ] Install Framer Motion
- [ ] Create reusable animation components
- [ ] Add scroll-based animations
- [ ] Implement micro-interactions
- [ ] Performance testing

### Phase 2: Medium Priority Features (3-4 weeks)

**Week 7-8: Skills Visualization**
- [ ] Design visualization layout
- [ ] Implement chart components
- [ ] Add interactive elements
- [ ] Mobile responsiveness

**Week 9-10: Enhanced Contact Form**
- [ ] Multi-step form implementation
- [ ] Advanced validation
- [ ] File upload feature
- [ ] Calendar integration
- [ ] Testing & refinement

### Phase 3: Low Priority Features (2-3 weeks)

**Week 11: Enhanced Dark Mode**
- [ ] System preference detection
- [ ] Smooth transitions
- [ ] Additional theme options
- [ ] Theme preview feature

**Week 12: Project Timeline & Print Resume**
- [ ] Timeline visualization
- [ ] Print stylesheet
- [ ] QR code generation
- [ ] Final polish

---

## Technical Considerations

### Performance Budget

**New Features Must:**
- Add < 50KB to bundle size
- Maintain Lighthouse Performance score > 85
- Not increase LCP by more than 500ms
- Support code splitting/lazy loading

### Accessibility Requirements

**All Features Must:**
- Meet WCAG 2.1 Level AA
- Support keyboard navigation
- Include proper ARIA labels
- Respect `prefers-reduced-motion`
- Maintain color contrast ratios

### Browser Compatibility

**Target Support:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

### Testing Strategy

**Each Feature Requires:**
- Unit tests for logic
- Integration tests for user flows
- E2E tests for critical paths
- Visual regression tests
- Manual QA on real devices

---

## Success Metrics

### User Engagement

- Time on site: Target > 3 minutes
- Bounce rate: Target < 40%
- Pages per session: Target > 2.5
- Contact form completion: Target > 25%

### Technical Performance

- Lighthouse Performance: Target > 90
- LCP: Target < 2.5s
- CLS: Target < 0.1
- TTI: Target < 3.5s

### Business Goals

- Monthly unique visitors: Track growth
- Contact form submissions: Track conversion
- Blog post views: Measure content engagement
- Resume downloads: Track interest

---

## Questions to Consider

1. **Blog Section:**
   - Should we build custom or use a CMS like Contentful?
   - How often do you plan to publish?
   - Do you want comments enabled?

2. **Contact Form:**
   - Do you have Formspree Pro for file uploads?
   - Should we integrate your calendar directly?

3. **Animations:**
   - Any specific animation style you prefer?
   - Should we animate the hero section more?

4. **Priority:**
   - Which feature would provide most value for job search?
   - Any features you want to skip or postpone?

---

## Next Steps

1. **Review this roadmap** and prioritize features
2. **Decide on blog strategy** (custom vs CMS)
3. **Approve designs** for new features
4. **Start implementation** with highest priority
5. **Iterate based on feedback** and analytics

**Status:** Ready to begin implementation upon approval
