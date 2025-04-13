import React from "react";
import axios from "axios";
import { getSocket } from "../socket"; // Import the socket helper

function Logout({ setLoggedIn }) {
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    const logoutUser = async () => {
        try {
            const socket = getSocket();
            if (socket) {
                socket.close();
                console.log("Socket disconnected on logout");
            }

            await axios.post(
                `${baseURL}api/user/logout/`,
                {},
                { withCredentials: true } // Only useful if cookies were being used
            );

            // Clean up localStorage
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("employeeId");
            localStorage.removeItem("role");
            localStorage.removeItem("username"); // ✅ Remove username as well
            setLoggedIn(false);
            console.log("User logged out");
        } catch (err) {
            console.error("Logout failed", err);
            // Still force logout even if request fails
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("employeeId");
            localStorage.removeItem("role");
            localStorage.removeItem("username"); // ✅ Ensure cleanup here too
            setLoggedIn(false);
        }
    };

    return <button onClick={logoutUser}>Logout</button>;
}

export default Logout;
