"use client";
import { Rect, Canvas, Circle, Line, PencilBrush } from "fabric";
export type Shape =
  | "circle"
  | "rectangle"
  | "line"
  | "pencil"
  | "eraser"
  | "select"
  | "pan";
export class CanvasGame {
  canvas: Canvas;
  selectedTool: Shape;
  setSelectedTool: (selectedTool: Shape) => void;
  isFilled: boolean;
  opacity: number;
  strokeWidth: number;
  color: string;
  isPanning: boolean;
  private lastPanX: number;
  private lastPanY: number;
  private viewportTransform: number[] | null;
  private eraser: number;
  constructor(
    canvas: Canvas,
    selectedTool: Shape,
    setSelectedTool: (selectedTool: Shape) => void,
    isFilled: boolean,
    opacity: number,
    strokeWidth: number,
    color: string
  ) {
    this.canvas = canvas;
    this.selectedTool = selectedTool;
    this.setSelectedTool = setSelectedTool;
    this.isFilled = isFilled;
    this.opacity = opacity;
    this.strokeWidth = strokeWidth;
    this.color = color;
    this.isPanning = false;
    this.lastPanX = 0;
    this.lastPanY = 0;
    this.viewportTransform = null;
    this.eraser = 10;
    this.initializeCanvasEvents();
  }
  private initializeCanvasEvents() {
    this.canvas.on("object:modified", this.handleObjectModified.bind(this));
    this.canvas.on("selection:created", this.handleSelectionCreated.bind(this));
    this.canvas.on("selection:updated", this.handleSelectionUpdated.bind(this));
    this.canvas.on("selection:cleared", this.handleSelectionCleared.bind(this));
    this.canvas.on("mouse:down", this.handlePanStart);
    this.canvas.on("mouse:move", this.handlePanMove);
    this.canvas.on("mouse:up", this.handlePanEnd);
  }
  private cleanupEventListeners() {
    this.canvas.off("mouse:down");
    this.canvas.off("mouse:move");
    this.canvas.off("mouse:up");
  }
  public handleObjectModified = () => {
    this.saveCanvasState();
    this.canvas.renderAll();
  };
  //panning

