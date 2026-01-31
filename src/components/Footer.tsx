import {
  ArrowUp,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  GithubIcon,
} from 'lucide-react';
import {motion} from 'framer-motion';
import type {MainData} from '@/types/resume.types';
import {Button} from '@/components/ui/button';

interface FooterProps {
  data?: MainData;
}

// Map social network names to icons
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  github: GithubIcon,
};

export default function Footer({data}: FooterProps) {
  if (!data) return null;

  const {social} = data;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  // Animation variants
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <footer className="relative bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, amount: 0.5}}>
          {social.map((network) => {
            const IconComponent = socialIcons[network.name.toLowerCase()];
            if (!IconComponent) return null;

            return (
              <motion.a
                key={network.name}
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={network.name}
                variants={itemVariants}
                whileHover={{
                  scale: 1.15,
                  y: -4,
                  rotate: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
                whileTap={{scale: 0.95}}
                transition={{type: 'spring', stiffness: 400, damping: 17}}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center space-y-2"
          initial={{opacity: 0, y: 10}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.4, duration: 0.5}}>
          <p className="text-slate-400">
            © {currentYear} Ferry Hinardi. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </motion.div>
      </div>

      {/* Back to Top Button - Floating animation */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{opacity: 0, scale: 0}}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: {duration: 0.3},
          scale: {type: 'spring', stiffness: 400, damping: 20},
          y: {duration: 2, repeat: Infinity, ease: 'easeInOut'},
        }}>
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full shadow-lg bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
          aria-label="Back to top">
          <ArrowUp className="w-5 h-5" />
        </Button>
      </motion.div>
    </footer>
  );
}
