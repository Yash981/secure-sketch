"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CanvasPreview from "./canvas-peview";
import { LoginRouteAction } from '@/actions/login-route-action';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  return (
    <section className="w-full hero-gradient py-16 md:py-24 px-6 md:px-10">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col space-y-6 md:pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sketch-charcoal">
            Sketch together, <span className="text-sketch-purple">securely</span>
          </h1>
          <p className="text-lg text-gray-700 md:pr-10">
            A real-time collaborative drawing platform with end-to-end encryption.
            Create, collaborate, and share your ideas without compromising on privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="bg-sketch-purple hover:bg-sketch-darkPurple text-white px-8 py-6 text-lg" disabled={isLoading} onClick={async () => {
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
                console.log(error, 'error')
                setError((error as Error).message)
                setTimeout(() => {
                  setError("")
                }, 5000)
              } finally {
                setIsLoading(false)
              }
            }}>
              {isLoading ? "Starting Now" : "Try Now — It's Free"}
            </Button>
            <a
              href="https://www.youtube.com/watch?v=vCYSyV_u2WQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-sketch-purple text-sketch-purple hover:bg-sketch-lightPurple/20 px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </a>
          </div>
          {error && <p className='text-red-500'>
            {error}
          </p>}
          <p className="text-sm text-gray-500 pt-2">
            No sign-up required to start sketching
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-xl shadow-2xl p-4 animate-float">
            <CanvasPreview />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-sketch-lightPurple/30 h-full w-full rounded-xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;