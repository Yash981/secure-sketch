
import React from 'react';

const testimonials = [
  {
    quote: "Secure-Sketch transformed how our design team collaborates. The end-to-end encryption gives us peace of mind when sharing sensitive product concepts.",
    author: "Sarah Johnson",
    role: "Product Designer at TechCorp"
  },
  {
    quote: "The perfect balance of simplicity and security. We use Secure-Sketch daily for brainstorming sessions where privacy matters.",
    author: "Michael Chen",
    role: "Creative Director at Innovation Labs"
  },
  {
    quote: "As a teacher, I needed a secure way for students to collaborate on projects. Secure-Sketch provides exactly that - easy to use with privacy built-in.",
    author: "Dr. Emily Rodriguez",
    role: "Education Technology Specialist"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-gradient-to-b from-white to-sketch-lightGray">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sketch-charcoal mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our users say about their experience with Secure-Sketch
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sketch-purple text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-semibold text-sketch-charcoal">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;