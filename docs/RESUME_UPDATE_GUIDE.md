# Resume & CV Update Guide

## Current Resume Status

**PDF Version**: `Ferry-Hinardi-Resume-2025.pdf`  
**Last Updated**: January 2025  
**Location**: `/public/Ferry-Hinardi-Resume-2025.pdf`

---

## Resume Update Checklist

### ✅ Data Updates (resumeData.json)

#### Work Experience
- [x] Traveloka (2020-Present) - Current role
- [ ] Add recent achievements (2024-2025)
- [ ] Update project descriptions with current status
- [ ] Add new technologies learned
- [ ] Update metrics (if verifiable)

#### Skills
- [x] React.js (95%)
- [x] TypeScript (90%)
- [x] Next.js (85%)
- [ ] Review skill levels for accuracy
- [ ] Add new skills acquired
- [ ] Remove outdated skills

#### Education
- [x] Bina Nusantara University (2015)
- [ ] Add certifications if any
- [ ] Add relevant courses
- [ ] Add achievements/awards

### 📄 PDF Resume Updates Needed

**Current Issues**:
1. PDF may not reflect latest website content
2. Need to ensure consistency between web and PDF
3. Should include QR code to website
4. Need to optimize for ATS (Applicant Tracking Systems)

**Action Items**:
1. Generate new PDF from website print view
2. Add QR code linking to portfolio
3. Ensure ATS-friendly format
4. Include contact information prominently
5. Add links to GitHub, LinkedIn profiles

---

## Recent Achievements to Add (2024-2025)

### Professional Achievements

1. **Performance Optimization**
   - Improved Traveloka Flight page load time by 40%
   - Reduced JavaScript bundle size by 53%
   - Achieved Lighthouse score of 94

2. **Technical Leadership**
   - Led team of 8 engineers on flight redesign
   - Mentored 3 junior developers
   - Established code review standards

3. **Integration Success**
   - Successfully integrated 5 metasearch platforms
   - 99.9% uptime maintained
   - Zero critical bugs in production

4. **Open Source Contributions**
   - Built Supertool.id - developer tools platform
   - 50+ tools serving developer community
   - Focus on privacy and performance

### Skills Acquired/Improved

**New Technologies**:
- Vite (build tool optimization)
- Tailwind CSS v4 (modern CSS)
- Vercel deployment & edge functions
- Lighthouse CI automation
- Advanced React patterns (suspense, error boundaries)

**Improved Skills**:
- Performance optimization (Core Web Vitals)
- Accessibility (WCAG 2.1)
- SEO optimization
- CI/CD with GitHub Actions
- GraphQL schema design

---

## Resume Formatting Best Practices

### ATS (Applicant Tracking System) Optimization

✅ **DO**:
- Use standard section headings (Experience, Education, Skills)
- Include keywords from job descriptions
- Use simple, clean formatting
- Include both acronyms and full terms (e.g., "UI/UX" and "User Interface")
- List technical skills explicitly
- Use standard fonts (Arial, Calibri, Times New Roman)

❌ **DON'T**:
- Use tables or complex layouts
- Put important info in headers/footers
- Use images for text
- Use unusual fonts or colors
- Hide skills in paragraphs

### Content Guidelines

**Experience Section**:
```
[Company Name] - [Location]
[Job Title] | [Start Date] - [End Date]

• Action verb + what you did + impact/result
• Quantify achievements when possible
• Focus on results, not just responsibilities
• Use past tense for previous roles, present for current

Example:
• Redesigned flight booking system, reducing checkout time by 40% and increasing mobile conversions by 15%
• Led cross-functional team of 8 engineers to integrate 5 metasearch platforms, expanding market reach to 5 new countries
• Optimized application performance, achieving 94/100 Lighthouse score and improving load time from 5.2s to 3.1s
```

**Skills Section**:
```
Technical Skills:
• Languages: TypeScript, JavaScript, Python, SQL
• Frontend: React.js, Next.js, React Native, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, GraphQL, REST APIs
• Databases: MongoDB, PostgreSQL, Redis
• Tools: Git, Docker, AWS, Vercel, GitHub Actions, Vite
• Testing: Jest, React Testing Library, Playwright, Cypress
• Other: Performance Optimization, Accessibility (WCAG 2.1), SEO
```

### Design Tips

1. **Visual Hierarchy**
   - Name and title: Largest font (18-20pt)
   - Section headers: Bold, 14-16pt
   - Body text: 10-12pt
   - Consistent spacing between sections

2. **Contact Information**
   - Full name
   - Phone number
   - Professional email
   - LinkedIn URL
   - GitHub profile
   - Portfolio website
   - Location (city, state/country)

3. **Length**
   - 1 page for < 5 years experience
   - 2 pages for 5-10 years (YOUR CASE)
   - 3+ pages for 10+ years

---

## How to Generate Updated PDF

### Option 1: From Website Print View (Recommended)

1. Visit https://ferryhinardi.com
2. Use the Print button (already built-in)
3. Or manually: Browser → Print → Save as PDF
4. Customize print view if needed in `PrintResume.tsx`

### Option 2: Design Tools

