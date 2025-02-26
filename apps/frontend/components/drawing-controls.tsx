import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { useUIstore } from '@/stores';

const PRESET_COLORS = [
  '#000000', '#1971c2', '#868e96',
  '#e03131', '#c2255c', '#9c36b5',  
  '#3b5bdb', '#0c8599', 
  '#2f9e44',  '#f08c00'
];

export const DrawingControls = () => {
  const { isFilled, setIsFilled, opacity, setOpacity, strokeWidth, setStrokeWidth, color, setColor, setSelectedTool } = useUIstore();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-95">
      <div className="space-y-2 flex flex-col items-start">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Color</Label>
        <Popover>
          <PopoverTrigger>
            <div
              className="w-9 h-9 rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-all duration-200"
              style={{ background: color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 ml-5 border border-gray-100 rounded-xl shadow-lg bg-white">
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((presetColor, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 border-gray-100 shadow-sm transition-all duration-200 hover:scale-110",
                    color === presetColor ? "ring-2 ring-offset-2 ring-blue-500" : "ring-offset-0"
                  )}
                  style={{ background: presetColor }}
                  onClick={() => { setColor(presetColor); setSelectedTool('select'); }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Stroke Width Slider */}
      <div className="space-y-2 min-w-[160px]">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stroke Width</Label>
        <Slider
          value={[strokeWidth]}
          onValueChange={(value) => { setStrokeWidth(value[0]); setSelectedTool('select'); }}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{strokeWidth}px</div>
      </div>

      <div className="space-y-2 min-w-[160px]">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Opacity</Label>
        <Slider
          value={[opacity]}
          onValueChange={(value) => { setOpacity(value[0]); setSelectedTool('select'); }}
          min={0.1}
          max={1}
          step={0.1}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(opacity * 100)}%</div>
      </div>

      <div className="space-y-2 flex flex-col items-start">
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Style</Label>
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm",
            isFilled
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          )}
          onClick={() => { setIsFilled(!isFilled); setSelectedTool('select'); }}
        >
          {isFilled ? 'Filled' : 'Stroke'}
        </button>
      </div>
    </div>
  );
};