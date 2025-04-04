import React, { useState, useEffect } from "react";
import axios from "axios";

function EditTimeLog({ id, closeModal }) {
    console.log("In EditTimeLog")
    const [log, setLog] = useState({});
    const [formData, setFormData] = useState({});
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${baseURL}api/user/timelogs/${id}/`, {
                withCredentials: true,
            });
            setLog(response.data);
            setFormData(response.data);
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await axios.put(`${baseURL}api/user/timelogs/${id}/`, formData, {
            withCredentials: true,
        });
        console.log(response);
        closeModal();
    };

    // Basic form structure with PTO and CSS to make each field have a new line.
    return (
        <div>
            <h2>Edit TimeLog for {log.employee}</h2>
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