import {axe} from 'vitest-axe';

type AxeViolation = {
  impact?: string;
  id: string;
  description: string;
  nodes: Array<{html: string}>;
};

type AxeRunOptions = {
  rules?: Record<string, {enabled: boolean}>;
};

export async function checkA11y(
  container: HTMLElement,
  options?: AxeRunOptions,
): Promise<void> {
  const results = await axe(container, options);

  const criticalOrSerious = (results.violations as AxeViolation[]).filter(
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
