import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRefresh } from "../contexts/RefreshContext"; // Import the custom hook

function HRDashboard() {
    const [employees, setEmployees] = useState([]);
    const [ptoBalance, setPtoBalance] = useState({});
    const [message, setMessage] = useState("");
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    // Get the refresh flag from our RefreshContext
    const { refreshFlag } = useRefresh();

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${baseURL}api/user/employees/`, {
                withCredentials: true,
            });
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Initial fetch when component mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Re-fetch employees whenever the refresh flag changes
    useEffect(() => {
        console.log("Refresh flag changed in HRDashboard, re-fetching employees...");
        fetchEmployees();
    }, [refreshFlag]);

    const updatePTO = async (employeeId) => {
        try {
            await axios.patch(
                `${baseURL}api/user/employees/${employeeId}/pto/`,
                { pto_balance: ptoBalance[employeeId] },
                { withCredentials: true }
            );
            setMessage(`PTO updated for Employee ID: ${employeeId}`);
        } catch (err) {
            setMessage("Failed to update PTO.");
            console.error(err);
        }
    };

    return (
        <div>
            <h2>HR Dashboard</h2>
            {message && <p>{message}</p>}
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>PTO Balance</th>
                    <th>Update PTO</th>
                </tr>
                </thead>
                <tbody>
                {employees.map((employee) => (
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.pto_balance}</td>
                        <td>
                            <input
                                type="number"
                                value={ptoBalance[employee.id] || ""}
                                onChange={(e) =>
                                    setPtoBalance({
                                        ...ptoBalance,
                                        [employee.id]: e.target.value,
                                    })
                                }
                            />
                            <button onClick={() => updatePTO(employee.id)}>
                                Update
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default HRDashboard;
