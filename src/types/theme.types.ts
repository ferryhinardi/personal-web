/**
 * Theme system type definitions.
 * Supports multiple color themes + dark/light mode.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeDefinition {
  id: string;
  label: string;
  /** oklch hue value for the primary palette */
  hue: number;
  /** Preview color in hex (for the picker swatch) */
  preview: string;
}

/**
 * Available color themes.
 * Each theme rotates the oklch hue to produce a full palette.
 */
export const themes: ThemeDefinition[] = [
  {id: 'default', label: 'Blue', hue: 240, preview: '#3b82f6'},
  {id: 'rose', label: 'Rose', hue: 350, preview: '#f43f5e'},
  {id: 'emerald', label: 'Emerald', hue: 160, preview: '#10b981'},
  {id: 'amber', label: 'Amber', hue: 45, preview: '#f59e0b'},
  {id: 'violet', label: 'Violet', hue: 280, preview: '#8b5cf6'},
];

export interface ThemeState {
  themeId: string;
  mode: ThemeMode;
}
