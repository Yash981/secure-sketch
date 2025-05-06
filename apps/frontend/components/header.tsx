"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useRouter } from 'next/navigation';
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
const Header = () => {
  const router = useRouter()
  return (
    <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Shield className="text-sketch-purple w-8 h-8" />
        <span className="text-xl font-bold text-sketch-charcoal">Secure-Sketch</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <Button variant={"link"}  onClick={()=>scrollToSection("features")} className="text-sm font-medium text-gray-700 hover:text-sketch-purple transition-colors">
          Features
        </Button>
        <Button variant={"link"} onClick={()=>scrollToSection("how-it-works")}className="text-sm font-medium text-gray-700 hover:text-sketch-purple transition-colors">
          How it Works
        </Button>
        <Button variant={"link"} onClick={()=>scrollToSection("privacy")}className="text-sm font-medium text-gray-700 hover:text-sketch-purple transition-colors">
          Privacy
        </Button>
      </nav>
      
      <div className="flex items-center space-x-4">
        <Button className="bg-sketch-purple hover:bg-sketch-darkPurple text-white" onClick={()=>router.push("/login")}>
          Log In
        </Button>
        <Button  className="bg-sketch-purple hover:bg-sketch-darkPurple text-white" onClick={()=>router.push("/signup")}>
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;