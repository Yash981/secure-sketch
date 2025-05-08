import CTA from '@/components/CTA'
import Features from '@/components/features'
import Footer from '@/components/footer'
import Header from '@/components/header'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import Privacy from '@/components/privacy'
import React from 'react'

const warmUpServices = () => {
    Promise.allSettled([
      fetch("https://secure-sketch-http.onrender.com/api/v1/cronjob"),
      fetch("https://secure-sketch-ws.onrender.com/cronjob")
    ]);
};
  
const Home = () => {
    warmUpServices()
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Hero />
                <Features />
                <HowItWorks />
                <Privacy />
                {/* <Testimonials /> */}
                <CTA />
            </main>
            <Footer />
        </div>
    )
}

export default Home