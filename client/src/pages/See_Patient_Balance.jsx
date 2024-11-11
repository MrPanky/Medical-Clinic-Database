import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './billing_staff_invoice.css';


const See_Patient_Balance = () => {
    const [patient, setPatient] = useState('');
    const navigate = useNavigate();

    
    useEffect(() => {
        const patient_Data = localStorage.getItem('patient');
        console.log('Retrieved patient data:', patient_Data); // Add this line for debugging
        if (patient_Data) {
            setPatient(JSON.parse(patient_Data));
        }else{
            console.log("noai");
        }
    }, []);

    const setTotal = () =>{
        var sum = 0;
            for(var i =0; i < patient.length; i++){
                sum += patient[i].amountDue;
            }
            return sum;
    }

    

    const handleLogout = () => {
        localStorage.removeItem('patient'); // Clear employee info
        navigate('/Billing_Staff_View/SearchPatient'); // Navigate to the main page
    };


    const handleButtonClick = () => {
        const userConfirmed = window.confirm('Are you sure you want to proceed?');
    
        if (userConfirmed) {
          // The user clicked "OK"
          return true;
        } else {
          // The user clicked "Cancel"
          return false;

        }
    };
   
    if (!patient) {
        return <div>No patient information found.</div>;
    }

    const handleonClick = async (index) =>{
       if(!handleButtonClick()){
            return;
       }
        localStorage.setItem('single_appointment', JSON.stringify(patient[index]));
        const ID = patient[index].appointment_ID;

        console.log("app index: ", ID);

        try{

            
            await axios.post(`https://group8backend.azurewebsites.net/See_Patient_Balance`, {ID});
            console.log("office ID: ",patient[index].officeID);

            const offID = patient[index].officeID;
            const res = await axios.post(`https://group8backend.azurewebsites.net/Created_invoice`, {offID});
            localStorage.setItem('office_loc', JSON.stringify(res.data));
            console.log("office retrieved: ",res.data);
        }catch(e){
            console.log("catched");
            console.log(e);
            return;
        }
        navigate("/billing_staff_view/SearchPatient/See_Patient_Balance/Created_invoice");

        
    }

try{
    return (
        <div>
            <h1>Unpaid Bills</h1> 
            <p>ID: {patient[0].patientmedicalID}</p>
            <p>Name: {patient[0].patientName}</p>

            <div className='invoiceList'>
                <table className='invoicetable'>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Date and Time</th>
                            <th>Cost</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.map((patient, index) => (
                                <tr key ={patient.appointment_ID}>
                                <td>{patient.appointment_ID}</td>
                                <td>{patient.appointmentDateTime}</td>
                                <td>$ {patient.amountDue}</td>
                                <td>
                                    <button onClick={() => handleonClick(index)}>
                                        Pay
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

                <h4>Total Due: $ {setTotal()}</h4>


            <button className = "logout" onClick={handleLogout}>Return</button>

        </div>
    );

}catch(e){
    console.log(e);
    return(
    <div>Patient has no ammounts due
        <div>
            <button className = "logout" onClick={handleLogout}>Return</button>
        </div>
    </div>
    );

    
    

}
    
};



export default See_Patient_Balance;