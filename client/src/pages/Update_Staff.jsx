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
                const res = await axios.get(`https://group8backend.azurewebsites.net/staff/${employee_ID}`); // Adjust the endpoint as needed
                setStaff(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchStaff();
    }, [employee_ID]);

    const handleChange = (e) => {
        setStaff((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            let endpoint;
            // Determine the correct endpoint based on the role
            if (staff.role === "OfficeStaff") {
                endpoint = `https://group8backend.azurewebsites.net/staff/officestaff/${employee_ID}`; // Office staff endpoint
            } else if (staff.role === "BillingStaff") {
                endpoint = `https://group8backend.azurewebsites.net/staff/billingstaff/${employee_ID}`; // Billing staff endpoint
            }

            if (endpoint) {
                await axios.put(endpoint, staff); // Send request to the correct endpoint
                navigate("/director_view"); // Navigate back to the staff overview or main page
            } else {
                console.error("Please select a staff role."); // Handle case where role is not selected
            }
        } catch (err) {
            console.log(err); // Log any errors
        }
    };

    return (
        <div className='form'>
            <h1>Update Staff</h1>
            <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" value={staff.first_name} />
            <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" value={staff.last_name} />
            <input type="text" placeholder="Phone Number" onChange={handleChange} name="phone_number" value={staff.phone_number} />
            <input type="text" placeholder="Work Address" onChange={handleChange} name="work_address" value={staff.work_address} />
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
