/**
 * Accessibility testing utilities using vitest-axe.
 *
 * Usage:
 *   import {checkA11y} from '@/test/a11y-utils';
 *   const {container} = render(<MyComponent />);
 *   await checkA11y(container);
 */
import {axe} from 'vitest-axe';
import type {AxeResults} from 'axe-core';

/**
 * Runs axe accessibility checks on the given HTML element and asserts
 * that there are no critical or serious violations.
 *
 * Only critical/serious violations are checked (not moderate/minor)
 * so that we establish a baseline without blocking on lower-priority issues.
 */
export async function checkA11y(container: HTMLElement): Promise<void> {
  const results: AxeResults = await axe(container);

  const criticalOrSerious = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );

  if (criticalOrSerious.length > 0) {
    const messages = criticalOrSerious.map((v) => {
      const nodes = v.nodes.map((n) => n.html).join('\n  ');
      return `[${v.impact}] ${v.id}: ${v.description}\n  Nodes:\n  ${nodes}`;
    });
    throw new Error(
      `Found ${criticalOrSerious.length} critical/serious accessibility violation(s):\n\n${messages.join('\n\n')}`,
    );
  }
}
