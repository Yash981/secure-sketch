
import React from 'react';
import { Pencil, Users, Lock, Share } from 'lucide-react';

const featureItems = [
  {
    icon: <Pencil className="h-10 w-10 text-sketch-purple" />,
    title: 'Intuitive Drawing',
    description: 'Simple yet powerful tools for creating diagrams, sketches, and illustrations with ease.'
  },
  {
    icon: <Users className="h-10 w-10 text-sketch-purple" />,
    title: 'Real-time Collaboration',
    description: 'Work together simultaneously with unlimited collaborators from anywhere in the world.'
  },
  {
    icon: <Lock className="h-10 w-10 text-sketch-purple" />,
    title: 'End-to-End Encryption',
    description: 'Your sketches remain private with military-grade encryption that keeps your data secure.'
  },
  {
    icon: <Share className="h-10 w-10 text-sketch-purple" />,
    title: 'Easy Sharing',
    description: 'Share your work with customizable permission levels and secure links that you control.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-6 md:px-10 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sketch-charcoal mb-4">
            Why Choose Secure-Sketch?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines simplicity with security to bring you the best collaborative sketching experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureItems.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg"
            >
              <div className="mb-4 p-3 bg-sketch-lightPurple/20 inline-block rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-sketch-charcoal">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;