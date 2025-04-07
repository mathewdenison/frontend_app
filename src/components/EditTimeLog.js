import React, { useState } from "react";
import axios from "axios";
import { useRefresh } from "../contexts/RefreshContext"; // Import the custom hook

function EditTimeLog({ timelogId, closeModal }) {
    console.log("In EditTimeLog for timelogId", timelogId);
    const { triggerRefresh } = useRefresh();

    // Initialize formData with empty values.
    const [formData, setFormData] = useState({
        monday_hours: "",
        tuesday_hours: "",
        wednesday_hours: "",
        thursday_hours: "",
        friday_hours: "",
        pto_hours: ""
    });
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send PATCH update with formData using the provided timelogId.
            const response = await axios.patch(
                `${baseURL}api/user/timelogs/update/${timelogId}/`,
                formData,
                { withCredentials: true }
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
                <div className="form-group">
                    <label>
                        Monday Hours:
                        <input
                            type="number"
                            name="monday_hours"
                            value={formData.monday_hours}
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
                            value={formData.tuesday_hours}
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
                            value={formData.wednesday_hours}
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
                            value={formData.thursday_hours}
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
                            value={formData.friday_hours}
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
                            value={formData.pto_hours}
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
