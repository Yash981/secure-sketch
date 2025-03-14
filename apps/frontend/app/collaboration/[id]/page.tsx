"use client";

import { useEffect, useState } from "react";
import { downloadEncryptedDataOnClient } from "@/lib/E2EE";
import { useWebsocket } from "@/hooks/web-socket-hook";
import { EventTypes } from "@repo/backend-common";
import CanvasComponent from "@/components/canvas-component";
import { TopBar } from "@/components/top-bar";
import DrawingSelection from "@/components/drawing-selections";
import ZoomCanvas from "@/components/zoom-canvas";
import Collaboration from "@/components/collaboration";
import { ClearDialog } from "@/components/clear-dialog";

export default function CollaborationPage() {
  const { connect, sendMessage, lastMessage,ws } = useWebsocket(typeof window !== 'undefined' ? localStorage.getItem('excaliWsToken') : null)
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAndDecrypt = async () => {

      try {
        const data = await downloadEncryptedDataOnClient(window.location.href);
        if (data) {
          setDecryptedData(data);
          connect()
          if(ws.current){
            ws.current.onopen = () =>{
              const roomId = window.location.pathname.split("/").pop();
              if (roomId) {
                sendMessage(JSON.stringify({ type: EventTypes.JOIN_ROOM, payload: { roomId } }))
              }
            }
          }
        }
      } catch (error) {
        console.log(error, 'error')
        setError("Failed to decrypt or download the file.");
      }
    };

    fetchAndDecrypt();
    //eslint-disable-next-line
  }, []);

  if (error) return <h1>Error: {error}</h1>;
  if (!decryptedData) return <h1>Downloading and decrypting...</h1>;

  return (
    <div className="relative w-screen h-screen">
      <TopBar className="fixed top-3 left-1/2 transform -translate-x-1/2 z-10"/>
      <div className="z-10 relative">
        <Collaboration/>
        </div>
        <ClearDialog/>
      <CanvasComponent decryptedData={decryptedData} sendMessage={sendMessage} lastMessage={lastMessage} />
      <DrawingSelection/>
      <ZoomCanvas/>
    </div>

  );
}
