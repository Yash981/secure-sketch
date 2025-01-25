"use client";
import { Canvas } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useUIstore } from '@/stores';
import { CanvasGame } from '@/draw/canvas';  // Adjust import path as needed

const CanvasComponent = () => {
  const { selectedTool ,setSelectedTool} = useUIstore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasGameRef = useRef<CanvasGame | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create canvas and CanvasGame instance
    const canvas = new Canvas(canvasRef.current);
    const canvasGame = new CanvasGame(canvas, selectedTool,setSelectedTool);
    canvasGameRef.current = canvasGame;

    canvasGame.render();

    canvasGame.loadCanvasState();

    canvas.on("object:added", () => {
      canvasGame.saveCanvasState();
    });
    canvas.on("object:removed", () => {
      canvasGame.saveCanvasState();
    });

    // Cleanup
    return () => {
      canvasGame.dispose()
    };
  }, [selectedTool]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && canvasGameRef.current) {
        canvasGameRef.current.deleteSelectedObject();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={dimensions.width} 
      height={dimensions.height} 
      style={{ border: "1px solid #000" }} 
    />
  );
};

export default CanvasComponent;