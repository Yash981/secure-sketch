import { Rect, Canvas, Circle } from "fabric";
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
  constructor(canvas: Canvas, selectedTool: Shape, setSelectedTool: (selectedTool: Shape) => void) {
    this.canvas = canvas;
    this.selectedTool = selectedTool;
    this.setSelectedTool = setSelectedTool;
  }

  handleDrawRectangle = () => {
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
        fill: "transparent",
        stroke: "black",
        strokeWidth: 2,
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
  // handleDrawLine = () => {
  //     const line = new Line([50, 100, 200, 200], {
  //       stroke: 'red',
  //       strokeWidth: 2,
  //       selectable: true,
  //     });
  //     this.canvas.add(line);
  //     this.canvas.centerObjectV(line);
  //     this.canvas.renderAll();
  //   };
  // handleDrawPencil = () => {
  //     const pencil = new PencilBrush(this.canvas);
  //     this.canvas.freeDrawingBrush = pencil;
  //     this.canvas.freeDrawingBrush.color = 'red'; // Set the color of the pencil
  //     this.canvas.freeDrawingBrush.width = 5;
  //     this.canvas.isDrawingMode = true;
  //   };
  // handleDrawEraser = () => {
  //     this.canvas.isDrawingMode = true;
  //     this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
  //     this.canvas.freeDrawingBrush.color = 'white';
  //     this.canvas.freeDrawingBrush.width = 20;
  //   };
  render() {
    if (this.selectedTool === "rectangle") {
      this.handleDrawRectangle();
    }
    if (this.selectedTool === "circle") {
      this.handleDrawCircle();
    }
    // if (this.selectedTool === 'line') {
    //   this.handleDrawLine();
    // }
    // if (this.selectedTool === 'pencil') {
    //   this.handleDrawPencil();
    // }
    // if(this.selectedTool === 'eraser'){
    //   this.handleDrawEraser();
    // }
    if (this.selectedTool === "select") {
      this.canvas.isDrawingMode = false;
    }
    if (this.selectedTool === "pan") {
      this.canvas.isDrawingMode = false;
      this.canvas.defaultCursor = "grab";
    }
    else{
      this.loadCanvasState();
    }
  }
  saveCanvasState() {
    localStorage.setItem("canvas", JSON.stringify(this.canvas.toJSON()));
  }
  loadCanvasState() {
    const savedState = localStorage.getItem("canvas");
    if (savedState) {
      this.canvas.loadFromJSON(savedState, () => {
        this.canvas.renderAll();
      });
    }
  }
  clearCanvas() {
    this.canvas.clear();
  }
  deleteSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.saveCanvasState();
      this.canvas.renderAll()
    }
  }
  zoomCanvas(factor: number) {
    this.canvas.setZoom(this.canvas.getZoom() * factor);
  }
  dispose() {
    this.canvas.dispose();
  }
  
}
