export interface Social {
  name: string;
  url: string;
  className: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface MainData {
  name: string;
  occupation: string;
  description: string;
  image: string;
  bio: string;
  contactmessage: string;
  email: string;
  phone: string;
  address: Address;
  website: string;
  resumedownload: string;
  social: Social[];
}

export interface Education {
  school: string;
  degree: string;
  graduated: string;
  description: string;
}

export interface Work {
  company: string;
  title: string;
  years: string;
  description: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface ResumeSection {
  skillmessage: string;
  education: Education[];
  work: Work[];
  skills: Skill[];
}

export interface Project {
  title: string;
  category: string; // Keep for backward compatibility
  description?: string; // Short one-liner for overview
  challenge?: string; // Problem being solved
  solution?: string; // How it was solved
  impact?: string; // Results and outcomes
  image: string;
  url: string;
  technologies?: string[];
  role?: string; // e.g., "Lead Frontend Engineer"
  team?: string; // e.g., "Cross-functional team of 8"
  duration?: string; // e.g., "8 months"
}

export interface Portfolio {
  projects: Project[];
}

export interface Testimonial {
  text: string;
  user: string;
  title?: string; // Job title
  company?: string; // Company name
  image?: string; // Profile photo
  linkedin?: string; // LinkedIn profile URL
  relationship?: string; // e.g., "Worked together at Traveloka"
}

export interface Testimonials {
  testimonials: Testimonial[];
}

export interface ResumeData {
  main: MainData;
  resume: ResumeSection;
  portfolio: Portfolio;
  testimonials: Testimonials;
}
