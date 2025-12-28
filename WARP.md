# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
This is a ReactJS-based personal resume/portfolio website. It's a single-page application (SPA) built using Create React App (v1.0.17) with React 16.2.0. The entire site is data-driven from a JSON file (`public/resumeData.json`), making it easily customizable without touching the code.

## Commands

### Development
```bash
npm start
# Starts the development server at http://localhost:3000
# Uses react-scripts with hot reload
```

### Build
```bash
npm run build
# Creates an optimized production build in /build directory
# Ready for deployment to static hosting
```

### Testing
```bash
npm test
# Runs tests in watch mode using Jest
# Test files use .test.js suffix
```

## Architecture

### Data-Driven Design
- **Single Source of Truth**: All content lives in `public/resumeData.json`
- **Structure**: JSON organized into sections: `main`, `resume`, `portfolio`, `testimonials`
- **Dynamic Rendering**: Components receive data via props and render accordingly
- **Content Updates**: Edit JSON file only; no code changes needed for content updates

### Component Structure
- **App.js**: Root component that fetches `resumeData.json` via jQuery AJAX on mount and passes data to child components
- **Components**: Isolated, presentation-only components in `src/Components/`
  - Header: Navigation + hero section with name, occupation, social links
  - About: Bio and profile picture
  - Resume: Education history, work experience, skills with progress bars
  - Portfolio: Project grid with images, titles, descriptions, external links
  - Testimonials: Quotes carousel
  - Contact: Contact form and information
  - Footer: Social links and footer text

### Key Patterns
- **Data Flow**: Unidirectional from App → Components via props
- **Conditional Rendering**: Components check `if(this.props.data)` before rendering
- **Asset References**: Images referenced relative to `public/` (e.g., `images/portfolio/project.png`)
- **Analytics**: Google Analytics integrated via `react-ga` (initialized in App constructor)

### Static Assets
- **Images**: `public/images/` — header background, testimonials background, portfolio images, profile picture
- **Favicon**: `public/favicon.ico` (must keep same filename)
- **CSS**: `public/css/` — pre-built stylesheets (not React components)
- **JS**: `public/js/` — jQuery plugins for smooth scroll, animations

## Styling
- Uses Prettier with config: `.prettierrc.js`
  - No bracket spacing: `{foo}` not `{ foo }`
  - JSX brackets on same line
  - Single quotes
  - Trailing commas
- Legacy template uses external CSS in `public/css/`, not CSS Modules or styled-components
- Responsive design via media queries in CSS

## Data Schema (resumeData.json)
- `main`: Name, occupation, bio, contact info, social media links, profile image
- `resume`: Education array, work array, skills array (with percentage levels)
- `portfolio`: Projects array with title, category, image filename, url
- `testimonials`: Testimonials array with text and user attribution

## Content Updates Workflow
1. Edit `public/resumeData.json` with new data
2. Replace images in `public/images/` (keep filenames consistent or update JSON references)
3. Run `npm start` to preview changes
4. Build with `npm run build` for production

## Dependencies
- **react-ga**: Google Analytics tracking (ID: UA-78972539-1 in App.js)
- **jquery**: Used for AJAX call to load JSON and for legacy template scripts
- **html-react-parser**: Parse HTML strings in JSON data (e.g., bio with links)

## Important Notes
- **React Version**: Uses React 16.2.0 (older version) — class components only, no hooks
- **Legacy Setup**: Built on create-react-app 1.0.17 (not ejected)
- **No TypeScript**: Pure JavaScript project
- **No Test Coverage**: Minimal test setup (only App.test.js exists)
- **Service Worker**: Registered for offline capability
