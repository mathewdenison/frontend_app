import React from "react";
import axios from "axios";

function Logout({ setLoggedIn }) {
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;
    const logoutUser = async () => {
        try {
            // Send request to logout endpoint
            await axios.post(
                `${baseURL}api/logout/`,
                {}, // Payload (no data needed)
                { withCredentials: true } // Include session cookies
            );

            /* Logout from localStorage and state */
            localStorage.removeItem("isLoggedIn");
            setLoggedIn(false); // Update parent component state

        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return <button onClick={logoutUser}>Logout</button>;
}

export default Logout;