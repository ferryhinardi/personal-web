import { Printer } from 'lucide-react';
import { Button } from './button';

export function PrintButton() {
  const handlePrint = () => {
    // Scroll to resume section before printing
    const resumeSection = document.getElementById('resume');
    if (resumeSection) {
      resumeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Wait for smooth scroll to complete
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      window.print();
    }
  };

  return (
    <Button
      onClick={handlePrint}
      className="print-button screen-only"
      size="icon"
      aria-label="Print Resume"
      title="Print Resume (Ctrl+P)"
    >
      <Printer className="h-5 w-5" />
    </Button>
  );
}
