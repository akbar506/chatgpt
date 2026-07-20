import { io } from "socket.io-client";

export const socketClient = (accessToken) => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
        autoConnect: false,
        transports: ["websocket"],
        withCredentials: true,
        auth: {
            token: accessToken,
        },
    });

    return socket;
}