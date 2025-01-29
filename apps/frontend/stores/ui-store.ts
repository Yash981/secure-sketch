import { Shape } from "@/draw/canvas";
import { create } from "zustand";

/**
 * Represents the state of the UI in the application.
 */
interface UIstate {
  /**
   * The currently selected drawing tool.
   */
  selectedTool: Shape;

  /**
   * Sets the currently selected drawing tool.
   * @param selectedTool - The tool to be selected.
   */
  setSelectedTool: (selectedTool: Shape) => void;

  /**
   * Indicates whether the controls are visible.
   */
  isControlsVisible: boolean;

  /**
   * Sets the visibility of the controls.
   * @param isControlsVisible - The visibility state of the controls.
   */
  setIsControlsVisible: (isControlsVisible: boolean) => void;

  /**
   * Indicates whether the shape is filled.
   */
  isFilled: boolean;

  /**
   * Sets the fill state of the shape.
   * @param isFilled - The fill state of the shape.
   */
  setIsFilled: (isFilled: boolean) => void;

  /**
   * The opacity level of the shape.
   */
  opacity: number;

  /**
   * Sets the opacity level of the shape.
   * @param opacity - The opacity level to be set.
   */
  setOpacity: (opacity: number) => void;

  /**
   * The stroke width of the shape.
   */
  strokeWidth: number;

  /**
   * Sets the stroke width of the shape.
   * @param strokeWidth - The stroke width to be set.
   */
  setStrokeWidth: (strokeWidth: number) => void;

  /**
   * The color of the shape.
   */
  color: string;

  /**
   * Sets the color of the shape.
   * @param color - The color to be set.
   */
  setColor: (color: string) => void;

  /**
   * The state of various dialogs in the application.
   */
  dialogState: { [key in 'collaboration' | 'clear' ]: boolean } ;

  /**
   * Sets the state of a specific dialog.
   * @param key - The key identifying the dialog.
   * @param value - The state to be set for the dialog.
   */
  setDialogState: (key: 'collaboration' | 'clear', value: boolean) => void;

  /**
   * Indicates whether the canvas should be cleared.
   */
  clearCanvas: boolean;

  /**
   * Sets the state to clear the canvas.
   * @param clearCanvas - The state to clear the canvas.
   */
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
  dialogState: {collaboration:false,clear:false} ,
  setDialogState: (key:string,value:boolean) => {
    set((state) => ({
      dialogState: {
        ...state.dialogState,
        [key]: value, 
      },
    }))
  },
  clearCanvas: false,
  setClearCanvas: (clearCanvas) => {
    set({ clearCanvas });
  },
}));
