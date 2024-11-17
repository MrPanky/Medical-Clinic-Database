import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const randomEmployeeID = () => {
    return Math.floor(Math.random() * 100000000);
};

const Add_Staff = () => {
    const [staff, setStaff] = useState({
        first_name: "",
        last_name: "",
        employee_ID: "E" + randomEmployeeID(),
        role: "", // Role of the staff
        phone_number: "",
        work_address: "",
        created: currentDate
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setStaff((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        console.log("Staff Data Being Sent:", staff); // Log the staff data
    
        try {
            await axios.post(`http://localhost:3000/staff/${staff.role.toLowerCase()}`, staff);
            navigate("/director_view");
        } catch (err) {
            console.log("Error Response:", err.response.data); // Log any response errors
        }
    };
    

    return (
        <div className='form'>
            <h1>Add New Staff</h1>
            <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" />
            <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" />
            <input type="text" placeholder="Phone Number" onChange={handleChange} name="phone_number" />
            <input type="text" placeholder="Address" onChange={handleChange} name="address" />
            <input type="text" placeholder="email" onChange={handleChange} name="email" />
            <select onChange={handleChange} name="role">
                <option value="" disabled selected>Select Role</option>
                <option value="OfficeStaff">Office Staff</option>
                <option value="BillingStaff">Billing Staff</option>
            </select>
            <button className="formButton" onClick={handleClick}>Submit</button>
        </div>
    );
};

export default Add_Staff;
