"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw,  ZoomIn } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useZoomStore } from "@/stores";

const ZoomCanvas: React.FC = () => {
  const { zoom, setZoom } = useZoomStore();

  const handleSliderChange = (value: number[]) => {
    setZoom(value[0]);
  };

  return (
    <div className="fixed z-10 left-1/2 transform -translate-x-1/2 bottom-5 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-2">
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setZoom(Math.max(10, zoom - 10))}
          disabled={zoom === 10}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2 px-2">
          <ZoomIn className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[zoom]}
            onValueChange={handleSliderChange}
            max={500}
            min={10}
            step={10}
            className="w-[100px]"
          />
        </div>
        <Button
          onClick={() => setZoom(Math.min(500, zoom + 10))}
          disabled={zoom === 500}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-sm font-medium min-w-[48px] text-center">
          {zoom}%
        </div>
        <Button
          onClick={()=>setZoom(100)}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-blue-100 transition-colors"
        >
          <RotateCcw className="h-4 w-4 text-blue-600" />
        </Button>
      </div>
    </div>
  );
};

export default ZoomCanvas;
