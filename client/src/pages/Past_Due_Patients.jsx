import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';


const Past_Due_Patients = () => {
    const [patients, setPatients] = useState('');
    const navigate = useNavigate();

    
    useEffect(() => {
        const patients_Data = localStorage.getItem('Past_Due_Patients');
        console.log('Retrieved patients data:', patients_Data); // Add this line for debugging
        if (patients_Data) {
            setPatients(JSON.parse(patients_Data));
        }else{
            console.log("noai");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('Past_Due_Patients'); // Clear employee info
        navigate('/Billing_Staff_View'); // Navigate to the main page
    };


    

try{
    if(patients.length == 0){
        throw("No patients retrieved");

    }
    return (
        <div>
            <h1>Past Due Patients</h1>

            <div className='list'>
                <table>
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>email</th>
                            <th>Home Number</th>
                            <th>Work Number</th>
                            <th>Cell Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                                <tr key ={patient.medical_ID}>
                                <td>{patient.first_name} {patient.last_name}</td>
                                <td className='table-cell'>{patient.personal_email}</td>
                                <td>{patient.home_phone}</td>
                                <td>{patient.work_phone}</td>
                                <td>{patient.cell_phone}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <br />
            <button className = "logout" onClick={handleLogout}>Return</button>

        </div>
    );

}catch (err){
    console.log(err);
    return(
    <div>No Patients with Unpaid Bills in the past 2 weeks
        <div>
            <button className = "logout" onClick={handleLogout}>Return</button>
        </div>
    </div>
    );

    
    

}
    
};



export default Past_Due_Patients;
