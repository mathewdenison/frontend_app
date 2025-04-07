import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRefresh } from "../contexts/RefreshContext"; // Import the custom hook

function HRDashboard() {
    const [bulkPTO, setBulkPTO] = useState([]);
    const [ptoBalance, setPtoBalance] = useState({});
    const [message, setMessage] = useState("");
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    // Get the refresh flag from our RefreshContext.
    const { refreshFlag } = useRefresh();

    // Fetch bulk PTO data.
    const fetchBulkPTO = async () => {
        try {
            const response = await axios.get(`${baseURL}api/user/bulk_pto/`, {
                withCredentials: true,
            });
            // Assume response.data.pto_records is an array of objects:
            // [ { employee_id: 1, pto_balance: 8 }, { employee_id: 2, pto_balance: 5 }, ... ]
            setBulkPTO(response.data.pto_records || []);
        } catch (error) {
            console.error("Error fetching bulk PTO data:", error);
        }
    };

    // Initial fetch on component mount.
    useEffect(() => {
        fetchBulkPTO();
    }, []);

    // Re-fetch bulk PTO data whenever the refresh flag changes.
    useEffect(() => {
        console.log("Refresh flag changed in HRDashboard, re-fetching bulk PTO data...");
        fetchBulkPTO();
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
                    <th>Employee ID</th>
                    <th>PTO Balance</th>
                    <th>Update PTO</th>
                </tr>
                </thead>
                <tbody>
                {bulkPTO.map((record) => (
                    <tr key={record.employee_id}>
                        <td>{record.employee_id}</td>
                        <td>{record.pto_balance}</td>
                        <td>
                            <input
                                type="number"
                                value={ptoBalance[record.employee_id] || ""}
                                onChange={(e) =>
                                    setPtoBalance({
                                        ...ptoBalance,
                                        [record.employee_id]: e.target.value,
                                    })
                                }
                            />
                            <button onClick={() => updatePTO(record.employee_id)}>
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
