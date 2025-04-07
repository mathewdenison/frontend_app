import React, { useState, useEffect } from "react";
import axios from "axios";

function EditTimeLog({ closeModal }) {
    console.log("In EditTimeLog");

    // Retrieve the employeeId from local storage.
    const employeeId = localStorage.getItem("employeeId");

    const [log, setLog] = useState({});
    const [formData, setFormData] = useState({});
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use employeeId from local storage as a query parameter.
                const response = await axios.get(
                    `${baseURL}api/user/timelogs/`,
                    {
                        withCredentials: true,
                        params: { employee_id: employeeId }
                    }
                );
                setLog(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching timelog:", error);
                // Close the modal if fetching fails.
                closeModal();
            }
        };
        if (employeeId) {
            fetchData();
        }
    }, [employeeId, baseURL, closeModal]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send employeeId as a query parameter in the PUT request.
            const response = await axios.put(
                `${baseURL}api/user/timelogs/`,
                formData,
                {
                    withCredentials: true,
                    params: { employee_id: employeeId }
                }
            );
            console.log("Update response:", response.data);
            closeModal();
        } catch (error) {
            console.error("Error updating timelog:", error);
            // Close the modal automatically on failure.
            closeModal();
        }
    };

    return (
        <div style={{ position: "relative", padding: "20px", backgroundColor: "#fff" }}>
            {/* Close button at the top right */}
            <button
                onClick={closeModal}
                style={{ position: "absolute", top: 5, right: 5, fontSize: "16px", cursor: "pointer" }}
            >
                ×
            </button>
            <h2>Edit TimeLog for Employee {employeeId}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Monday Hours:
                        <input
                            type="number"
                            name="monday_hours"
                            value={formData.monday_hours || ""}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Tuesday Hours:
                        <input
                            type="number"
                            name="tuesday_hours"
                            value={formData.tuesday_hours || ""}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Wednesday Hours:
                        <input
                            type="number"
                            name="wednesday_hours"
                            value={formData.wednesday_hours || ""}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Thursday Hours:
                        <input
                            type="number"
                            name="thursday_hours"
                            value={formData.thursday_hours || ""}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Friday Hours:
                        <input
                            type="number"
                            name="friday_hours"
                            value={formData.friday_hours || ""}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        PTO Hours:
                        <input
                            type="number"
                            name="pto_hours"
                            value={formData.pto_hours || ""}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default EditTimeLog;
