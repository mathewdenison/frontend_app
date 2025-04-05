import { io } from "socket.io-client";  // Import the Socket.IO client

let socket;

export const connectSocket = (employee_id, auth_token) => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "34.133.98.208";  // Public IP of the dashboard service
    // Use the Socket.IO client to handle the connection
    socket = io(`${protocol}://${host}/api/dashboard/socket.io`, {
        query: { employee_id, auth_token },  // Sending the initial data
        transports: ['websocket']  // Ensures that only WebSockets are used
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
