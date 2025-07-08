"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LoginRouteAction } from '@/actions/login-route-action';
import { useRouter } from 'next/navigation';

const CTA = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  return (
    <section className="py-16 md:py-24 px-6 md:px-10">
      <div className="container mx-auto">
        <div className="bg-sketch-purple rounded-2xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:max-w-2xl mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to start sketching securely?
              </h2>
              <p className="text-sketch-lightPurple text-lg">
                Join thousands of professionals who trust Secure-Sketch for their collaborative drawing needs.
                No signup  required to get started.
              </p>
            </div>
            <div className="flex flex-col gap-4">
            {error && <p className='text-red-500 text-md' >
            {error}
          </p>}
              <Button size="lg" className="bg-white text-sketch-purple hover:bg-sketch-lightPurple hover:text-black min-w-[200px]"  disabled={isLoading} onClick={async () => {
              setIsLoading(true)
              try {
                const res = await LoginRouteAction({
                  email: "yyyyy@gmail.com",
                  password: "YY@@$$h8919551587"
                })
                if (res.success) {
                  router.push('/')
                  router.refresh()
                  localStorage.setItem('excaliWsToken', res.data.token)
                  localStorage.setItem('excaliUsername', res.data.username)
                } else {
                  setError((res.error as Error).message || res.error)
                  setTimeout(() => {
                    setError("")
                  }, 5000)
                  return;
                }
              } catch (error) {
                setError((error as Error).message)
                setTimeout(() => {
                  setError("")
                }, 5000)
              } finally {
                setIsLoading(false)
              }
            }}>
                Start for Free
              </Button>
              <a
              href="https://www.youtube.com/watch?v=vCYSyV_u2WQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="bg-sketch-purple hover:bg-sketch-darkPurple text-white hover:text-white min-w-[200px]">
                Watch Demo
              </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;