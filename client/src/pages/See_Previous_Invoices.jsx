import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './billing_staff_invoice.css';


const See_Previous_Invoices = () => {
    const [patient, setPatient] = useState('');
    const navigate = useNavigate();
    const choice = (localStorage.getItem('choice') === 'true');

    
    useEffect(() => {
        const patient_Data = localStorage.getItem('patient');
        console.log('Retrieved patient data:', patient_Data); // Add this line for debugging
        if (patient_Data) {
            setPatient(JSON.parse(patient_Data));
        }else{
            console.log("noai");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('patient'); // Clear employee info
        navigate('/Billing_Staff_View/SearchPatient'); // Navigate to the main page
    };

    if (!patient) {
        return <div>No patient information found.</div>;
    }

    const handleonClick = async (index) =>{
        localStorage.setItem('single_appointment', JSON.stringify(patient[index]));
        const ID = patient[index].appointment_ID;

        console.log("app index: ", ID);

        try{
            console.log(patient[index].officeID);
            const offID = patient[index].officeID;
            const res = await axios.post(`https://group8backend.azurewebsites.net/Created_invoice`, {offID, choice});
            localStorage.setItem('office_loc', JSON.stringify(res.data));
            console.log("office retrieved: ",res.data);


        }catch(e){
            console.log(e);
            return;
        }
        navigate("/billing_staff_view/SearchPatient/See_Patient_Balance/Created_invoice");

        
    }

try{
    return (
        <div>
            <h1>Paid Invoices</h1>
            <p>ID: {patient[0].patientBillingID}</p>
            <p>Name: {patient[0].patientName}</p>

            <div className='invoiceList'>
                <table className='invoicetable'>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Date and Time</th>
                            <th>Doctor</th>
                            <th>Paid On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.map((patient, index) => (
                                <tr key ={patient.appointment_ID}>
                                <td>{patient.appointment_ID}</td>
                                <td>{patient.appointmentDateTime}</td>
                                <td>{patient.doctor}</td>
                                <td>{patient.created}</td>
                                <td>
                                    <button onClick={() => handleonClick(index)}>
                                        See Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <br />
            <button className = "logout" onClick={handleLogout}>Return</button>

        </div>
    );

}catch{
    return(
    <div>Patient has no ammounts due
        <div>
            <button className = "logout" onClick={handleLogout}>Return</button>
        </div>
    </div>
    );

    
    

}
    
};



export default See_Previous_Invoices;