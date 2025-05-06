
import React from 'react';
import { Shield, Lock, Users } from 'lucide-react';

const privacyFeatures = [
  {
    icon: <Lock className="h-8 w-8 text-sketch-purple" />,
    title: 'End-to-End Encryption',
    description: 'All sketches are encrypted before leaving your device, ensuring only authorized users can view them.'
  },
  {
    icon: <Shield className="h-8 w-8 text-sketch-purple" />,
    title: 'No Data Collection',
    description: 'We don\'t track your drawings or collect unnecessary data. Your sketches remain private.'
  },
  {
    icon: <Users className="h-8 w-8 text-sketch-purple" />,
    title: 'Permission Controls',
    description: 'Fine-grained access controls let you decide exactly who can view, edit, or share your sketches.'
  }
];

const Privacy = () => {
  return (
    <section id="privacy" className="py-16 md:py-24 px-6 md:px-10 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sketch-charcoal mb-4">
            Privacy First, Always
          </h2>
          <p className="text-lg text-gray-600">
            In an age where data privacy is often compromised, Secure-Sketch stands firm in protecting your creative work. 
            We believe your ideas should remain yours alone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {privacyFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-sketch-lightGray p-6 rounded-xl"
            >
              <div className="mb-4">
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
        
        <div className="mt-16 p-8 bg-sketch-purple/10 rounded-xl border border-sketch-purple/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/4 flex justify-center">
              <Shield className="w-20 h-20 text-sketch-purple" />
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-bold text-sketch-charcoal mb-3">
                Our Privacy Commitment
              </h3>
              <p className="text-gray-700 mb-4">
                We designed Secure-Sketch with privacy as a fundamental principle, not an afterthought. 
                Your data is encrypted with military-grade algorithms, and only you control the keys.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sketch-purple"></div>
                  <p className="text-gray-600">No third-party access to your content</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sketch-purple"></div>
                  <p className="text-gray-600">Encryption keys never leave your device</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sketch-purple"></div>
                  <p className="text-gray-600">Zero-knowledge architecture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;