import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import EditTimeLog from './EditTimeLog';
import { useRefresh } from "../contexts/RefreshContext"; // Import the custom refresh hook

Modal.setAppElement('#root');

function EmployeeDashboard() {
    const [employees, setEmployees] = useState([]);
    const [timeLogs, setTimeLogs] = useState([]);
    const [error, setError] = useState("");
    const [editingLogId, setEditingLogId] = useState(null);
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    // Retrieve the refresh flag from RefreshContext.
    const { refreshFlag } = useRefresh();

    const fetchEmployeesAndLogs = async () => {
        try {
            const responseEmployees = await axios.get(`${baseURL}api/user/employees/`, {
                withCredentials: true,
            });
            const responseLogs = await axios.get(`${baseURL}api/user/employees/timelogs/`, {
                withCredentials: true,
            });

            console.log("responseLogs.data:", responseLogs.data);

            // Ensure timeLogs is an array.
            const logsArray = Array.isArray(responseLogs.data)
                ? responseLogs.data
                : Array.isArray(responseLogs.data.timelogs)
                    ? responseLogs.data.timelogs
                    : [];

            setEmployees(responseEmployees.data);
            setTimeLogs(logsArray);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch employees or timelogs. Make sure you're logged in.");
        }
    };

    // Initial fetch when component mounts.
    useEffect(() => {
        fetchEmployeesAndLogs();
    }, []);

    // Re-fetch data whenever refreshFlag changes.
    useEffect(() => {
        console.log("Refresh flag updated in EmployeeDashboard, re-fetching data...");
        fetchEmployeesAndLogs();
    }, [refreshFlag]);

    return (
        <div>
            <h2>Employee Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Time Logs</th>
                </tr>
                </thead>
                <tbody>
                {employees.map((employee) => {
                    const logs = timeLogs.filter(
                        (log) => Number(log.employee) === Number(employee.id)
                    );

                    return logs.length
                        ? logs.map((log, index) => {
                            const totalHoursWorked =
                                log.monday_hours +
                                log.tuesday_hours +
                                log.wednesday_hours +
                                log.thursday_hours +
                                log.friday_hours;
                            return (
                                <tr key={`${employee.id}-${index}`}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>
                                        <p>Week Start Date: {log.week_start_date}</p>
                                        <p>Total Hours Worked: {totalHoursWorked}</p>
                                        <p>PTO Hours: {log.pto_hours}</p>
                                        <button onClick={() => setEditingLogId(log.id)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                        : (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>No logs found</td>
                            </tr>
                        );
                })}
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
