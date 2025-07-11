"use client"


export const generateKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 128 },
    true,
    ["encrypt", "decrypt"]
  );
};
export async function encryptMessage(
  key: CryptoKey,
  message: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );

  return new Blob([iv, encryptedData]).arrayBuffer();
}

export async function decryptMessage(
  key: CryptoKey,
  encryptedData: ArrayBuffer
): Promise<string> {
  const iv = new Uint8Array(encryptedData.slice(0, 12));
  const data = new Uint8Array(encryptedData.slice(12));

  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error:any) {
    throw new Error('Decryption failed. Please check the key and data.',error);
  }
}
export const uploadContentToServer = async (
  encryptedData: ArrayBuffer
): Promise<string> => {
  try {
    let headers: HeadersInit = { "Content-Type": "application/octet-stream" };
    const token = localStorage.getItem("excaliWsToken");

    if (token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload`,
      {
        method: "POST",
        headers: headers,
        credentials: "include", 
        body: encryptedData,
        
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload content: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.log(error, "error uploading content");
    throw new Error(`Failed to upload content: ${error.message}`);
  }
};
export const generateShareableURL = async (
  key: CryptoKey,
  encryptedData: ArrayBuffer
): Promise<string> => {
  const objectUrl = await uploadContentToServer(encryptedData);
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  const objectKey = encodeURIComponent(exportedKey.k!);
  const url = objectUrl + "#key=" + objectKey;
  return url;
};
export const downloadEncryptedContent = async (id: string): Promise<ArrayBuffer> => {
  try {
    let headers: HeadersInit = {};

    const token = localStorage.getItem("excaliWsToken");

    if (token) {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download?id=${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers,
        credentials: "include", 
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download content: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();
    return data;
  } catch (error: any) {
    console.error(error, "Download error");
    throw new Error(`Failed to download content: ${error.message}`);
  }
};

export async function ExtractKeyFromURL():Promise<CryptoKey | null> {
    const hashedValue = window.location.hash
    if(!hashedValue.includes("#key=")) return null;

    const objectKey = decodeURIComponent(hashedValue.slice("#key=".length));

    return await window.crypto.subtle.importKey("jwk",{
        k:objectKey,
        alg:"A128GCM",
        ext:true,
        key_ops:["encrypt","decrypt"],
        kty:"oct"
    },{
        name:"AES-GCM",length:128
    },true,["encrypt","decrypt"])
    
}

export const uploadEncryptedDataToServer = async (data:string) =>{
  const key = await generateKey();
  const encryptedData = await encryptMessage(key,data)
  const shareableURL = await generateShareableURL(key,encryptedData);
  const newUrl = new URL(shareableURL)
  return `${newUrl.origin}${newUrl.pathname}/${newUrl.search.slice(4)}${newUrl.hash}`

}
export const downloadEncryptedDataOnClient = async (url:string) =>{
  const urlObj = new URL(url)
  const extractedKey = await ExtractKeyFromURL();
  if(!extractedKey){
    console.error('Invalid or missing key in URL!');
    return;
  }
  const exportedKey = await window.crypto.subtle.exportKey("jwk", extractedKey);
  sessionStorage.setItem('aes-key', JSON.stringify(exportedKey))
  const downloadData = await downloadEncryptedContent(urlObj.pathname.split('/')[2])
  const decryptedMessage = await decryptMessage(extractedKey,downloadData);
  return decryptedMessage
}
export const getCryptoKeyFromStorage = async (): Promise<CryptoKey | null> => {
  const keyString = sessionStorage.getItem("aes-key");
  if (!keyString) {
    console.error("No AES key found in sessionStorage!");
    return null;
  }

  try {
    const jwkKey = JSON.parse(keyString); 
    const cryptoKey = await window.crypto.subtle.importKey(
      "jwk", {
        k:jwkKey.k,
        alg:"A128GCM",
        ext:true,
        key_ops:["encrypt","decrypt"],
        kty:"oct"
    },{
        name:"AES-GCM",length:128
    },true,["encrypt","decrypt"])

    return cryptoKey; 
  } catch (error) {
    console.error("Failed to import AES key:", error);
    return null;
  }
};
