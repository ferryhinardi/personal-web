import { Printer } from 'lucide-react';
import { Button } from './button';

export function PrintButton() {
  const handlePrint = () => {
    // Navigate to /print page which will auto-trigger print
    window.open('/print', '_blank');
  };

  return (
    <Button
      onClick={handlePrint}
      className="print-button screen-only"
      size="icon"
      aria-label="Print Resume"
      title="Print Resume (Opens in new tab)"
    >
      <Printer className="h-5 w-5" />
    </Button>
  );
}
