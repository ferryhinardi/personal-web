import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {TypeAnimation} from 'react-type-animation';
import {
  Menu,
  Moon,
  Sun,
  Home,
  User,
  FileText,
  Briefcase,
  Mail,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  GithubIcon,
  X,
} from 'lucide-react';
import type {MainData} from '@/types/resume.types';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {InteractiveBadge} from '@/components/ui/interactive-badge';
import {staggerContainer, staggerItem} from '@/utils/animations';
import {useDarkMode} from '@/hooks/useDarkMode';
import {useFadeOnScroll} from '@/hooks/useParallax';
import {ParallaxBackground, FloatingShapes, AnimatedText} from '@/components/hero';
import {MagneticButton} from '@/components/ui/MagneticButton';
import {AnimatedLink} from '@/components/ui/animated-button';

// Map social network names to icons
const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  github: GithubIcon,
};

interface HeaderProps {
  data?: MainData;
  showContactInfo?: boolean; // Show contact info for print page
}

export default function Header({ data, showContactInfo = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'resume', 'portfolio', 'contact'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) return null;

  const {name} = data;

  const navItems = [
    { label: 'Home', href: '#home', icon: Home },
    { label: 'About', href: '#about', icon: User },
    { label: 'Resume', href: '#resume', icon: FileText },
    { label: 'Works', href: '#portfolio', icon: Briefcase },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header id="home" className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className={`text-xl sm:text-2xl font-bold transition-colors ${
                isScrolled
                  ? 'text-gray-900 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-400'
                  : 'text-white hover:text-cyan-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {name.split(' ')[0]}
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <AnimatedLink
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    animation="subtle"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === item.href.replace('#', '')
                        ? isScrolled
                          ? 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-white/10'
                          : 'text-cyan-400 bg-white/10'
                        : isScrolled
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </AnimatedLink>
                ))}
              </nav>
              
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={`transition-colors ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={`transition-colors ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`transition-colors ${
                      isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900 border-white/10 w-80">
                  {/* Close button */}
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Navigation Links with staggered animation */}
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item, index) => {
                      const IconComponent = item.icon;
                      const isActive = activeSection === item.href.replace('#', '');
                      
                      return (
                        <motion.a
                          key={item.href}
                          href={item.href}
                          onClick={(e) => {
                            handleNavClick(e, item.href);
                            setMobileMenuOpen(false);
                          }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.08,
                            ease: 'easeOut',
                          }}
                          whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.08)' }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors relative overflow-hidden ${
                            isActive
                              ? 'text-cyan-400 bg-white/10'
                              : 'text-white/80 hover:text-white'
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="mobile-nav-indicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"
                              initial={false}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                          
                          <IconComponent className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-white/60'}`} />
                          <span>{item.label}</span>
                        </motion.a>
                      );
                    })}
                  </nav>

                  {/* Divider */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="my-8 h-px bg-white/10 origin-left"
                  />

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="px-4"
                  >
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Connect</p>
                    <div className="flex items-center gap-3">
                      {data.social.map((network, index) => {
                        const IconComponent = socialIcons[network.name.toLowerCase()];
                        if (!IconComponent) return null;

                        return (
                          <motion.a
                            key={network.name}
                            href={network.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={network.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.55 + index * 0.05, duration: 0.2 }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-white/60 hover:text-cyan-400 transition-colors"
                          >
                            <IconComponent className="w-4 h-4" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <HeroSection
        data={data}
        showContactInfo={showContactInfo}
        handleNavClick={handleNavClick}
      />
    </header>
  );
}

/**
 * Hero section with parallax background, floating shapes, and animated text.
 */
interface HeroSectionProps {
  data: MainData;
  showContactInfo: boolean;
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

function HeroSection({data, showContactInfo, handleNavClick}: HeroSectionProps) {
  const {name, description, social, email, phone, website} = data;
  const {ref, y, opacity} = useFadeOnScroll();

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Floating Shapes */}
      <FloatingShapes />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 z-[5]" />

      {/* Hero Content with fade on scroll */}
      <motion.div
        ref={ref}
        style={{y, opacity}}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Interactive Badge - Flip card with name/contact */}
          <motion.div variants={staggerItem} className="mb-6">
            <InteractiveBadge
              data={data}
              showAvailability
              availabilityText="Open to Opportunities"
            />
          </motion.div>

          {/* Name with animated text */}
          <motion.div
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span>I'm </span>
            <AnimatedText
              text={name}
              animationStyle="char"
              className="gradient-text"
              triggerOnView={false}
              staggerDelay={0.04}
              initialDelay={0.3}
            />
          </motion.div>

          {/* Typing Animation */}
          <motion.div variants={staggerItem} className="mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light">
              <TypeAnimation
                sequence={[
                  'Crafting Digital Experiences',
                  2000,
                  'Building Scalable Solutions',
                  2000,
                  'React.js Specialist',
                  2000,
                  'Turning Ideas into Reality',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Contact Info for Print */}
          {showContactInfo && (
            <motion.div
              variants={staggerItem}
              className="print-contact-info mb-6 text-white/80 text-sm sm:text-base"
            >
              <div className="flex flex-wrap items-center justify-center gap-3">
                {email && <span>{email}</span>}
                {phone && <span>{phone}</span>}
                {website && <span>{website}</span>}
              </div>
            </motion.div>
          )}

          {/* Social Links */}
          <motion.div
            variants={staggerItem}
            className="flex items-center justify-center gap-4 mb-12"
          >
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
                  whileHover={{scale: 1.1, y: -2}}
                  whileTap={{scale: 0.95}}
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-white/70 hover:text-cyan-400 transition-all duration-300"
                >
                  <IconComponent className="w-5 h-5" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              strength={0.35}
              maxDistance={12}
              className="btn-primary text-base sm:text-lg px-8 py-4 rounded-lg"
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
              }}
            >
              Let's Connect
            </MagneticButton>
            <MagneticButton
              strength={0.35}
              maxDistance={12}
              className="border-2 border-white/20 text-white bg-transparent hover:bg-white/10 text-base sm:text-lg px-8 py-4 rounded-lg transition-colors"
              onClick={() => {
                const element = document.getElementById('portfolio');
                if (element) {
                  element.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
              }}
            >
              Explore My Work
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <ScrollIndicator handleNavClick={handleNavClick} />
    </div>
  );
}

/**
 * Animated scroll indicator at bottom of hero.
 */
interface ScrollIndicatorProps {
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

function ScrollIndicator({handleNavClick}: ScrollIndicatorProps) {
  return (
    <motion.a
      href="#about"
      onClick={(e) => handleNavClick(e, '#about')}
      initial={{opacity: 0, y: -20}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 1.5, duration: 0.8}}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors group z-10"
    >
      <span className="text-sm font-medium">Discover More</span>
      <motion.div
        animate={{y: [0, 8, 0]}}
        transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
        className="w-6 h-10 rounded-full border-2 border-white/30 group-hover:border-white flex items-start justify-center p-2"
      >
        <motion.div
          animate={{y: [0, 12, 0]}}
          transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
          className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-white"
        />
      </motion.div>
    </motion.a>
  );
}
