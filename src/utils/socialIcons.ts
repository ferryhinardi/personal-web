import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  GithubIcon,
} from 'lucide-react';

/**
 * Map social network names to Lucide icons.
 */
export const socialIcons: Record<
  string,
  React.ComponentType<{className?: string}>
> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  github: GithubIcon,
};
