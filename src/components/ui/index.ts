export { default as Loading } from './loading';
export { default as ErrorDisplay } from './error';
export * from './skeleton';
export { default as ScrollProgress } from './scroll-progress';
export { default as BackToTop } from './back-to-top';
export { default as SkipLinks } from './skip-links';
export { PrintButton } from './print-button';
export { TechBadge, TechStack } from './tech-badge';

// NOTE: Heavy components NOT included in barrel export (use direct imports):
// - SkillsRadar (uses recharts) -> import from './skills-radar'
// - GitHubActivity -> import from './github-activity'
// - ProjectMetrics -> import from './project-metrics'
// - CodePlayground (uses @codesandbox/sandpack-react ~500KB) -> import from './code-playground'
