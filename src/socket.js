// socket.js
let socket;

export const connectSocket = (employee_id, auth_token) => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = "34.133.98.208";  // Your external IP address (or use your Ingress host)
    socket = new WebSocket(`${protocol}://${host}/api/dashboard/socket.io/?EIO=4&transport=websocket`);


    socket.onopen = () => {
        const joinPayload = JSON.stringify({
            type: "join",
            data: { employee_id, auth_token }
        });
        socket.send(joinPayload);
    };

    socket.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === "dashboard_update") {
                const update = parsed.data;

                const event = new CustomEvent("dashboardUpdate", { detail: update });
                window.dispatchEvent(event);
            }
        } catch (e) {
            console.error("Error parsing WebSocket message:", e);
        }
    };
};

export const getSocket = () => socket;
