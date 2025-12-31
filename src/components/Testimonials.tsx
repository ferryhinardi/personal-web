import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, LinkedinIcon, Briefcase } from 'lucide-react';
import type { Testimonials as TestimonialsData } from '@/types/resume.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

interface TestimonialsProps {
  data?: TestimonialsData;
}

export default function Testimonials({ data }: TestimonialsProps) {
  if (!data) return null;

  const { testimonials } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-padding bg-gray-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 mb-4">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">Testimonials</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              What colleagues and collaborators say about working with me
            </p>
          </div>

          {/* Carousel */}
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 sm:p-12">
                <div className="relative min-h-[280px] flex items-center">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      className="w-full"
                    >
                      <div className="flex flex-col items-center text-center space-y-6">
                        {/* Profile Image */}
                        {currentTestimonial.image && (
                          <Avatar className="w-20 h-20 border-4 border-sky-500/20">
                            <img
                              src={currentTestimonial.image}
                              alt={currentTestimonial.user}
                              className="w-full h-full object-cover"
                            />
                          </Avatar>
                        )}
                        
                        <Quote className="w-12 h-12 text-sky-500 dark:text-sky-400 opacity-50" />
                        
                        <blockquote className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-slate-200 leading-relaxed">
                          "{currentTestimonial.text}"
                        </blockquote>
                        
                        <cite className="not-italic space-y-2">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {currentTestimonial.user}
                          </p>
                          
                          {/* Title and Company */}
                          {(currentTestimonial.title || currentTestimonial.company) && (
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Briefcase className="w-4 h-4" />
                              <span>
                                {currentTestimonial.title}
                                {currentTestimonial.title && currentTestimonial.company && ' at '}
                                {currentTestimonial.company && (
                                  <span className="font-medium">{currentTestimonial.company}</span>
                                )}
                              </span>
                            </div>
                          )}
                          
                          {/* Relationship */}
                          {currentTestimonial.relationship && (
                            <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                              {currentTestimonial.relationship}
                            </p>
                          )}
                          
                          {/* LinkedIn Link */}
                          {currentTestimonial.linkedin && (
                            <a
                              href={currentTestimonial.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors mt-2"
                            >
                              <LinkedinIcon className="w-4 h-4" />
                              <span className="text-sm">View LinkedIn Profile</span>
                            </a>
                          )}
                        </cite>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    className="rounded-full"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentIndex ? 'right' : 'left');
                          setCurrentIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-sky-500 dark:bg-sky-400 w-8'
                            : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="rounded-full"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
              <motion.div
                key={currentIndex}
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
