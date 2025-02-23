"use client";
import { Canvas, Group, Rect, Text, Triangle } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useUIstore, useZoomStore } from '@/stores';
import { CanvasGame } from '@/draw/canvas-class';  // Adjust import path as needed
import { EventTypes } from '@repo/backend-common';

const CanvasComponent = ({ decryptedData, sendMessage, lastMessage }: { decryptedData?: string, sendMessage?: (data: string) => void, lastMessage?: any | null }) => {
  const { selectedTool, setSelectedTool, isFilled, opacity, strokeWidth, color, clearCanvas, setClearCanvas, dialogState, setCanvasData } = useUIstore();
  const { zoom } = useZoomStore()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasGameRef = useRef<CanvasGame | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const cursorPosition = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (decryptedData) return;
    if (!canvasRef.current) return;
    const canvas = new Canvas(canvasRef.current, {
      selection: false,
      perPixelTargetFind: true,
      fireRightClick: true,
      stopContextMenu: true,
    });
    const centerX = -dimensions.width / 4;
    const centerY = -dimensions.height / 4;
    canvas.setViewportTransform([1, 0, 0, 1, centerX, centerY]);

    const canvasGame = new CanvasGame(canvas, selectedTool, setSelectedTool, isFilled, opacity, strokeWidth, color);
    canvasGameRef.current = canvasGame;

    canvasGame.render();

    canvasGame.loadCanvasState();
    canvas.on("mouse:dblclick", function (event) {
      canvasGame.mouseDblClick(event)
    })


    return () => {
      console.log("Cleaning up canvas before disposing...");

      if (canvasGameRef.current?.canvas) {
        canvasGameRef.current.canvas.clear();
      }

      canvas.off("mouse:dblclick", canvasGame.mouseDblClick);

      canvasGameRef.current?.dispose();
      canvasGameRef.current = null;

    };
    //eslint-disable-next-line
  }, [selectedTool]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && canvasGameRef.current) {
        canvasGameRef.current.deleteSelectedObject();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth * 2;
      const newHeight = window.innerHeight * 2;
      setDimensions({ width: newWidth, height: newHeight });

      if (canvasGameRef.current) {
        const canvas = canvasGameRef.current.canvas;
        canvas.setDimensions({ width: newWidth, height: newHeight });
        const centerX = -newWidth / 4;
        const centerY = -newHeight / 4;
        canvas.setViewportTransform([1, 0, 0, 1, centerX, centerY]);
        canvas.requestRenderAll();
      }
    };


    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (clearCanvas && canvasGameRef.current) {
      canvasGameRef.current.clearCanvas();
      setClearCanvas(false);
    }
    //eslint-disable-next-line
  }, [clearCanvas])
  useEffect(() => {
    if (canvasGameRef.current) canvasGameRef.current?.zoomCanvas(zoom)
  }, [zoom])
  useEffect(() => {
    if (dialogState.collaboration && canvasGameRef.current) {
      setCanvasData(canvasGameRef.current?.getCurrentCanvasState())
    }
    //eslint-disable-next-line
  }, [dialogState.collaboration])
  useEffect(() => {
    if (decryptedData) {
      if (canvasGameRef.current) {
        canvasGameRef.current.dispose();
        canvasGameRef.current = null;
      }

      if (canvasRef.current) {
        const newCanvas = new Canvas(canvasRef.current, {
          selection: false,
          perPixelTargetFind: true,
          fireRightClick: true,
          stopContextMenu: true,
        });

        const newCanvasGame = new CanvasGame(
          newCanvas,
          selectedTool,
          setSelectedTool,
          isFilled,
          opacity,
          strokeWidth,
          color
        );

        canvasGameRef.current = newCanvasGame;

        newCanvasGame.loadDecryptedData(decryptedData);

        //send mouseMovement
        newCanvas.on("mouse:move", function (event) {
          if (!event.scenePoint) return;
          cursorPosition.current = {
            x: event.scenePoint.x,
            y: event.scenePoint.y,
          }
        })
          const sendCursorUpdates = () =>{
            if(cursorPosition.current && sendMessage){
              sendMessage(JSON.stringify({
                type: EventTypes.CURSOR_MOVE,
                payload: {
                  roomId: window.location.pathname.split("/").pop(),
                  cursor: cursorPosition.current,
                }
              }))
              cursorPosition.current = null;
            }
          }
        const intervalId = setInterval(sendCursorUpdates,100)
        return () => {
          newCanvas.off("mouse:move");
          clearInterval(intervalId);
          if (canvasGameRef.current?.canvas) {
            canvasGameRef.current.canvas.clear();
          }
          newCanvasGame.dispose()
          canvasGameRef.current = null
        }
      }
    }
    //eslint-disable-next-line
  }, [decryptedData]);

  useEffect(() => {
    if (!canvasGameRef.current || !lastMessage) return;
    const canvas = canvasGameRef.current.canvas;
    if (lastMessage.type === EventTypes.CURSOR_MOVED) {
      const { userId, cursor, color, displayName } = lastMessage;
      const { x, y } = cursor;

      let currentCursor = canvas.getObjects().find((obj: any) => obj.id === userId);

      if (!currentCursor) {
        const arrow = new Triangle({
          width: 20,
          height: 20,
          fill: color,
          selectable: false,
          evented: false,
          originX: "center",
          originY: "bottom",
        });
        const textWidth = displayName.length * 8; 
        const textHeight = 20; 

        const bgRect = new Rect({
          width: textWidth,
          height: textHeight,
          fill: color,
          rx: 2,
          ry: 2, 
          originX: "center",
          originY: "top",
          selectable: false,
          evented: false,
          borderColor: 'black',
          strokeWidth: 1,

        });
        const nameText = new Text(displayName, {
          fontSize: 13,
          fill: 'black',
          textBackgroundColor: color,
          selectable: false,
          evented: false,
          originX: "center",
          originY: "top",
          fontFamily: 'Arial',
          fontWeight: 400,
          fontStyle: 'normal',
          textAlign: 'center',
          top: 4,
        });
        const nameLabel = new Group([bgRect, nameText], {
          originX: "center",
          originY: "top",
          selectable: false,
          evented: false,
          top:5,
          left:0,
        });
        currentCursor = new Group([arrow, nameLabel], {
          left: x,
          top: y,
          selectable: false,
          evented: false,

        });
        currentCursor.set("id", userId);
        canvas.add(currentCursor);
      } else {
        currentCursor.set({ left: x, top: y });
        const objects = currentCursor.group?.getObjects();
        if (objects && objects.length >= 2) {
          const [arrow, nameLabel] = objects;
          console.log(nameLabel, "nameLabel",color,'color');
          arrow.set({ fill: color });
          nameLabel.set({ fill:color,textBackgroundColor: color, text: displayName });
        }
        currentCursor.setCoords();
      }

      canvas.requestRenderAll();
    } else if (lastMessage.type === EventTypes.USER_LEFT) {
      // console.log('going to remove cursor')
      const { userId } = lastMessage.payload;
      const cursorToRemove = canvas.getObjects().find((obj: any) => obj.id === userId);
      
      if (cursorToRemove) {
        canvas.remove(cursorToRemove);
        canvas.requestRenderAll();
      }
    }
  }, [lastMessage]);



  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          touchAction: 'none'
        }}
      />
    </div>
  );
};

export default CanvasComponent;