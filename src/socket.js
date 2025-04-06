let socket;

export const connectSocket = (employee_id, auth_token) => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "34.118.235.1:8000";
    // Build the WebSocket URL using the plain WebSocket endpoint.
    const wsUrl = `${protocol}://${host}/ws/dashboard?employee_id=${employee_id}&auth_token=${auth_token}`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        console.log("Received:", event.data);
        const update = JSON.parse(event.data);
        const dashboardEvent = new CustomEvent("dashboardUpdate", { detail: update });
        window.dispatchEvent(dashboardEvent);
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
        console.error("WebSocket connection error:", error);
    };

    return socket;
};

export const getSocket = () => socket;
