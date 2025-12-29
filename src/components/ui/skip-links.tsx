/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts for accessibility
 * Hidden visually but accessible to screen readers and keyboard users
 */

export default function SkipLinks() {
  const links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#about', label: 'Skip to about section' },
    { href: '#resume', label: 'Skip to resume section' },
    { href: '#portfolio', label: 'Skip to portfolio section' },
    { href: '#contact', label: 'Skip to contact section' },
  ];

  return (
    <div className="skip-links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
        >
          {link.label}
        </a>
      ))}
      <style>{`
        .skip-links {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
        
        .skip-link {
          position: absolute;
          top: -100px;
          left: 0;
          padding: 1rem 1.5rem;
          background: #0891b2;
          color: white;
          font-weight: 600;
          text-decoration: none;
          border-radius: 0 0 0.5rem 0;
          transition: top 0.3s ease;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .skip-link:focus {
          top: 0;
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
        }
        
        .skip-link:hover {
          background: #0e7490;
        }
      `}</style>
    </div>
  );
}
