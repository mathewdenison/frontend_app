import { io } from "socket.io-client";

let socket;

export const connectSocket = (employee_id, auth_token) => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "34.118.235.1:8000";

    // THIS IS THE KEY LINE
    socket = io(`${protocol}://${host}`, {
        path: '/ws/dashboard',  // ✅ Match this to Flask-SocketIO path
        query: { employee_id, auth_token },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log("WebSocket connected");
    });

    socket.on('dashboard_update', (update) => {
        const event = new CustomEvent("dashboardUpdate", { detail: update });
        window.dispatchEvent(event);
    });

    socket.on('disconnect', () => {
        console.log("WebSocket disconnected");
    });

    socket.on('connect_error', (error) => {
        console.error("WebSocket connection error:", error);
    });
};

export const getSocket = () => socket;
