import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRefresh } from "../contexts/RefreshContext";

function HRDashboard() {
    const [employees, setEmployees] = useState([]);
    const [bulkPTO, setBulkPTO] = useState({});
    const [message, setMessage] = useState("");
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;

    const { refreshFlag } = useRefresh();
    const username = localStorage.getItem("username");

    const commonHeaders = {
        "X-Username": username,
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${baseURL}api/user/employees/`, {
                headers: commonHeaders,
            });
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setMessage("Failed to fetch employees.");
        }
    };

    const fetchBulkPTO = async () => {
        try {
            const response = await axios.post(
                `${baseURL}api/user/bulk_pto/`,
                {}, // still necessary for POST
                {
                    withCredentials: true,
                    headers: {
                        'X-Username': localStorage.getItem("username"),
                        'Content-Type': 'application/json',
                    },
                }
            );

            const ptoArray = response.data.pto_records || [];
            const ptoMap = {};
            ptoArray.forEach((record) => {
                ptoMap[String(record.employee_id)] = record;
            });

            setBulkPTO(ptoMap);
        } catch (error) {
            console.error("Error fetching bulk PTO data:", error);
            setMessage("Failed to fetch PTO data.");
        }
    };

    const fetchAllData = async () => {
        await fetchEmployees();
        await fetchBulkPTO();
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        console.log("Refresh flag updated in HRDashboard, re-fetching data...");
        fetchAllData();
    }, [refreshFlag]);

    useEffect(() => {
        const handleDashboardUpdate = (e) => {
            const update = e.detail;
            console.log("Socket dashboardUpdate event received:", update);

            if (update.type === "bulk_pto_lookup" && update.payload?.pto_records) {
                const updatedPTO = {};
                update.payload.pto_records.forEach((record) => {
                    updatedPTO[String(record.employee_id)] = record;
                });
                setBulkPTO(updatedPTO);
                console.log("Updated bulkPTO from socket message:", updatedPTO);
            }
        };

        window.addEventListener("dashboardUpdate", handleDashboardUpdate);
        return () => window.removeEventListener("dashboardUpdate", handleDashboardUpdate);
    }, []);

    const updatePTO = async (employeeId) => {
        const record = bulkPTO[String(employeeId)];
        if (!record) {
            setMessage(`No PTO record found for Employee ID: ${employeeId}`);
            return;
        }

        const newBalance = record.pto_balance;

        try {
            await axios.patch(
                `${baseURL}api/user/employees/${employeeId}/pto/`,
                { pto_balance: newBalance },
                { headers: commonHeaders }
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>PTO Balance</th>
                    <th>Update PTO</th>
                </tr>
                </thead>
                <tbody>
                {employees.length > 0 ? (
                    employees.map((employee) => {
                        const empId = String(employee.employee_id || employee.id);
                        const bulkRecord = bulkPTO[empId];
                        const balance = bulkRecord ? bulkRecord.pto_balance : employee.pto_balance;

                        return (
                            <tr key={empId}>
                                <td>{empId}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{balance}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={bulkRecord ? bulkRecord.pto_balance : ""}
                                        onChange={(e) =>
                                            setBulkPTO((prev) => ({
                                                ...prev,
                                                [empId]: {
                                                    ...prev[empId],
                                                    pto_balance: parseInt(e.target.value, 10) || 0,
                                                },
                                            }))
                                        }
                                    />
                                    <button onClick={() => updatePTO(empId)}>
                                        Update
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="5">No employees found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default HRDashboard;
