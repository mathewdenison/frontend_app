import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout";
import { useRefresh } from "../contexts/RefreshContext";
import './Timesheet.css';

function dateFromStr(dateStr) {
    if (dateStr instanceof Date) return dateStr;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function Timesheet({ employeeId, csrfToken, setIsLoggedIn }) {
    const [ptoHours, setPtoHours] = useState(0);
    const [ptoBalance, setPtoBalance] = useState(0);
    const [timesheetData, setTimesheetData] = useState({
        week_start_date: new Date(),
        week_end_date: new Date(),
        monday_hours: "",
        tuesday_hours: "",
        wednesday_hours: "",
        thursday_hours: "",
        friday_hours: "",
        pto_hours: 0,
    });

    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;
    const { refreshFlag, triggerRefresh } = useRefresh();
    const username = localStorage.getItem("username");

    const headers = {
        "X-Username": username,
        "X-CSRFToken": csrfToken,
    };

    const fetchInitialData = async () => {
        try {
            const responseForWeek = await axios.get(`${baseURL}api/user/payPeriod`, {
                headers,
            });
            const weekStartDate = responseForWeek.data.week_start_date;
            const weekEndDate = responseForWeek.data.week_end_date;

            const responseForPtoBalance = await axios.get(`${baseURL}api/user/ptoBalance?employee_id=${employeeId}`, {
                headers,
            });
            setPtoBalance(responseForPtoBalance.data.pto_balance);

            setTimesheetData((prevData) => ({
                ...prevData,
                week_start_date: weekStartDate,
                week_end_date: weekEndDate,
            }));
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    useEffect(() => {
        fetchInitialData();
        if (csrfToken) {
            document.cookie = `csrftoken=${csrfToken}; path=/api/user/csrf; SameSite=Lax`;
        }
    }, [csrfToken, employeeId]);

    useEffect(() => {
        const handleRefreshEvent = () => {
            console.log("Dashboard refresh event received in Timesheet.");
            triggerRefresh();
        };
        window.addEventListener("dashboardRefresh", handleRefreshEvent);
        return () => window.removeEventListener("dashboardRefresh", handleRefreshEvent);
    }, [triggerRefresh]);

    useEffect(() => {
        const handleDashboardUpdate = (e) => {
            const update = e.detail;
            if (update.type === "pto_lookup" && String(update.employee_id) === String(employeeId)) {
                setPtoBalance(update.payload.pto_balance);
            }
        };
        window.addEventListener("dashboardUpdate", handleDashboardUpdate);
        return () => window.removeEventListener("dashboardUpdate", handleDashboardUpdate);
    }, [employeeId]);

    useEffect(() => {
        fetchInitialData();
    }, [refreshFlag, employeeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${baseURL}api/user/employees/${employeeId}/submit_timesheet/`,
                { ...timesheetData, employee: employeeId, pto_hours: ptoHours },
                { headers }
            );
            console.log("Timesheet submitted:", response.data);
            alert("Timesheet submitted successfully!");
        } catch (err) {
            console.error("Error submitting timesheet:", err);
            alert("Error submitting timesheet. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "ptoHours") {
            setPtoHours(value);
            setTimesheetData((prev) => ({ ...prev, pto_hours: value }));
        } else {
            setTimesheetData((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div>
            <h2>Submit Timesheet</h2>
            <h3>PTO Balance: {ptoBalance}</h3>
            <h3>Week Start Date: {dateFromStr(timesheetData.week_start_date).toDateString()}</h3>
            <h3>Week End Date: {dateFromStr(timesheetData.week_end_date).toDateString()}</h3>
            <div className="logout-button">
                <Logout setLoggedIn={setIsLoggedIn} />
            </div>
            <form onSubmit={handleSubmit}>
                <label>Monday Hours:
                    <input type="number" name="monday_hours" value={timesheetData.monday_hours} onChange={handleChange} required />
                </label><br />
                <label>Tuesday Hours:
                    <input type="number" name="tuesday_hours" value={timesheetData.tuesday_hours} onChange={handleChange} required />
                </label><br />
                <label>Wednesday Hours:
                    <input type="number" name="wednesday_hours" value={timesheetData.wednesday_hours} onChange={handleChange} required />
                </label><br />
                <label>Thursday Hours:
                    <input type="number" name="thursday_hours" value={timesheetData.thursday_hours} onChange={handleChange} required />
                </label><br />
                <label>Friday Hours:
                    <input type="number" name="friday_hours" value={timesheetData.friday_hours} onChange={handleChange} required />
                </label><br />
                <label>PTO Hours:
                    <input type="number" name="ptoHours" value={ptoHours} onChange={handleChange} required />
                </label><br />
                <button type="submit">Submit Timesheet</button>
            </form>
        </div>
    );
}

export default Timesheet;
