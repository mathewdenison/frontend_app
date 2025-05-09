import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import EditTimeLog from './EditTimeLog';
import { useRefresh } from "../contexts/RefreshContext";
import './Timesheet.css';

Modal.setAppElement('#root');

function EmployeeDashboard() {
    const [employees, setEmployees] = useState([]);
    const [bulkTimelogs, setBulkTimelogs] = useState({});
    const [error, setError] = useState("");
    const [editingLogId, setEditingLogId] = useState(null);
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    const { refreshFlag } = useRefresh();
    const username = localStorage.getItem("username");

    const headers = {
        "X-Username": username,
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${baseURL}api/user/employees/`, {
                headers,
            });
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to fetch employees.");
        }
    };

    const fetchBulkTimelogs = async () => {
        try {
            const response = await axios.get(`${baseURL}api/user/employees/timelogs/`, {
                headers,
            });
            setBulkTimelogs(response.data.timelogs || {});
        } catch (err) {
            console.error("Error fetching bulk timelogs:", err);
            setError("Failed to fetch timelogs.");
        }
    };

    useEffect(() => {
        const handleDashboardUpdate = (e) => {
            const update = e.detail;
            console.log("Dashboard update event received:", update);
            if (update.type === "bulk_timelog_lookup" && update.payload?.timelogs) {
                setBulkTimelogs(update.payload.timelogs);
                console.log("Updated bulk timelogs from socket:", update.payload.timelogs);
            }
        };

        window.addEventListener("dashboardUpdate", handleDashboardUpdate);
        return () => window.removeEventListener("dashboardUpdate", handleDashboardUpdate);
    }, []);

    useEffect(() => {
        fetchEmployees();
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Time Logs</th>
                </tr>
                </thead>
                <tbody>
                {employees.length > 0 ? (
                    employees.map((employee, index) => {
                        const empUUID = String(employee.employee_id || employee.id); // UUID preferred
                        const fallbackNumericKey = String(index + 7); // Fallback if needed

                        const logs =
                            bulkTimelogs[empUUID] ||
                            bulkTimelogs[employee.employee_id] ||
                            bulkTimelogs[fallbackNumericKey] ||
                            [];

                        return (
                            <tr key={empUUID}>
                                <td>{empUUID}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>
                                    {logs.length > 0 ? (
                                        logs.map((log, idx) => {
                                            const totalHours =
                                                log.monday_hours +
                                                log.tuesday_hours +
                                                log.wednesday_hours +
                                                log.thursday_hours +
                                                log.friday_hours;
                                            return (
                                                <div
                                                    key={`${empUUID}-${idx}`}
                                                    style={{
                                                        borderBottom: "1px solid #ccc",
                                                        padding: "5px",
                                                    }}
                                                >
                                                    <p>Week Start Date: {log.week_start_date}</p>
                                                    <p>Total Hours Worked: {totalHours}</p>
                                                    <p>PTO Hours: {log.pto_hours}</p>
                                                    <button
                                                        onClick={() => setEditingLogId(log.timelog_id || log.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        "No logs found"
                                    )}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="4">No employees found.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {editingLogId && (
                <Modal isOpen={true}>
                    <EditTimeLog timelogId={editingLogId} closeModal={() => setEditingLogId(null)} />
                </Modal>
            )}
        </div>
    );
}

export default EmployeeDashboard;
