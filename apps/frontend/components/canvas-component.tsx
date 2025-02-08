"use client";
import { Canvas } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useUIstore, useZoomStore } from '@/stores';
import { CanvasGame } from '@/draw/canvas';  // Adjust import path as needed

const CanvasComponent = () => {
  const { selectedTool, setSelectedTool, isFilled, opacity, strokeWidth, color, clearCanvas, setClearCanvas } = useUIstore();
  const {zoom} = useZoomStore()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasGameRef = useRef<CanvasGame | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    if (!canvasRef.current) return;
      const canvas = new Canvas(canvasRef.current, {
        selection: false,
        perPixelTargetFind: true,
        fireRightClick: true,
        stopContextMenu: true,
      });
      const centerX = -dimensions.width / 4;
      const centerY = -dimensions.height / 4;
      canvas.setViewportTransform([1, 0, 0, 1, centerX, centerY]);

      const canvasGame = new CanvasGame(canvas, selectedTool, setSelectedTool, isFilled, opacity, strokeWidth, color);
      canvasGameRef.current = canvasGame;

      canvasGame.render();

      canvasGame.loadCanvasState();



    return () => {
      canvasGame?.dispose()

    };
    //eslint-disable-next-line
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
      const newWidth = window.innerWidth * 2;
      const newHeight = window.innerHeight * 2;
      setDimensions({ width: newWidth, height: newHeight });

      if (canvasGameRef.current) {
        const canvas = canvasGameRef.current.canvas;
        canvas.setDimensions({ width: newWidth, height: newHeight });
        const centerX = -newWidth / 4;
        const centerY = -newHeight / 4;
        canvas.setViewportTransform([1, 0, 0, 1, centerX, centerY]);
        canvas.requestRenderAll();
      }
    };


    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (clearCanvas && canvasGameRef.current) {
      canvasGameRef.current.clearCanvas();
      setClearCanvas(false);
    }
    //eslint-disable-next-line
  }, [clearCanvas])
  useEffect(() => {
    if (canvasGameRef.current) canvasGameRef.current?.zoomCanvas(zoom)
  }, [zoom])
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          touchAction: 'none'  // Important for mobile panning
        }}
      />
    </div>
  );
};

export default CanvasComponent;