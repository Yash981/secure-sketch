"use client";
import { EventTypes } from "@repo/backend-common";
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
  private sendMessage?: (data: string) => void;
  private getCryptoKeyFromStorage?:()=>Promise<CryptoKey | null>
  private encryptMessage?:(key: CryptoKey, message: string) => Promise<ArrayBuffer>

  constructor(
    canvas: Canvas,
    selectedTool: Shape,
    setSelectedTool: (selectedTool: Shape) => void,
    isFilled: boolean,
    opacity: number,
    strokeWidth: number,
    color: string,
    sendMessage?: (data: string) => void,
    getCryptoKeyFromStorage?:() => Promise<CryptoKey | null>,
    encryptMessage?:(key: CryptoKey, message: string) => Promise<ArrayBuffer>
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
    this.sendMessage = sendMessage;
    this.getCryptoKeyFromStorage = getCryptoKeyFromStorage
    this.encryptMessage = encryptMessage
    
  }
  private initializeCanvasEvents() {
    this.canvas.on("object:modified", this.handleObjectModified.bind(this));
    this.canvas.on("selection:created", this.handleSelectionCreated.bind(this));
    this.canvas.on("selection:updated", this.handleSelectionUpdated.bind(this));
    this.canvas.on("selection:cleared", this.handleSelectionCleared.bind(this));
    if(this.selectedTool === 'pan'){
      this.canvas.on("mouse:down", this.handlePanStart);
      this.canvas.on("mouse:move", this.handlePanMove);
      this.canvas.on("mouse:up", this.handlePanEnd);
    }
  }
  private cleanupEventListeners() {
    this.canvas.off("mouse:down");
    this.canvas.off("mouse:move");
    this.canvas.off("mouse:up");
  }
  public handleObjectModified = () => {
    this.saveCanvasState();
    this.sendCanvasData()
    this.canvas.requestRenderAll();
  };
  

  handleDrawRectangle = () => {
    this.cleanupEventListeners();
    let isDrawing = false;
    let rect: Rect;
    let startX: number;
    let startY: number;

    this.canvas.on("mouse:down", (event) => {
      isDrawing = true;
      const pointer = this.canvas.getScenePoint(event.e);
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
      const pointer = this.canvas.getScenePoint(event.e);
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
      this.canvas.requestRenderAll();
    });

    this.canvas.on("mouse:up", () => {
      isDrawing = false;
      this.saveCanvasState();
      this.setSelectedTool("select");
      this.sendCanvasData();
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
      const pointer = this.canvas.getScenePoint(event.e);
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
      const pointer = this.canvas.getScenePoint(event.e);

      const radius = Math.sqrt(
        Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
      );

      circle.set({
        radius: radius,
        left: startX - radius,
        top: startY - radius,
      });

      this.canvas.requestRenderAll();
    });

    this.canvas.on("mouse:up", () => {
      isDrawing = false;
      this.saveCanvasState();
      this.setSelectedTool("select");
      this.sendCanvasData();

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
      const pointer = this.canvas.getScenePoint(event.e);
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
      const pointer = this.canvas.getScenePoint(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      this.canvas.requestRenderAll();
    });
    this.canvas.on("mouse:up", () => {
      isDrawing = false;
      this.saveCanvasState();
      this.setSelectedTool("select");
      this.sendCanvasData();

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
      this.sendCanvasData();
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
      this.saveCanvasState()
      this.sendCanvasData();
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
        this.sendCanvasData();

      });
      this.canvas.off("mouse:down", textMouseDownHandler);
    };

    this.canvas.on("mouse:down", textMouseDownHandler);
  };
  render() {
    if (!this.canvas) {
      console.warn("Canvas is not ready yet.");
      return;
    }
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
      this.canvas.defaultCursor = 'default'
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
    const cursorObject = this.canvas
      .getObjects()
      .find((obj) => obj.get("email"));
    if(cursorObject){
      this.canvas.remove(cursorObject);
    }
    const canvasData = JSON.stringify({
      canvas: this.canvas.toJSON(),
      viewportTransform: this.canvas.viewportTransform,
    });
    localStorage.setItem(
      "canvas",
      canvasData
    );
    if(cursorObject){
      this.canvas.add(cursorObject);
    }
  }
  getCurrentCanvasState() {
    const cursorObject = this.canvas
      .getObjects()
      .find((obj) => obj.get("email"));

    if (cursorObject) {
      this.canvas.remove(cursorObject);
    }

    const canvasData = JSON.stringify({
      canvas: this.canvas.toJSON(),
      viewportTransform: this.canvas.viewportTransform,
    });

    if (cursorObject) {
      this.canvas.add(cursorObject);
    }

    return canvasData;
  }
  loadCanvasState() {
    const savedState = localStorage.getItem("canvas");
    if (!savedState) {
      return;
    }
    if (JSON.parse(savedState).canvas.objects.length > 0) {
      const { canvas, viewportTransform } = JSON.parse(savedState);
      this.canvas.loadFromJSON(canvas, () => {
        if (viewportTransform) {
          this.canvas.setViewportTransform(viewportTransform);
        }
        this.canvas.requestRenderAll();
      });
    }
  }
  clearCanvas() {
    this.canvas.clear();
    this.saveCanvasState();
    // setTimeout(() => {
    //   this.sendCanvasData();
    // }, 1000);
  }
  deleteSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.saveCanvasState();
      this.canvas.requestRenderAll();
      this.sendCanvasData();
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

    this.canvas.requestRenderAll();
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

    const pointer = this.canvas.getScenePoint(event.e);
    this.lastPanX = pointer.x;
    this.lastPanY = pointer.y;

    this.canvas.selection = false;
    this.canvas.forEachObject((obj) =>
      obj.set({ selectable: false, evented: false })
    );
  };

  private handlePanMove = (event: any) => {
    if (!this.isPanning) return;

    const pointer = this.canvas.getPointer(event.e);
    const deltaX = pointer.x - this.lastPanX;
    const deltaY = pointer.y - this.lastPanY;

    const vpt = this.canvas.viewportTransform;
    if (!vpt) return;

    // vpt[4] += deltaX;
    // vpt[5] += deltaY;
    const MAX_TRANSLATE = this.canvas.getWidth() * 2;
    const MIN_TRANSLATE = -this.canvas.getWidth();

    vpt[4] = Math.max(MIN_TRANSLATE, Math.min(MAX_TRANSLATE, vpt[4] + deltaX));
    vpt[5] = Math.max(MIN_TRANSLATE, Math.min(MAX_TRANSLATE, vpt[5] + deltaY));

    this.canvas.setViewportTransform(vpt);
    this.canvas.requestRenderAll();

    this.lastPanX = pointer.x;
    this.lastPanY = pointer.y;
  };

  private handlePanEnd = () => {
    this.isPanning = false;
    this.canvas.defaultCursor = "grab";

    this.canvas.selection = true;
    this.canvas.forEachObject((obj) =>
      obj.set({ selectable: true, evented: true })
    );

    this.saveCanvasState();
  };
  mouseDblClick(event: any) {
    this.canvas.defaultCursor = "crosshair";
    const pointer = this.canvas.getScenePoint(event.e);
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
      this.canvas.selection = false
      this.setSelectedTool("select");
    });
  }
  
  async loadDecryptedData(data: string) {
    try {
      if (!this.canvas || !this.canvas.lowerCanvasEl) {
        console.warn("Canvas was removed before loading state.");
        return;
      }
      const parsedData = JSON.parse(data);

      if (!parsedData.canvas) {
        console.error("Invalid canvas data");
        return;
      }
      this.canvas.clear()
      // localStorage.removeItem('canvas')
      await this.canvas.loadFromJSON(parsedData.canvas)
    

      if (parsedData.viewportTransform) {
        this.canvas.setViewportTransform(parsedData.viewportTransform);
      }

    this.canvas.requestRenderAll();

    setTimeout(()=>{
      this.saveCanvasState()
    },1000)

    } catch (error) {
      console.error("Error loading decrypted data:", error);
    }
  }

  async sendCanvasData() {
    console.log("Canvas state changed, sending data...");
  
    const data = this.getCurrentCanvasState();
    const roomId = window.location.pathname.split("/").pop();
  
    try {
      if(!this.getCryptoKeyFromStorage) return;
      const cryptoKey = await this.getCryptoKeyFromStorage()
      if(!cryptoKey) return;
      const encryptedData = await this.encryptMessage?.(cryptoKey,data);
      if(!encryptedData) return;
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
      if (this.sendMessage) {
        this.sendMessage(
          JSON.stringify({
            type: EventTypes.SEND_ENCRYPTED_DATA,
            payload: { roomId, encryptedData:base64Data },
          })
        );
        console.log("Data sent successfully", this.canvas);
      }
    } catch (error) {
      console.error("Error encrypting or sending data:", error);
    }
  }
  
}
