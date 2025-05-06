
import React from 'react';
import { Shield } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your Sketch',
    description: 'Start with a blank canvas or choose from templates. Use our intuitive tools to draw, add shapes, text, and more.'
  },
  {
    number: '02',
    title: 'Invite Collaborators',
    description: 'Share a secure link with teammates. All collaborators can edit in real-time while seeing each other\'s changes instantly.'
  },
  {
    number: '03',
    title: 'End-to-End Encryption',
    description: 'Your data is automatically encrypted. Only those with the right access can view or edit your work.'
  },
  {
    number: '04',
    title: 'Export & Share',
    description: 'Export your sketches in multiple formats or generate secure sharing links with custom permissions.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6 md:px-10 bg-sketch-lightGray">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sketch-charcoal mb-4">
            How Secure-Sketch Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, secure, and collaborative sketching in just a few steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-sketch-purple text-white font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-sketch-charcoal">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-sketch-lightPurple/20 to-white flex items-center justify-center">
              <div className="text-center p-8">
                <Shield className="w-16 h-16 text-sketch-purple mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-sketch-charcoal mb-3">Secure by Design</h3>
                <p className="text-gray-600 max-w-md">
                  Your privacy is our priority. With end-to-end encryption, your sketches are only visible to those you choose to share them with.
                </p>
                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 italic">
                    &quot;We never store your encryption keys on our servers - only you and your collaborators have access to your content.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;