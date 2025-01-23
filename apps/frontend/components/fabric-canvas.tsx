"use client";
import {Canvas,Rect} from 'fabric'
import React, { useEffect, useRef } from 'react';

const FabricRectangle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize a static canvas
    const canvas = new Canvas(canvasRef.current);
    
    // Create a rectangle
    const rect = new Rect({
      width: 200,
      height: 100,
      fill:null,
      stroke: 'black',
      angle: 0,
      opacity: 0.7,
    });

    // Add the rectangle to the canvas
    canvas.add(rect);
    canvas.centerObject(rect);
    canvas.renderAll();

    // Cleanup the canvas on component unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} width={innerWidth} height={innerHeight} />
};

export default FabricRectangle;
