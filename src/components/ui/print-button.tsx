import { Printer } from 'lucide-react';
import { Button } from './button';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
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
