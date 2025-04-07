import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import EditTimeLog from "./EditTimeLog";
import { useRefresh } from "../contexts/RefreshContext"; // Import our custom hook
import './Timesheet.css';

Modal.setAppElement('#root');

function EmployeeDashboard() {
    const [bulkTimelogs, setBulkTimelogs] = useState({});
    const [error, setError] = useState("");
    const [editingLogId, setEditingLogId] = useState(null);
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    // Get the refresh flag from our RefreshContext.
    const { refreshFlag } = useRefresh();

    // Function to fetch bulk timesheet data grouped by employee_id.
    const fetchBulkTimelogs = async () => {
        try {
            const response = await axios.get(`${baseURL}api/user/bulk_timelogs/`, {
                withCredentials: true,
            });
            // Expecting response.data.timelogs to be an object like: { "1": [ ... ], "2": [ ... ] }
            setBulkTimelogs(response.data.timelogs || {});
        } catch (err) {
            console.error("Error fetching bulk timelogs:", err);
            setError("Failed to fetch timelogs. Make sure you're logged in.");
        }
    };

    // Initial fetch when component mounts.
    useEffect(() => {
        fetchBulkTimelogs();
    }, []);

    // Re-fetch bulk timelogs whenever the refresh flag changes.
    useEffect(() => {
        console.log("Refresh flag updated in EmployeeDashboard, re-fetching bulk timelogs...");
        fetchBulkTimelogs();
    }, [refreshFlag]);

    return (
        <div>
            <h2>Employee Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table border="1">
                <thead>
                <tr>
                    <th>Employee ID</th>
                    <th>Time Logs</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(bulkTimelogs).length > 0 ? (
                    Object.keys(bulkTimelogs).map((empId) => {
                        const logs = bulkTimelogs[empId];
                        return (
                            <tr key={empId}>
                                <td>{empId}</td>
                                <td>
                                    {logs.map((log, index) => {
                                        const totalHours =
                                            log.monday_hours +
                                            log.tuesday_hours +
                                            log.wednesday_hours +
                                            log.thursday_hours +
                                            log.friday_hours;
                                        return (
                                            <div
                                                key={`${empId}-${index}`}
                                                style={{ borderBottom: "1px solid #ccc", padding: "5px" }}
                                            >
                                                <p>Week Start Date: {log.week_start_date}</p>
                                                <p>Total Hours Worked: {totalHours}</p>
                                                <p>PTO Hours: {log.pto_hours}</p>
                                                <button onClick={() => setEditingLogId(log.id)}>
                                                    Edit
                                                </button>
                                            </div>
                                        );
                                    })}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="2">No timelogs found</td>
                    </tr>
                )}
                </tbody>
            </table>
            {editingLogId && (
                <Modal isOpen={true}>
                    <EditTimeLog id={editingLogId} closeModal={() => setEditingLogId(null)} />
                </Modal>
            )}
        </div>
    );
}

export default EmployeeDashboard;
