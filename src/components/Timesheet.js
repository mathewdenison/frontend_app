import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "./Logout"; // Import the Logout component
import './Timesheet.css';

function dateFromStr(dateStr) {
    if (dateStr instanceof Date) {
        return dateStr;
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function Timesheet({ employeeId, csrfToken, setIsLoggedIn }) { // Add setIsLoggedIn as a prop
    const [ptoHours, setPtoHours] = useState(0);
    const [ptoBalance, setPtoBalance] = useState(0);
    const baseURL = process.env.REACT_APP_PUBLIC_BASE_URL;
    const [timesheetData, setTimesheetData] = useState({
        week_start_date: new Date(),
        week_end_date: new Date(),
        monday_hours: "",
        tuesday_hours: "",
        wednesday_hours: "",
        thursday_hours: "",
        friday_hours: "",
        pto_hours: 0,  // initialize this state here
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const responseForWeek = await axios.get(`${baseURL}api/payPeriod`);
            const weekStartDate = responseForWeek.data.week_start_date;
            const weekEndDate = responseForWeek.data.week_end_date;

            const responseForPtoBalance = await axios.get(`${baseURL}api/ptoBalance?employee_id=${employeeId}`);
            setPtoBalance(responseForPtoBalance.data.pto_balance);

            // Set initial state based on API responses
            setTimesheetData((prevData) => ({
                ...prevData,
                week_start_date: weekStartDate,
                week_end_date: weekEndDate
            }));
        };

        fetchInitialData();

        if (csrfToken) {
            console.log("Overriding csrftoken cookie in Timesheet.");
            document.cookie = `csrftoken=${csrfToken}; path=/; domain=127.0.0.1; SameSite=Lax`;
        }
    }, [csrfToken, employeeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${baseURL}api/employees/${employeeId}/submit_timesheet/`,
                { ...timesheetData, employee: employeeId, pto_hours: ptoHours },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                }
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
        if(name === 'ptoHours') {
            setPtoHours(value);
            setTimesheetData((prevData) => ({
                ...prevData,
                pto_hours: value,  // update this state when ptoHours change
            }));
        } else {
            setTimesheetData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    return (
        <div>
            <h2>Submit Timesheet</h2>
            <h3>PTO Balance: {ptoBalance}</h3> {/* Display PTO balance */}
            <h3>Week Start Date: {dateFromStr(timesheetData.week_start_date).toDateString()}</h3>
            <h3>Week End Date: {dateFromStr(timesheetData.week_end_date).toDateString()}</h3>
            <div className="logout-button">  {/* Assign the CSS class to the Logout button */} <Logout
                setLoggedIn={setIsLoggedIn}/> {/* Logout button */} </div>
            <form onSubmit={handleSubmit}>
                <br/>
                <label>
                    Monday Hours:
                    <input
                        type="number"
                        name="monday_hours"
                        value={timesheetData.monday_hours}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br/>
                <label>
                    Tuesday Hours:
                    <input
                        type="number"
                        name="tuesday_hours"
                        value={timesheetData.tuesday_hours}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br/>
                <label>
                    Wednesday Hours:
                    <input
                        type="number"
                        name="wednesday_hours"
                        value={timesheetData.wednesday_hours}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br/>
                <label>
                    Thursday Hours:
                    <input
                        type="number"
                        name="thursday_hours"
                        value={timesheetData.thursday_hours}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br/>
                <label>
                    Friday Hours:
                    <input
                        type="number"
                        name="friday_hours"
                        value={timesheetData.friday_hours}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br/>
                <label>
                    PTO Hours:
                    <input
                        type="number"
                        name="ptoHours"
                        value={ptoHours}
                        onChange={(e) => setPtoHours(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit Timesheet</button>
            </form>
        </div>
    );
}

export default Timesheet;