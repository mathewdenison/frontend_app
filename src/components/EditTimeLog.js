import React, { useState } from "react";
import axios from "axios";
import { useRefresh } from "../contexts/RefreshContext"; // Custom hook

function EditTimeLog({ timelogId, closeModal }) {
    console.log("In EditTimeLog for timelogId", timelogId);
    const { triggerRefresh } = useRefresh();

    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    // Grab employeeId and username from localStorage
    const employeeId = localStorage.getItem("employeeId");
    const username = localStorage.getItem("username");

    const [formData, setFormData] = useState({
        monday_hours: "",
        tuesday_hours: "",
        wednesday_hours: "",
        thursday_hours: "",
        friday_hours: "",
        pto_hours: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                employee_id: employeeId
            };

            const response = await axios.patch(
                `${baseURL}api/user/timelogs/update/${timelogId}/`,
                payload,
                {
                    headers: {
                        "X-Username": username
                    }
                }
            );

            console.log("Update response:", response.data);
            triggerRefresh();
            closeModal();
        } catch (error) {
            console.error("Error updating timelog:", error);
            closeModal();
        }
    };

    return (
        <div style={{ position: "relative", padding: "20px", backgroundColor: "#fff" }}>
            <button
                onClick={closeModal}
                style={{ position: "absolute", top: 5, right: 5, fontSize: "16px", cursor: "pointer" }}
            >
                ×
            </button>
            <h2>Edit TimeLog for ID {timelogId}</h2>
            <form onSubmit={handleSubmit}>
                {["monday_hours", "tuesday_hours", "wednesday_hours", "thursday_hours", "friday_hours", "pto_hours"].map((field) => (
                    <div className="form-group" key={field}>
                        <label>
                            {field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}:
                            <input
                                type="number"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default EditTimeLog;