  handleDrawRectangle = () => {
    this.cleanupEventListeners();
    let isDrawing = false;
    let rect: Rect;
    let startX: number;
    let startY: number;

    this.canvas.on("mouse:down", (event) => {
      isDrawing = true;
      const pointer = this.canvas.getPointer(event.e);
      startX = pointer.x;
      startY = pointer.y;
      rect = new Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: this.isFilled ? this.color : null,
        stroke: this.color,
        strokeWidth: this.strokeWidth,
        opacity: this.opacity,
      });
      this.canvas.add(rect);
    });

    this.canvas.on("mouse:move", (event) => {
      if (!isDrawing) return;
      const pointer = this.canvas.getPointer(event.e);
      rect.set({
        width: Math.abs(pointer.x - startX),
        height: Math.abs(pointer.y - startY),
      });
      if (pointer.x < startX) {
        rect.set({ left: pointer.x });
      }
      if (pointer.y < startY) {
        rect.set({ top: pointer.y });
      }
      this.canvas.renderAll();
    });

    this.canvas.on("mouse:up", () => {
      isDrawing = false;
      this.saveCanvasState();
      this.setSelectedTool("select");
    });
  };
  handleDrawCircle = () => {
    this.cleanupEventListeners();
    let isDrawing = false;
    let circle: Circle;
    let startX: number;
    let startY: number;

    this.canvas.on("mouse:down", (event) => {
      isDrawing = true;
      const pointer = this.canvas.getPointer(event.e);
      startX = pointer.x;
      startY = pointer.y;

      circle = new Circle({
        left: startX,
        top: startY,
        radius: 0,
        fill: this.isFilled ? this.color : null,
        stroke: this.color,
        strokeWidth: this.strokeWidth,
        selectable: true,
        hasBorders: true,
        hasControls: true,
        lockRotation: true,
        opacity: this.opacity,
      });

      this.canvas.add(circle);
    });

    this.canvas.on("mouse:move", (event) => {
      if (!isDrawing) return;
      const pointer = this.canvas.getPointer(event.e);

      const radius = Math.sqrt(
        Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
      );

      circle.set({
        radius: radius,
        left: startX - radius,
        top: startY - radius,
      });

      this.canvas.renderAll();
    });

    this.canvas.on("mouse:up", () => {
      isDrawing = false;
      this.saveCanvasState();
      this.setSelectedTool("select");
    });
  };
  handleDrawLine = () => {
    this.cleanupEventListeners();
    let isDrawing = false;
    let line: Line;
    let startX: number;
    let startY: number;
    this.canvas.on("mouse:down", (event) => {
      isDrawing = true;
      const pointer = this.canvas.getPointer(event.e);
      startX = pointer.x;
      startY = pointer.y;
      line = new Line([startX, startY, startX, startY], {
        stroke: this.color,
        strokeWidth: this.strokeWidth,
        opacity: this.opacity,
        selectable: true,
        hasBorders: true,
        hasControls: true,
        lockRotation: true,
      });
      this.canvas.add(line);
    });
    this.canvas.on("mouse:move", (event) => {
      if (!isDrawing) return;
      const pointer = this.canvas.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      this.canvas.renderAll();
    });
    this.canvas.on("mouse:up", () => {
      isDrawing = false;
      this.saveCanvasState();
      this.setSelectedTool("select");
    });
  };
  handleDrawPencil = () => {
    this.cleanupEventListeners();
    const pencil = new PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush = pencil;
    this.canvas.freeDrawingBrush.color = this.color; // Set the color of the pencil
    this.canvas.freeDrawingBrush.width = this.strokeWidth;
    this.canvas.isDrawingMode = true;
    this.canvas.on("mouse:up", () => {
      this.saveCanvasState();
    });
  };
  handleDrawEraser = () => {
    this.cleanupEventListeners();
    const eraser = new PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush = eraser;
    this.canvas.freeDrawingBrush.color = "white";
    this.canvas.freeDrawingBrush.width = this.strokeWidth;
    this.canvas.isDrawingMode = true;
    this.canvas.on("mouse:up", () => {
      this.saveCanvasState();
      this.setSelectedTool("select");
    });
  };
  render() {
    if (this.selectedTool === "rectangle") {
      this.canvas.defaultCursor = "crosshair";    
      this.handleDrawRectangle();
    }
    if (this.selectedTool === "circle") {
      this.canvas.defaultCursor = "crosshair";
      this.handleDrawCircle();
    }
    if (this.selectedTool === "line") {
      this.canvas.defaultCursor = "crosshair";
      this.handleDrawLine();
    }
    if (this.selectedTool === "pencil") {
      this.canvas.defaultCursor = "crosshair";
      this.handleDrawPencil();
    }
    if (this.selectedTool === "eraser") {
      this.handleDrawEraser();
    }
    if (this.selectedTool === "select") {
      this.canvas.isDrawingMode = false;
    }
    if (this.selectedTool === "pan") {
      this.canvas.isDrawingMode = false;
      this.canvas.defaultCursor = "grab";
      this.canvas.selection = false;
    }
    this.loadCanvasState();
  }

  saveCanvasState() {
    if (!this.canvas) return;
    localStorage.setItem(
      "canvas",
      JSON.stringify({
        canvas: this.canvas.toJSON(),
        viewportTransform: this.canvas.viewportTransform,
      })
    );
  }
  loadCanvasState() {
    const savedState = localStorage.getItem("canvas");
    if (savedState) {
      const { canvas, viewportTransform } = JSON.parse(savedState);
      this.canvas.loadFromJSON(canvas, () => {
        if (viewportTransform) {
          this.canvas.setViewportTransform(viewportTransform);
        }
        console.log("Canvas state loaded");
        this.canvas.renderAll();
      });
    }
  }
  clearCanvas() {
    this.canvas.clear();
    this.saveCanvasState();
  }
  deleteSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.saveCanvasState();
      this.canvas.renderAll();
    }
  }
  zoomCanvas(factor: number) {
    this.canvas.setZoom(this.canvas.getZoom() * factor);
  }
  dispose() {
    this.canvas.dispose();
  }
  handleSelectionCreated() {
    this.canvas.perPixelTargetFind = false;
    this.canvas.defaultCursor = "move";
  }

  handleSelectionUpdated() {
    this.canvas.perPixelTargetFind = false;
    this.canvas.defaultCursor = "move";
  }

  handleSelectionCleared() {
    this.canvas.perPixelTargetFind = true;
    this.canvas.defaultCursor = "default";
  }
  private handlePanStart = (event: any) => {
    if (this.selectedTool !== "pan") return;
    this.isPanning = true;
    this.canvas.defaultCursor = "grabbing";
    const pointer = this.canvas.getPointer(event.e);
    this.lastPanX = pointer.x;
    this.lastPanY = pointer.y;
  };

  private handlePanMove = (event: any) => {
    if (!this.isPanning) return;
    const pointer = this.canvas.getPointer(event.e);
    const deltaX = pointer.x - this.lastPanX;
    const deltaY = pointer.y - this.lastPanY;

    const vpt = this.canvas.viewportTransform;
    if (vpt) {
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      this.canvas.setViewportTransform(vpt);
      this.canvas.requestRenderAll();
    }

    this.lastPanX = pointer.x;
    this.lastPanY = pointer.y;
  };

  private handlePanEnd = () => {
    this.isPanning = false;
    this.viewportTransform = this.canvas.viewportTransform;
    this.canvas.defaultCursor = "grab";

    this.saveCanvasState();
  };
}
