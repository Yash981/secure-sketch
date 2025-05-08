"use client"
import CTA from '@/components/CTA'
import Features from '@/components/features'
import Footer from '@/components/footer'
import Header from '@/components/header'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import Privacy from '@/components/privacy'
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [status, setStatus] = useState<null | "loading" | "done">("loading");
    useEffect(() => {
        (async function waitCronjobs() {
            const urls = [
                "https://secure-sketch-http.onrender.com/api/v1/cronjob",
                "https://secure-sketch-ws.onrender.com/cronjob"
            ];
        
            const requests = urls.map(url => fetch(url).catch(err => err));
            const results = await Promise.allSettled(requests)
        
            const allSuccessful = results.every(
                (r) => r.status === "fulfilled" && r.value.status === 200
            );
            if (!allSuccessful) {
                await new Promise(resolve => setTimeout(resolve, 50000));
            }
        
            setStatus("done");
        })();
    }, []);

    if (status === "loading") {
        return <p>⏳ Warming up services, please wait...</p>;
    }
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

