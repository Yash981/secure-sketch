import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface DrawingControlsProps {
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  isFilled: boolean;
  setIsFilled: (filled: boolean) => void;
}

const PRESET_COLORS = [
  '#000000', '#343a40', '#495057', '#868e96', // Grays
  '#e03131', '#c2255c', '#9c36b5', '#6741d9', // Reds to Purples
  '#3b5bdb', '#1971c2', '#0c8599', '#099268', // Blues to Teals
  '#2f9e44', '#66a80f', '#e8590c', '#f08c00', // Greens to Oranges
];

export const DrawingControls = ({
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  opacity,
  setOpacity,
  isFilled,
  setIsFilled,
}: DrawingControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white border rounded-xl shadow-md backdrop-blur-sm bg-opacity-90">
      <div className="space-y-2 flex flex-col items-start">
        <Label className="text-sm font-bold text-gray-600 ">Color</Label>
        <Popover>
          <PopoverTrigger>
            <div
              className="w-10 h-10 rounded-lg border-2 shadow-sm cursor-pointer hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: color, borderColor: 'rgba(0,0,0,0.1)' }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3">
            <div className="grid grid-cols-4 gap-3">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 shadow-sm transition-all duration-200 hover:scale-110",
                    color === presetColor ? "ring-2 ring-offset-2 ring-blue-500" : "ring-offset-0"
                  )}
                  style={{ backgroundColor: presetColor, borderColor: 'rgba(0,0,0,0.1)' }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2 min-w-[140px]">
        <Label className="text-xs font-medium text-gray-600">Stroke Width</Label>
        <Slider
          value={[strokeWidth]}
          onValueChange={(value) => setStrokeWidth(value[0])}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        <div className="text-[10px] text-gray-500 text-right">{strokeWidth}px</div>
      </div>

      <div className="space-y-2 min-w-[140px]">
        <Label className="text-xs font-medium text-gray-600">Opacity</Label>
        <Slider
          value={[opacity]}
          onValueChange={(value) => setOpacity(value[0])}
          min={0.1}
          max={1}
          step={0.1}
          className="w-full"
        />
        <div className="text-[10px] text-gray-500 text-right">{Math.round(opacity * 100)}%</div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600">Style</Label>
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm",
            isFilled 
              ? "bg-blue-500 text-white hover:bg-blue-600" 
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          )}
          onClick={() => setIsFilled(!isFilled)}
        >
          {isFilled ? 'Filled' : 'Stroke'}
        </button>
      </div>
    </div>
  );
};