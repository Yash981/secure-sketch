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
    const [progress, setProgress] = useState(0);
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
    useEffect(() => {
        let interval: NodeJS.Timeout;
    
        if (status === "loading") {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 1000);
        }
    
        return () => clearInterval(interval); 
    }, [status]);
    if (status === "loading") {
        return (
            <div style={{ padding: "1rem", width: "100%", maxWidth: "600px", margin: "auto" }}>
                <p>⏳ Warming up services, please wait...</p>
                <div style={{ height: "10px", background: "#eee", borderRadius: "5px", overflow: "hidden", marginTop: "1rem" }}>
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "linear-gradient(to right, #4ade80, #22c55e)",
                            transition: "width 0.5s ease"
                        }}
                    />
                </div>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{progress}%</p>
            </div>
        );
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

