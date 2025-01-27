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
  constructor(
    canvas: Canvas,
    selectedTool: Shape,
    setSelectedTool: (selectedTool: Shape) => void,

  ) {
    this.canvas = canvas;
    this.selectedTool = selectedTool;
    this.setSelectedTool = setSelectedTool;
    this.initializeCanvasEvents();
  }
  private initializeCanvasEvents() {
    this.canvas.on("object:modified", this.handleObjectModified.bind(this));
    this.canvas.on("selection:created",this.handleSelectionCreated.bind(this));
    this.canvas.on("selection:updated", this.handleSelectionUpdated.bind(this));
    this.canvas.on("selection:cleared", this.handleSelectionCleared.bind(this));
  }
  private cleanupEventListeners() {
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:up');
  }
  public handleObjectModified = () => {
      this.saveCanvasState();
      this.loadCanvasState();
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
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
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
        fill: null,
        stroke: "black",
        strokeWidth: 2,
        selectable: true,
        hasBorders: true,
        hasControls: true,
        lockRotation: true,
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
        stroke: "black",
        strokeWidth: 2,
        opacity: 0.7,
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
    this.canvas.freeDrawingBrush.color = "red"; // Set the color of the pencil
    this.canvas.freeDrawingBrush.width = 5;
    this.canvas.isDrawingMode = true;
  };
  // handleDrawEraser = () => {
  //     this.canvas.isDrawingMode = true;
  //     this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
  //     this.canvas.freeDrawingBrush.color = 'white';
  //     this.canvas.freeDrawingBrush.width = 20;
  //   };
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
    // if(this.selectedTool === 'eraser'){
    //   this.handleDrawEraser();
    // }
    if (this.selectedTool === "select") {
      this.canvas.isDrawingMode = false;
    }
    if (this.selectedTool === "pan") {
      this.loadCanvasState();
      this.canvas.isDrawingMode = false;
      this.canvas.defaultCursor = "grab";
    }
    this.loadCanvasState();
  }
  refreshCanvas() {
    this.render(); // Explicitly refresh the canvas
    this.saveCanvasState(); // Save the current state
  }
  saveCanvasState() {
    localStorage.setItem("canvas", JSON.stringify(this.canvas.toJSON()));
  }
  loadCanvasState() {
    const savedState = localStorage.getItem("canvas");
    if (savedState) {
      this.canvas.loadFromJSON(savedState, () => {
        console.log("Canvas state loaded");
        this.canvas.renderAll();
      });
    }
  }
  // handleObjectModified() {
  //   console.log("Object modified");
  //   this.refreshCanvas();
  //   this.saveCanvasState();
  //   this.loadCanvasState(); // Ensure the canvas updates properly
  //   this.canvas.renderAll();
  // }
  clearCanvas() {
    this.canvas.clear();
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
}
