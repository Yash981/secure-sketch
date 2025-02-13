"use client";
import { Rect, Canvas, Circle, Line, PencilBrush, IText } from "fabric";
export type Shape =
  | "circle"
  | "rectangle"
  | "line"
  | "pencil"
  | "eraser"
  | "select"
  | "text"
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
  // private undoStack: any[];
  // private redoStack: any[];
  // private currentState: any;
  // private isUndoingRedoing: boolean = false;

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
    // this.undoStack = [];
    // this.redoStack = [];
    // this.currentState = this.canvas.toJSON();
    // this.saveState();
    // this.isUndoingRedoing = false
    
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
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    const cursorSize = 5;
    const cursorDot = document.createElement("div");
    cursorDot.style.width = `${cursorSize}px`;
    cursorDot.style.height = `${cursorSize}px`;
    cursorDot.style.backgroundColor = "red";
    cursorDot.style.borderRadius = "50%";
    cursorDot.style.pointerEvents = "none";
    cursorDot.style.zIndex = "1000";
    const canvasContainer = this.canvas.getElement().parentNode;
    if (canvasContainer) canvasContainer.appendChild(cursorDot);

    let isErasing = false;

    const eraseObjects = (event: any) => {
      if (!isErasing) return;

      const pointer = this.canvas.getScenePoint(event.e);
      if (!pointer) return;

      cursorDot.style.left = `${event.e.clientX - cursorSize / 2}px`;
      cursorDot.style.top = `${event.e.clientY - cursorSize / 2}px`;

      const objectsToRemove = this.canvas
        .getObjects()
        .filter((obj) => obj.containsPoint(pointer));

      objectsToRemove.forEach((obj) => this.canvas.remove(obj));
      this.canvas.requestRenderAll();
    };

    const mouseDownHandler = () => {
      isErasing = true;
    };

    const mouseUpHandler = () => {
      isErasing = false;
    };

    this.canvas.on("mouse:move", eraseObjects);
    this.canvas.on("mouse:down", mouseDownHandler);
    this.canvas.on("mouse:up", mouseUpHandler);

    this.canvas.on("mouse:up", () => {
      this.setSelectedTool("select");
      if (canvasContainer && canvasContainer.contains(cursorDot)) {
        canvasContainer.removeChild(cursorDot);
      }
      this.canvas.off("mouse:move", eraseObjects);
      this.canvas.off("mouse:down", mouseDownHandler);
      this.canvas.off("mouse:up", mouseUpHandler);
    });
  };

  handleDrawText = () => {
    this.canvas.defaultCursor = "crosshair";
    this.cleanupEventListeners();

    const textMouseDownHandler = (event: any) => {
      if (this.selectedTool !== "text") return;
      const pointer = this.canvas.getPointer(event.e);
      const text = new IText("", {
        left: pointer.x,
        top: pointer.y,
        fontSize: 20,
        fontFamily: "Arial",
        fill: "#000",
        editable: true,
      });

      this.canvas.add(text);
      this.canvas.setActiveObject(text);
      text.enterEditing();
      this.canvas.defaultCursor = "text";

      text.on("editing:exited", () => {
        this.canvas.defaultCursor = "default";
        this.setSelectedTool("select");
      });
      this.canvas.off("mouse:down", textMouseDownHandler);
    };

    this.canvas.on("mouse:down", textMouseDownHandler);
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
    if (this.selectedTool === "text") {
      this.handleDrawText();
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
  getCurrentCanvasState(){
    return JSON.stringify({canvas:this.canvas.toJSON(),viewportTransform:this.canvas.viewportTransform})
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
  zoomCanvas(zoomLevel: number) {
    const zoom = Math.min(Math.max(zoomLevel / 100, 0.5), 5);
    const zoomPoint = this.canvas.getCenterPoint();
    this.canvas.zoomToPoint(zoomPoint, zoom);
    const newTransform = this.canvas.viewportTransform;
    if (newTransform) {
      newTransform[0] = zoom;
      newTransform[3] = zoom;
      this.canvas.setViewportTransform(newTransform);
    }

    this.canvas.renderAll();
    setTimeout(() => {
      this.saveCanvasState();
    }, 500);
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
    
    const target = event.target;
    if (target && target.selectable) return;

    this.isPanning = true;
    this.canvas.defaultCursor = "grabbing";

    const pointer = this.canvas.getPointer(event.e);
    this.lastPanX = pointer.x;
    this.lastPanY = pointer.y;

    this.canvas.selection = false;
    this.canvas.forEachObject((obj) => obj.set({ selectable: false, evented: false }));
};

private handlePanMove = (event: any) => {
    if (!this.isPanning) return;

    const pointer = this.canvas.getPointer(event.e);
    const deltaX = pointer.x - this.lastPanX;
    const deltaY = pointer.y - this.lastPanY;

    const vpt = this.canvas.viewportTransform;
    if (!vpt) return;

    vpt[4] += deltaX;
    vpt[5] += deltaY;

    this.canvas.setViewportTransform(vpt);
    this.canvas.requestRenderAll();

    this.lastPanX = pointer.x;
    this.lastPanY = pointer.y;
};

private handlePanEnd = () => {
    this.isPanning = false;
    this.canvas.defaultCursor = "grab";

    this.canvas.selection = true;
    this.canvas.forEachObject((obj) => obj.set({ selectable: true, evented: true }));

    this.saveCanvasState();
};


  // private saveState() {
  //   this.canvas.on("object:added", this.performAction.bind(this));
  //   this.canvas.on("object:modified", this.performAction.bind(this));
  //   this.canvas.on("object:removed", this.performAction.bind(this));
  // }
  // performAction() {
  //   const newState = this.canvas.toJSON();
  //   // console.log(typeof newState,typeof this.currentState,'typeof')
  //   if (!this.deepEqual(newState, this.currentState)) {
  //     if (this.currentState) {
  //       this.undoStack.push({ ...this.currentState }); 
  //     }
  //     this.currentState = newState;
  //     this.redoStack = [];
  //   }
  //   // console.log("🟢 Action Performed");
  //   // console.log("Current State:", this.currentState);
  //   // console.log("Undo Stack:", this.undoStack);
  //   // console.log("Redo Stack:", this.redoStack);
  // }
  // undo() {
  //   if (this.undoStack.length === 0) {
  //     // console.warn("❌ Undo stack is empty!");
  //     return;
  //   }

  //   this.redoStack.push({ ...this.currentState }); // ✅ Clone properly
  //   this.currentState = this.undoStack.pop();

  //   this.canvas.clear(); // ✅ Ensure a clean reset
  //   this.canvas.loadFromJSON(this.currentState, () => {
  //     this.canvas.renderAll();
  //   });

  //   // console.log("🔄 Undo Performed");
  //   // console.log("Current State:", this.currentState);
  //   // console.log("Undo Stack:", this.undoStack);
  //   // console.log("Redo Stack:", this.redoStack);
  // }
  // redo() {
  //   if (this.redoStack.length === 0) {
  //     // console.warn("❌ Redo stack is empty!");
  //     return;
  //   }

  //   this.undoStack.push({ ...this.currentState }); // ✅ Clone properly
  //   this.currentState = this.redoStack.pop();

  //   this.canvas.clear(); // ✅ Ensure a clean reset
  //   this.canvas.loadFromJSON(this.currentState, () => {
  //     this.canvas.renderAll();
  //   });

  //   // console.log("🔁 Redo Performed");
  //   // console.log("Current State:", this.currentState);
  //   // console.log("Undo Stack:", this.undoStack);
  //   // console.log("Redo Stack:", this.redoStack);
  // }
  // private deepEqual(obj1: any, obj2: any): boolean {
  //   if (obj1 === obj2) return true; // Same reference
  
  //   if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
  //     return obj1 === obj2; // Primitive values
  //   }
  
  //   const keys1 = Object.keys(obj1);
  //   const keys2 = Object.keys(obj2);
  
  //   if (keys1.length !== keys2.length) return false; // Different number of keys
  
  //   for (const key of keys1) {
  //     if (!this.deepEqual(obj1[key], obj2[key])) return false; 
  //   }
  
  //   return true;
  // }
}
