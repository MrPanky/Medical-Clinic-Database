import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Update_BillingStaff = () => {
    const [staff, setStaff] = useState({
        first_name: "",
        last_name: "",
        role: "BillingStaff",
        phone_number: "",
        address: "",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const employee_ID = location.pathname.split("/")[2];

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/staff/billingstaff/${employee_ID}`);
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
            await axios.put(`http://localhost:3000/staff/billingstaff/${employee_ID}`, staff);
            navigate("/director_view");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='form'>
            <h1>Update Billing Staff</h1>
            <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" value={staff.first_name} />
            <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" value={staff.last_name} />
            <input type="text" placeholder="Phone Number" onChange={handleChange} name="phone_number" value={staff.phone_number} />
            <input type="text" placeholder="Work Address" onChange={handleChange} name="address" value={staff.address} />
            <button className="formButton" onClick={handleClick}>Submit</button>
        </div>
    );
};

export default Update_BillingStaff;
