import { useState, useCallback } from 'react';

export interface LinkedInRecommendation {
  id: string;
  text: string;
  author: {
    name: string;
    title: string;
    company: string;
    photo: string;
    linkedin: string;
  };
  relationship: 'Manager' | 'Colleague' | 'Client' | 'Mentor';
  project?: string;
  date: string;
  featured: boolean;
}

/**
 * Hook to manage LinkedIn testimonials
 * Note: LinkedIn doesn't provide a public API for recommendations
 * This hook provides a manual import/management system
 */
export function useLinkedInTestimonials() {
  const [testimonials, setTestimonials] = useState<LinkedInRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Import testimonials from LinkedIn (manual copy-paste)
  const importFromLinkedIn = useCallback((text: string) => {
    setLoading(true);
    setError(null);

    try {
      // Parse LinkedIn recommendation text format
      // Expected format: "Name\nTitle @ Company\nRecommendation text\n---"
      const recommendations = text.split('---').filter(Boolean);
      
      const parsed: LinkedInRecommendation[] = recommendations.map((rec, index) => {
        const lines = rec.trim().split('\n');
        const name = lines[0]?.trim() || 'Anonymous';
        const titleCompany = lines[1]?.trim() || '';
        const recText = lines.slice(2).join('\n').trim();
        
        // Parse "Title @ Company"
        const [title, company] = titleCompany.split('@').map(s => s.trim());
        
        return {
          id: `linkedin-${Date.now()}-${index}`,
          text: recText,
          author: {
            name,
            title: title || 'Professional',
            company: company || 'Unknown',
            photo: '', // To be filled manually
            linkedin: '', // To be filled manually
          },
          relationship: 'Colleague', // Default, can be updated
          date: new Date().toISOString(),
          featured: false,
        };
      });

      setTestimonials(parsed);
      setLoading(false);
      return parsed;
    } catch (err) {
      setError('Failed to parse LinkedIn recommendations. Please check the format.');
      setLoading(false);
      return [];
    }
  }, []);

  // Convert to resumeData.json format
  const convertToResumeFormat = useCallback(() => {
    return testimonials.map(t => ({
      user: t.author.name,
      text: t.text,
      company: t.author.company,
      title: t.author.title,
      linkedin: t.author.linkedin || 'https://linkedin.com',
    }));
  }, [testimonials]);

  // Save to localStorage for persistence
  const saveToStorage = useCallback(() => {
    localStorage.setItem('linkedin-testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Load from localStorage
  const loadFromStorage = useCallback(() => {
    const stored = localStorage.getItem('linkedin-testimonials');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTestimonials(parsed);
      } catch (err) {
        console.error('Failed to load testimonials from storage:', err);
      }
    }
  }, []);

  // Update a testimonial
  const updateTestimonial = useCallback((id: string, updates: Partial<LinkedInRecommendation>) => {
    setTestimonials(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }, []);

  // Delete a testimonial
  const deleteTestimonial = useCallback((id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle featured status
  const toggleFeatured = useCallback((id: string) => {
    setTestimonials(prev =>
      prev.map(t => t.id === id ? { ...t, featured: !t.featured } : t)
    );
  }, []);

  return {
    testimonials,
    loading,
    error,
    importFromLinkedIn,
    convertToResumeFormat,
    saveToStorage,
    loadFromStorage,
    updateTestimonial,
    deleteTestimonial,
    toggleFeatured,
  };
}
