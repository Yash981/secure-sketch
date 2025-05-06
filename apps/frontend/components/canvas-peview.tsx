"use client"
import React, { useEffect, useRef } from 'react';

const CanvasPreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#7E69AB';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    

    ctx.beginPath();
    ctx.rect(50, 50, 150, 100);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(300, 100, 50, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(250, 200);
    ctx.lineTo(230, 180);
    ctx.moveTo(250, 200);
    ctx.lineTo(230, 220);
    ctx.stroke();
    
    ctx.font = '16px Inter';
    ctx.fillStyle = '#1A1F2C';
    ctx.fillText('Collaborative Sketch', 120, 120);
    
    ctx.beginPath();
    ctx.arc(350, 230, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#D6BCFA';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(350, 230);
    ctx.arc(350, 230, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#7E69AB';
    ctx.fill();
    
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(180, 250);
    ctx.lineTo(320, 250);
    ctx.stroke();
    ctx.setLineDash([]);
    
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-[300px] md:h-[400px] rounded-lg"
    />
  );
};

export default CanvasPreview;