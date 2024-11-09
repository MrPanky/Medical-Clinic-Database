import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Doctor_View = () => {
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const employee_Data = localStorage.getItem('employee');
        console.log('Retrieved employee data:', employee_Data); // Add this line for debugging
        if (employee_Data) {
            setEmployee(JSON.parse(employee_Data));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('employee'); // Clear employee info
        navigate('/'); // Navigate to the main page
    };

    if (!employee) {
        return <div>No employee information found.</div>;
    }

    return (
        <div className="form">
            <h1>Employee Information</h1>
            <p>ID: {employee.employee_ID}</p>
            <p>Name: {employee.first_name} {employee.last_name}</p>
            <p>Role: {employee.role}</p>
            <button className = "logout" onClick={handleLogout}>Logout</button> 
        </div>
    );
};

export default Doctor_View;
