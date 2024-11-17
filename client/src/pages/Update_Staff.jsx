import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const Update_Staff = () => {
    const [staff, setStaff] = useState({
        first_name: "",
        last_name: "",
        role: "",
        phone_number: "",
        work_address: "",
        last_edited: currentDate,
    });

    const navigate = useNavigate();
    const location = useLocation();
    const employee_ID = location.pathname.split("/")[2]; // Get employee ID from URL

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                // Adjust the endpoint to fetch the correct staff type
                const res = await axios.get(`http://localhost:3000/${staff.role.toLowerCase()}/${employee_ID}`);
                setStaff(res.data);
            } catch (err) {
                console.error("Error fetching staff data:", err);
            }
        };

        fetchStaff();
    }, [employee_ID, staff.role]);

    const handleChange = (e) => {
        setStaff((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            let endpoint;
            // Determine the correct endpoint based on the selected role
            if (staff.role === "OfficeStaff") {
                endpoint = `http://localhost:3000/officestaff/${employee_ID}`;
            } else if (staff.role === "BillingStaff") {
                endpoint = `http://localhost:3000/billingstaff/${employee_ID}`;
            }

            if (endpoint) {
                await axios.put(endpoint, staff); // Send request to the correct endpoint
                navigate("/director_view"); // Navigate back to the staff overview or main page
            } else {
                console.error("Please select a staff role."); // Handle case where role is not selected
            }
        } catch (err) {
            console.error("Error updating staff data:", err); // Log any errors
        }
    };

    return (
        <div className='form'>
            <h1>Update Staff</h1>
            <input
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                name="first_name"
                value={staff.first_name}
            />
            <input
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                name="last_name"
                value={staff.last_name}
            />
            <input
                type="text"
                placeholder="Phone Number"
                onChange={handleChange}
                name="phone_number"
                value={staff.phone_number}
            />
            <input
                type="text"
                placeholder="Work Address"
                onChange={handleChange}
                name="work_address"
                value={staff.work_address}
            />
            <select onChange={handleChange} name="role" value={staff.role}>
                <option value="" disabled>Select Role</option>
                <option value="OfficeStaff">Office Staff</option>
                <option value="BillingStaff">Billing Staff</option>
            </select>
            <button className="formButton" onClick={handleClick}>Submit</button>
        </div>
    );
};

export default Update_Staff;
