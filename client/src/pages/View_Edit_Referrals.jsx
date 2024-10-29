import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const View_Edit_Referrals = () => {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => { 
    const employee_Data_View_Referrals = localStorage.getItem('employee');
    console.log('Retrieved employee data: (REFERRALS)', employee_Data_View_Referrals); 
    if (employee_Data_View_Referrals) {
        const parsedDoctorInfo = JSON.parse(employee_Data_View_Referrals);
        setEmployee(parsedDoctorInfo);
        handleViewReferrals();
        const handleViewReferrals = async () => { //argument is directorId
            try {
                const res = await axios.get(`https://group8backend.azurewebsites.net/view_referrals/${parsedDoctorInfo.employee_ID}`);//request appointments that correspond to directorId
                
                console.log("REFERRAL QUERY: ", res.body);
                setReferrals(res.data); //update appointments state with filtered appointment list
                //const appointmentIdsList = res.data.map(appointment => appointment.appointment_ID).join(','); 
                //^^ gets list of appointment ids
                //const appointmentIds = futureAppointments.map(appointment => appointment.appointment_ID); //create new array of appointmentIDs
                //await fetchProfit(appointmentIdsList);
            } catch (err) {
                console.log('Error fetching appointments:', err);
            }
            handleViewReferrals();
        };
    }
}, [])

useEffect(() => {
    console.log('Updated referrals:', referrals);
}, [referrals]);

    return(
        <div className="di_container">
                <h2>Pending Referrals</h2>
                {referrals.length > 0 ? (
                    referrals.map(referrals => (
                        <div
                            className="di_info-card"
                            key={referrals.referral_ID}
                            onClick={() => navigate(`/edit_referral/${referrals.referral_ID}`)}
                        >
                            <h3>{referrals.patient_ID}</h3>
                            <p>Doctor: {referrals.originating_doctor_ID}</p>
                            <p>Reason: {referrals.reason}</p>
                        </div>
                    ))
                ) : (
                    <p>No referrals currently.</p>
                )}
            </div>
    )

};

export default View_Edit_Referrals;