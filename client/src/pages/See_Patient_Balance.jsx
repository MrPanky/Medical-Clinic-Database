import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';


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
                sum += patient[i].cost;
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
        console.log(patient[index].dateTime);
        const correctdate= patient[index].dateTime.toString().slice(0, 19).replace('T', ' ');

        try{
            const q = `INSERT INTO Invoice (appointment_ID, appointmentDateTime, patientBillingID, patient_name, patient_address, patient_phone, patient_email, patient_insurance, services, amountCharged, amountDue, created ) VALUES ('`+patient[index].appointment_ID+`','`+correctdate+`','`+patient[index].billingID+`','`+patient[index].first_name+' '+patient[index].last_name+`','`+patient[index].address_line_1+`','3332224552','johndoe@example.com','Insurance Company ABC','`+patient[index].appointment_type+`',`+patient[index].cost+`,0.00, CURRENT_TIMESTAMP);`;

    console.log(q);
            
            await axios.put(`https://group8backend.azurewebsites.net/See_Patient_Balance`, {ID});
            await axios.post(`https://group8backend.azurewebsites.net/See_Patient_Balance`, {q});
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
            <p>ID: {patient[0].medical_ID}</p>
            <p>Name: {patient[0].first_name} {patient[0].last_name}</p>

            <div className='list'>
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Date and Time</th>
                            <th>Doctor</th>
                            <th>Cost</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.map((patient, index) => (
                                <tr key ={patient.appointment_ID}>
                                <td>{patient.appointment_ID}</td>
                                <td>{patient.dateTime}</td>
                                <td>{patient.doctor}</td>
                                <td>$ {patient.cost}</td>
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



export default See_Patient_Balance;
