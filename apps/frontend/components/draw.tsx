"use client"
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import rough from 'roughjs';
import { Button } from './ui/button';
import { TopBar } from './top-bar';

const RoughCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tool, setTool] = useState('rectangle'); // Currently selected tool
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<any>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const context = canvas ? canvas.getContext('2d') : null;
        const roughCanvas = rough.canvas(canvas);

        const handleMouseDown = (e: { clientX: number; clientY: number; }) => {
            if (tool === 'rectangle') {
                setIsDrawing(true);
                if (canvas) {
                    if (!canvas) return;
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setStartPoint({ x, y });
                }
            }
        };

        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            if (isDrawing && tool === 'rectangle') {
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Clear and redraw for live preview
                    if (context) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    }

                    // Draw the preview rectangle
                    if (startPoint) {
                        const width = x - startPoint.x;
                        const height = y - startPoint.y;
                        roughCanvas.rectangle(startPoint.x, startPoint.y, width, height, {
                            roughness: 1,
                            stroke: 'black',
                        });
                    }
                }
            }
        };

        const handleMouseUp = (e: { clientX: number, clientY: number }) => {
            if (isDrawing && tool === 'rectangle') {
                setIsDrawing(false);
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Draw the final rectangle
                if (startPoint) {
                    const width = x - startPoint.x;
                    const height = y - startPoint.y;
                    roughCanvas.rectangle(startPoint.x, startPoint.y, width, height, {
                        roughness: 1,
                        stroke: 'black',
                    });
                }

                setStartPoint(null);
            }
        };

        if (canvas) {
            canvas.addEventListener('mousedown', handleMouseDown);
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [tool, isDrawing, startPoint]);

    return (
        <div className='w-screen h-screen overflow-hidden'>
            <div className="flex justify-center mt-5">
            <TopBar />
            </div>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </div>
    );
};

export default RoughCanvas;

