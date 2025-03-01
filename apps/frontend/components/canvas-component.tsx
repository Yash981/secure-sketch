"use client";
import { Canvas, Group, Path, Rect, Shadow, Text } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useUIstore, useZoomStore } from '@/stores';
import { CanvasGame } from '@/draw/canvas-class';
import { EventTypes } from '@repo/backend-common';
import { decryptMessage, encryptMessage, getCryptoKeyFromStorage } from '@/lib/E2EE';

const CanvasComponent = ({ decryptedData, sendMessage, lastMessage }: { decryptedData?: string, sendMessage?: (data: string) => void, lastMessage?: any | null }) => {
  const { selectedTool, setSelectedTool, isFilled, opacity, strokeWidth, color, clearCanvas, setClearCanvas, dialogState, setCanvasData } = useUIstore();
  const { zoom } = useZoomStore()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasGameRef = useRef<CanvasGame | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1440,
    height: 771
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
    if(typeof window === 'undefined') return;
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
    handleResize()

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
  //collaboration
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
          color,
          sendMessage,
          getCryptoKeyFromStorage,
          encryptMessage,
        );

        canvasGameRef.current = newCanvasGame;
        newCanvasGame.loadDecryptedData(decryptedData);
        newCanvasGame.render();
        newCanvas.on("mouse:move", function (event) {
          if (!event.scenePoint) return;
          cursorPosition.current = {
            x: event.scenePoint.x,
            y: event.scenePoint.y,
          }
        })
        const sendCursorUpdates = () => {
          if (cursorPosition.current) {
            sendMessage?.(JSON.stringify({
              type: EventTypes.CURSOR_MOVE,
              payload: {
                roomId: window.location.pathname.split("/").pop(),
                cursor: cursorPosition.current,
              }
            }));
            cursorPosition.current = null;
          }
        }
        const intervalId = setInterval(sendCursorUpdates, 100)
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
  }, [decryptedData, selectedTool]);


  useEffect(() => {
    if (!canvasGameRef.current || !lastMessage) return;
    const canvas = canvasGameRef.current.canvas;

    if (lastMessage.type === EventTypes.CURSOR_MOVED) {
      const { userId, cursor, color, displayName } = lastMessage;
      const { x, y } = cursor;

      let currentCursor = canvas.getObjects().find((obj: any) => obj.email === userId);

      if (!currentCursor) {
        const cursorArrow = new Path('M0,0 L0,18 L12,12 Z', {
          fill: color,
          selectable: false,
          evented: false,
          originX: 'left',
          originY: 'top',
          angle: 0,
          top: -8,
          shadow: new Shadow({
            color: 'rgba(0,0,0,0.2)',
            offsetX: 1,
            offsetY: 1,
            blur: 2
          })
        });

        const textWidth = displayName.length * 8 + 16;
        const textHeight = 22;

        const nameBackground = new Rect({
          width: textWidth,
          height: textHeight,
          fill: 'white',
          stroke: color,
          strokeWidth: 1.5,
          rx: 10,
          ry: 10,
          originX: 'left',
          originY: 'top',
          selectable: false,
          evented: false,
          left: 12,
          top: 0
        });

        const nameText = new Text(displayName, {
          fontSize: 13,
          fill: '#333333',
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          left: nameBackground.left + textWidth / 2,
          top: nameBackground.top + textHeight / 2
        });

        currentCursor = new Group([cursorArrow, nameBackground, nameText], {
          left: x,
          top: y,
          selectable: false,
          evented: false,
        });

        currentCursor.set("email", userId);
        canvas.add(currentCursor);
      } else {
        currentCursor.set({ left: x, top: y });

        const objects = currentCursor.group?.getObjects();
        if (objects && objects.length >= 3) {
          const [cursorArrow, nameBackground, nameText] = objects;

          cursorArrow.set({ fill: color });
          nameBackground.set({ stroke: color });
          nameText.set({ text: displayName });
        }

        currentCursor.setCoords();
      }

      canvas.requestRenderAll();
    }

    if (lastMessage.type === EventTypes.USER_LEFT) {
      console.log('user left')

      const { userId } = lastMessage.payload;
      // console.log(canvas.getObjects(), 'objects', userId)
      const cursorToRemove = canvas.getObjects().find((obj: any) => obj.email === userId);

      if (cursorToRemove) {
        console.log('going to remove')
        canvas.remove(cursorToRemove);
        canvas.requestRenderAll();
      }
    }

    if (lastMessage.type === EventTypes.RECEIVE_ENCRYPTED_DATA) {
      const { encryptedData }: { encryptedData: string } = lastMessage;
      const encryptedDataBuffer = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0))
      ).buffer;
      (async()=>{
        const cryptoKey =  await getCryptoKeyFromStorage()
        if(!cryptoKey) return;
        const decryptMsg = await decryptMessage(cryptoKey,encryptedDataBuffer)
        canvasGameRef.current?.loadDecryptedData(decryptMsg);
        canvasGameRef.current?.canvas.requestRenderAll();
      })()

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