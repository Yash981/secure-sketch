"use client"; 

import { useEffect, useState } from "react";
import { downloadEncryptedDataOnClient } from "@/lib/E2EE";
import { useWebsocket } from "@/hooks/web-socket-hook";
import { EventTypes } from "@repo/backend-common";
import CanvasComponent from "@/components/canvas-component";

export default function CollaborationPage() {
  const {connect,sendMessage} = useWebsocket(typeof window !== 'undefined' ? localStorage.getItem('excaliWsToken'):null)
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAndDecrypt = async () => {

      try {
        const data = await downloadEncryptedDataOnClient(window.location.href);
        if(data){
            setDecryptedData(data);
            connect()
            setTimeout(()=>{
            const roomId = window.location.pathname.split("/").pop();
            if(roomId){
              sendMessage(JSON.stringify({type:EventTypes.JOIN_ROOM,payload:{roomId}}))
            }
          },500)
        }
      } catch(error) {
        console.log(error,'error')
        setError("Failed to decrypt or download the file.");
      }
    };

    fetchAndDecrypt();
  }, []);

  if (error) return <h1>Error: {error}</h1>;
  if (!decryptedData) return <h1>Downloading and decrypting...</h1>;

  return (
    <div className="flex flex-wrap w-full">
  <h1 className="w-full">Decrypted File:</h1>
  <CanvasComponent decryptedData={decryptedData}/>
</div>

  );
}
