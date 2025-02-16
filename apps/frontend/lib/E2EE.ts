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
  const buffer = new Uint8Array(encryptedData);
  const iv = buffer.slice(0, 12);
  const data = buffer.slice(12);
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );
  return new TextDecoder().decode(new Uint8Array(decryptedData));
}
export const uploadContentToserver = async (
  encryptedData: ArrayBuffer
): Promise<string> => {
  const response = await fetch("http://localhost:9000/api/v1/upload", { method: "POST", body: encryptedData,headers:{ "Content-Type": "application/octet-stream" } })
  
  const {url} = await response.json();
  return url
};
export const generateShareableURL = async (
  key: CryptoKey,
  encryptedData: ArrayBuffer
): Promise<string> => {
  const objectUrl = await uploadContentToserver(encryptedData);
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  const objectKey = encodeURIComponent(exportedKey.k!);
  const url = objectUrl + "#key=" + objectKey;
  return url;
};
export const downloadEncryptedContent = async (id: string): Promise<ArrayBuffer> => {
  const response = await fetch(`http://localhost:9000/api/v1/download?id=${id}`);
  return response.arrayBuffer()
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
    },false,["decrypt"])
    
}

// export async function testExample() {
//     const key = await generateKey();
//     const message = "Hey, this is a secret msg!";
//     const encryptedData = await encryptMessage(key, message);
    

//     const shareableURL = await generateShareableURL(key, encryptedData);
//     const urlObj = new URL(shareableURL)
//     window.location.hash = urlObj.hash; 
//     const extractedKey = await ExtractKeyFromURL();
//     if (!extractedKey) {
//         console.error("Invalid or missing key in URL!");
//         return;
//     }
//     const downloadedData = await downloadEncryptedContent(urlObj.search.slice(4));

//     const decryptedMessage = await decryptMessage(extractedKey, downloadedData);
//     console.log("Decrypted Message:", decryptedMessage);
// }

export const uploadEncryptedDataToServer = async (data:string) =>{
  const key = await generateKey();
  const encryptedData = await encryptMessage(key,data)
  const shareableURL = await generateShareableURL(key,encryptedData);
  return shareableURL

}
export const downloadEncryptedDataOnClient = async (url:string) =>{
  const urlObj = new URL(url)
  const extractedKey = await ExtractKeyFromURL();
  if(!extractedKey){
    console.error('Invalid or missing key in URL!');
    return;
  }
  const downloadData = await downloadEncryptedContent(urlObj.pathname.split('/')[2])
  const decryptedMessage = await decryptMessage(extractedKey,downloadData);
  return decryptedMessage
}