1. **Canva** (Easy, templates available)
   - Use professional resume templates
   - Export as PDF
   - Pros: Beautiful design, easy to use
   - Cons: May not be ATS-friendly

2. **LaTeX** (Professional, ATS-friendly)
   - Use Overleaf with resume templates
   - Full control over formatting
   - Pros: Perfect formatting, ATS-friendly
   - Cons: Learning curve

3. **Google Docs / Microsoft Word**
   - Use resume templates
   - Easy to edit
   - Export as PDF
   - Pros: Familiar, widely compatible
   - Cons: Limited design options

### Option 3: Automated Generation

```typescript
// Generate PDF from resumeData.json programmatically
// Using libraries like:
// - pdfmake
// - jsPDF
// - puppeteer (headless Chrome)

import puppeteer from 'puppeteer';

async function generateResumePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load resume page
  await page.goto('http://localhost:3000/print-resume');
  
  // Generate PDF
  await page.pdf({
    path: 'Ferry-Hinardi-Resume-2025.pdf',
    format: 'Letter',
    printBackground: true,
  });
  
  await browser.close();
}
```

---

## Resume Content Suggestions

### Summary/Objective (Optional but Recommended)

```
Software Engineer with 5+ years of experience building high-performance web applications 
that serve millions of users. Specialized in React.js, TypeScript, and Next.js. 
Proven track record of delivering measurable business impact through technical excellence 
and cross-functional collaboration. Seeking to leverage expertise in modern web technologies 
to drive innovation and user delight.
```

### Highlighting Achievements

**Before (Task-focused)**:
❌ "Worked on Traveloka flight booking system"

**After (Impact-focused)**:
✅ "Redesigned flight booking system serving 5M+ users, reducing checkout time by 40% 
and increasing mobile conversions by 15%, directly contributing to revenue growth"

### Quantifying Impact

Use the **S.T.A.R. Method**:
- **S**ituation: Context and background
- **T**ask: Challenge or responsibility
- **A**ction: What you did
- **R**esult: Measurable outcome

Example:
```
Situation: Flight booking conversion rates were declining on mobile devices
Task: Redesign booking experience to improve mobile UX
Action: Led team of 8 to rebuild system using React/TypeScript, streamlining flow from 5 to 3 steps
Result: Increased mobile conversions by 15%, reduced load time by 40%, achieved 94 Lighthouse score
```

---

## Action Plan

### Immediate (This Week)
1. [ ] Review `resumeData.json` for accuracy
2. [ ] Add recent achievements (2024-2025)
3. [ ] Update skill levels
4. [ ] Generate new PDF using print view
5. [ ] Add QR code to website
6. [ ] Upload new PDF to `/public` folder

### Short-term (This Month)
1. [ ] Create LaTeX version for ATS optimization
2. [ ] Tailor resume for specific job applications
3. [ ] Get feedback from peers/mentors
4. [ ] Update LinkedIn to match resume
5. [ ] Create one-page "executive summary" version

### Ongoing
1. [ ] Update after each major achievement
2. [ ] Keep metrics verifiable and accurate
3. [ ] Maintain consistency across web/PDF/LinkedIn
4. [ ] Regular quarterly reviews
5. [ ] A/B test different formats

---

## Tools & Resources

### Resume Builders
- [Resumake](https://resumake.io/) - LaTeX-based, ATS-friendly
- [FlowCV](https://flowcv.io/) - Modern, customizable
- [Standard Resume](https://standardresume.co/) - Simple, clean
- [Reactive Resume](https://rxresu.me/) - Open source, privacy-focused

### ATS Checkers
- [Jobscan](https://www.jobscan.co/) - Compare resume to job description
- [Resume Worded](https://resumeworded.com/) - Free ATS checker
- [TopResume](https://www.topresume.com/) - Professional review

### Design Inspiration
- [Behance - Resume Templates](https://www.behance.net/search/projects?search=resume)
- [Dribbble - CV Designs](https://dribbble.com/search/cv)

### Content Writing
- [Resumegenius Action Verbs](https://resumegenius.com/blog/resume-help/action-verbs)
- [Indeed Resume Guide](https://www.indeed.com/career-advice/resumes-cover-letters)

---

## Quality Checklist

Before finalizing your resume, check:

### Content
- [ ] No typos or grammatical errors
- [ ] All dates are accurate
- [ ] Achievements are quantified
- [ ] Skills match job requirements
- [ ] Contact info is current
- [ ] No confidential information

### Format
- [ ] Consistent formatting throughout
- [ ] Proper use of bold/italics
- [ ] Adequate white space
- [ ] Professional font
- [ ] PDF is under 2MB
- [ ] File name is professional (Ferry-Hinardi-Resume.pdf)

### ATS Compatibility
- [ ] Standard section headings
- [ ] No tables or text boxes
- [ ] Keywords included
- [ ] Simple formatting
- [ ] No images containing text

### Accuracy
- [ ] All metrics can be verified
- [ ] No exaggeration
- [ ] References available if requested
- [ ] LinkedIn profile matches resume

---

**Last Updated**: January 2, 2026  
**Next Review**: April 1, 2026 (Quarterly)
