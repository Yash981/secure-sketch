import { useEffect, useRef, useState, useCallback } from 'react';

export function useWebsocket(token: string | null) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

    const connect = useCallback(() => {
        if (ws.current) return;
        console.log(token,'token')
        if(!token) return ;

        ws.current = new WebSocket(`ws://localhost:8080?token=${token}`);

        ws.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connection opened.');
        };

        ws.current.onmessage = (message: MessageEvent) => {
            const data = JSON.parse(message.data)
            setLastMessage(data);
        };

        ws.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket connection closed.');
            ws.current = null;
        };

        ws.current.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };
    }, [token]);

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