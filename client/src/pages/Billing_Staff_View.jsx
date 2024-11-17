import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './billing_staff_invoice.css';


const Billing_Staff_View = () => {
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

    const getPastDueBills = async () =>{
        try{
        navigate("/billing_staff_view/Past_Due_Patients");
        }catch(e){
            console.log("catched");
        }
        return;

    }

    
    const searchPatientID = () =>{

            navigate("/billing_staff_view/Search_Patient_ID");

            return;
    }


    const handleonClick = (e) => {
        localStorage.setItem('choice', e);


        navigate("/billing_staff_view/SearchPatient");
    }
   
    if (!employee) {
        return <div>No employee information found.</div>;
    }


    return (
        <div className = "form">
            <h1>Employee Information</h1>
            <p>ID: {employee.employee_ID}</p>
            <p>Name: {employee.first_name} {employee.last_name}</p>
            <p>Role: {employee.role}</p>
            <button className = "invoiceoption" onClick={() => handleonClick(false)}>Pay Due Bills of a Patient</button>
            <button className = "invoiceoption"onClick={() => handleonClick(true)}>View Previous Invoices of a Patient</button>
            <button className = "invoiceoption"onClick={getPastDueBills}>View Patients with Past Due Bills</button>
            <button className = "invoiceoption"onClick={searchPatientID}>Search PatientID</button>
            <button className = "logout" onClick={handleLogout}>Logout</button>
        </div>
    );
};



export default Billing_Staff_View;