import { Shape } from "@/draw/canvas";
import { create } from "zustand";

interface UIstate {
  selectedTool: Shape;
  setSelectedTool: (selectedTool: Shape) => void;
  isControlsVisible: boolean;
  setIsControlsVisible: (isControlsVisible: boolean) => void;
  isFilled: boolean;
  setIsFilled: (isFilled: boolean) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  strokeWidth: number;
  setStrokeWidth: (strokeWidth: number) => void;
  color: string;
  setColor: (color: string) => void;
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  clearCanvas: boolean;
  setClearCanvas: (clearCanvas: boolean) => void;
}

export const useUIstore = create<UIstate>((set) => ({
  selectedTool: "select",
  setSelectedTool: (selectedTool) => {
    if (!selectedTool) return;
    set({ selectedTool });
  },
  isControlsVisible: false,
  setIsControlsVisible: (isControlsVisible) => {
    set({ isControlsVisible });
  },
  isFilled: false,
  setIsFilled: (isFilled) => {
    set({ isFilled });
  },
  opacity: 1,
  setOpacity: (opacity) => {
    set({ opacity });
  },
  strokeWidth: 2,
  setStrokeWidth: (strokeWidth) => {
    set({ strokeWidth });
  },
  color: "#000000",
  setColor: (color) => {
    set({ color });
  },
  openDialog: false,
  setOpenDialog: (openDialog) => {
    set({ openDialog });
  },
  clearCanvas: false,
  setClearCanvas: (clearCanvas) => {
    set({ clearCanvas });
  },
}));
