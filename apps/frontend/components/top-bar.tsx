"use client"
import { Circle, Square, Minus, Pencil, Eraser, MousePointer, HandIcon, Type } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useUIstore } from "@/stores";
import { Button } from "./ui/button";
interface TopBarProps {
  className?: string;
}

export const TopBar = ({ className }: TopBarProps) => {
  const { setSelectedTool,selectedTool,setDialogState } = useUIstore()

  return (
    <div className={cn(
      "w-[460px] h-[57px] bg-white border-spacing-2 rounded-lg",
      className
    )}>
      <div className="container flex h-14 items-center justify-center shadow-lg rounded-lg border-2">
        <ToggleGroup type="single" value={selectedTool} className="flex gap-2 px-2" variant={"secondary"} onValueChange={setSelectedTool}>
          <ToggleGroupItem value="select" aria-label="Select">
            <MousePointer className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="pan" aria-label="Pan">
            <HandIcon className="h-5 w-5" />
          </ToggleGroupItem>
          <div className="h-4 w-px bg-border mx-2" />
          <ToggleGroupItem value="rectangle" aria-label="Rectangle">
            <Square className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="circle" aria-label="Circle">
            <Circle className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="line" aria-label="Line">
            <Minus className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="pencil" aria-label="Pencil">
            <Pencil className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="Eraser">
            <Eraser className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="text" aria-label="Text">
            <Type className="h-5 w-5" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button variant="destructive" onClick={()=>setDialogState("clear",true)}><span className="text-xs">Clear</span></Button>
      </div>
    </div>
  );
};