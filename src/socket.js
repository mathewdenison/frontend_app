import { io } from "socket.io-client";

let socket;

export const connectSocket = (employee_id, auth_token) => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "34.118.235.1:8000";

    socket = io(`${protocol}://${host}`, {
        // Use the default path unless you change it on the server.
        path: '/socket.io',
        auth: { employee_id, auth_token },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log("Socket.IO connected");
    });

    socket.on('dashboard_update', (update) => {
        const event = new CustomEvent("dashboardUpdate", { detail: update });
        window.dispatchEvent(event);
    });

    socket.on('disconnect', () => {
        console.log("Socket.IO disconnected");
    });

    socket.on('connect_error', (error) => {
        console.error("Socket.IO connection error:", error);
    });
};

export const getSocket = () => socket;
