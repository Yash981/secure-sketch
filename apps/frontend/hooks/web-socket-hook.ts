import { useEffect, useRef, useState, useCallback } from 'react';

export function useWebsocket(url: string) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

    const connect = useCallback(() => {
        if (ws.current) return;

        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connection opened.');
        };

        ws.current.onmessage = (message: MessageEvent) => {
            setLastMessage(message);
        };

        ws.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket connection closed.');
            ws.current = null;
        };

        ws.current.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };
    }, [url]);

    const disconnect = useCallback(() => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
    }, []);

    const sendMessage = useCallback(
        (data: string) => {
            if (ws.current && isConnected) {
                ws.current.send(data);
            } else {
                console.warn('WebSocket is not connected.');
            }
        },
        [isConnected]
    );

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return { sendMessage, lastMessage, isConnected };
}