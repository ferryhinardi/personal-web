import type { Testimonials as TestimonialsData } from '@/types/resume.types';

interface TestimonialsProps {
  data?: TestimonialsData;
}

export default function Testimonials({ data }: TestimonialsProps) {
  if (!data) return null;

  const { testimonials } = data;

  return (
    <section id="testimonials">
      <div className="text-container">
        <div className="row">
          <div className="two columns header-col">
            <h1>
              <span>Client Testimonials</span>
            </h1>
          </div>

          <div className="ten columns flex-container">
            <ul className="slides">
              {testimonials.map((testimonial) => (
                <li key={testimonial.user}>
                  <blockquote>
                    <p>{testimonial.text}</p>
                    <cite>{testimonial.user}</cite>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
