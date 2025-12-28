import { ArrowUp, Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';
import type { MainData } from '@/types/resume.types';
import { Button } from '@/components/ui/button';

interface FooterProps {
  data?: MainData;
}

// Map social network names to icons
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  github: Github,
};

export default function Footer({ data }: FooterProps) {
  if (!data) return null;

  const { social } = data;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          {social.map((network) => {
            const IconComponent = socialIcons[network.name.toLowerCase()];
            if (!IconComponent) return null;

            return (
              <a
                key={network.name}
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={network.name}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <IconComponent className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="text-center space-y-2">
          <p className="text-slate-400">
            © {currentYear} Ferry Hinardi. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        className="fixed bottom-8 right-8 rounded-full shadow-lg bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </footer>
  );
}
