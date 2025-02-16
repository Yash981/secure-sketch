"use client"; 

import { useEffect, useState } from "react";
import { downloadEncryptedDataOnClient } from "@/lib/E2EE";

export default function CollaborationPage() {

  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndDecrypt = async () => {

      try {
        console.log(window.location.href,'href')
        const data = await downloadEncryptedDataOnClient(window.location.href);
        if(data){
            setDecryptedData(data);
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
  <div className="w-full overflow-auto border p-2">
    <pre className="break-words whitespace-pre-wrap">{decryptedData}</pre>
  </div>
</div>

  );
}
