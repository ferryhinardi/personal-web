/**
 * Shared navigation utilities for smooth scrolling behavior
 */

/**
 * Smoothly scroll to a section by its ID with an optional offset
 * @param sectionId - The ID of the target element (without #)
 * @param offset - Offset from the top in pixels (default: 80 for fixed header)
 */
export const scrollToSection = (sectionId: string, offset = 80): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({top: offsetPosition, behavior: 'smooth'});
  }
};

/**
 * Scroll to the top of the page
 */
export const scrollToTop = (): void => {
  window.scrollTo({top: 0, behavior: 'smooth'});
};
