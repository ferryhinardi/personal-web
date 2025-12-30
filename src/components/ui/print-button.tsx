import { Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

export function PrintButton() {
  const navigate = useNavigate();

  const handlePrint = () => {
    // Navigate to /print page
    navigate('/print');
  };

  return (
    <Button
      onClick={handlePrint}
      className="print-button screen-only"
      size="icon"
      aria-label="Print Resume"
      title="Print Resume"
    >
      <Printer className="h-5 w-5" />
    </Button>
  );
}
