import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './medical_staff_style.css';

const Doctor_View = () => {
    const [employee, setEmployee] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [info, setInfo] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [patientWeight, setPatientWeight] = useState([{ medicalId: '' }]);
    const options = {
        timeZone : 'America/Monterrey'
    }
    const navigate = useNavigate();

    useEffect(() => {
        const employee_Data = localStorage.getItem('employee'); //retrieve employee info using employee key
        console.log("HELLO")
        console.log('Retrieved employee data:', employee_Data); // Add this line for debugging
        if (employee_Data) {
            const parsedDoctorInfo = JSON.parse(employee_Data);
            setEmployee(parsedDoctorInfo);
            const fetchAllInfo = async () => {
                try {
                    const res = await axios.get(`https://group8backend.azurewebsites.net/doctor_view/${parsedDoctorInfo.employee_ID}`); //use axios to request employee info, passing employeeID as argument
                    setInfo(res.data); //use the info we just got to update info state
                    //console.log("Employee state", employee);
                    console.log("Retrieved info", info);
                    //console.log("THE EMPLOYEE ID ON LINE 27 IS", employee.employee_ID)
                    const doctorId = parsedDoctorInfo.employee_ID; //fetch office where director works (function defined below)
                    //setOfficeId(fetchedOfficeId); //update officeId state with fetched office ID

                    await handleViewAppointments(doctorId); //return array of future appointments, and an array of appintment IDs
                    await handleViewReferrals(doctorId);
                    if (res.data.length > 0) {
                        //const firstDoctorId = res.data[0].employee_ID; //res should correspond to a single employee but whatever
                        await handleViewPatients(doctorId); //get array of patients of doctor
                        //await handleViewAvailability(doctorId);
                    }
                } catch (err) {
                    console.log(err);
                }
            };
            fetchAllInfo();

        }
    }, []);

    useEffect(() => {
        console.log('Updated info:', info);
    }, [info]);
    useEffect(() => {
        console.log("Scheduled Appointments:", appointments);
    }, [appointments]);
    useEffect(() => {
        console.log("Patients:", patients);
    }, [patients]);
    useEffect(() => {
        console.log("Availability:", availability);
    }, [availability]);
    useEffect(() => {
        console.log("EMPLOYEE STATE", employee)
    }, [employee]);
    useEffect(() => {
        console.log("Current Referrals", referrals)
    }, [referrals]);

    const handleViewAppointments = async (doctorId) => { //argument is directorId
        try {
            const res = await axios.get(`https://group8backend.azurewebsites.net/appointments/${doctorId}`);//request appointments that correspond to directorId
            const futureAppointments = res.data.filter(appointment => { //.filter filters data in res using below comparison
                const appointmentDate = new Date(appointment.dateTime);
                const today = new Date();
                return appointmentDate.getTime() > today.getTime()
            } //create date with appointment datetime, use > to compare to current date
            ); //=> means lambda function

            setAppointments(futureAppointments); //update appointments state with filtered appointment list
            //const appointmentIdsList = res.data.map(appointment => appointment.appointment_ID).join(','); 
            //^^ gets list of appointment ids
            //const appointmentIds = futureAppointments.map(appointment => appointment.appointment_ID); //create new array of appointmentIDs
            //await fetchProfit(appointmentIdsList);
        } catch (err) {
            console.log('Error fetching appointments:', err);
        }
    };

    const handleViewPatients = async (doctorId) => { //doctorId passed as argument
        try {
            const res = await axios.get(`https://group8backend.azurewebsites.net/doctors_patient/${doctorId}`); //request doctors_patient entries with doctor_ids
            setPatients(res.data); //update patients state with res
        } catch (err) {
            console.log('Error fetching patients:', err);
        }
    };
    const handleViewReferrals = async (doctorId) => {
        try {
            const res = await axios.get(`https://group8backend.azurewebsites.net/view_referrals/${doctorId}`);
            setReferrals(res.data);
        }
        catch (err) {
            console.log('Error fetching referrals', err);
        }
    }

    // const handleReviewClick = (medId) => {
    //     if (medId) {
    //         try {
    //             const res = await axios.get(`https://group8backend.azurewebsites.net/patient_check/${doctorId}`);
    //         }

    //     }
    // }

    const handleChange = (e) => {
        setPatientWeight(prev => ({ ...prev, medicalId: e.target.value }));

    };

    const handleLogout = () => {
        localStorage.removeItem('employee'); // Clear employee info
        navigate('/'); // Navigate to the main page
    };

    if (!employee) {
        return <div>No employee information found.</div>;
    }

    return ( //for displaying stuff I guess
        <div className="doc_grid_container">
            <div className="doc_form">
                <h1>Employee Information</h1>
                <p>ID: {employee.employee_ID}</p>
                <p>Name: {employee.first_name} {employee.last_name}</p>
                <p>Role: {employee.role}</p>
                <button className="doc_logout" onClick={handleLogout}>Logout</button>
            </div>

            <div className="doc_container doc_appointments">
                <h2>Upcoming Appointments</h2>
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div
                            className="doc_info_card"
                            key={appointment.appointment_ID}
                            onClick={() => navigate(`/appointment_info/${appointment.appointment_ID}`)}
                        >
                            <h3>{appointment.patientName}</h3>
                            <p>Doctor: {appointment.doctor}</p>
                            <p>Date: {new Date(appointment.dateTime).toLocaleString('en-US', options)}</p>
                            <p>Reason: {appointment.reason}</p>
                        </div>
                    ))
                ) : (
                    <p>No appointments currently set.</p>
                )}
                {/* <button type="button"
                    onClick={() => navigate(`/Avail_summary/${employee.employee_ID}`)}
                ></button> */}
            </div>
            <div className="doc_container doc_patients">
                <h2>Patients Overview</h2>
                {patients.length > 0 ? (
                    patients.map(patient => (
                        <div
                            className="doc_info_card"
                            key={patient.medical_ID}
                            onClick={() => navigate(`/patient_info/${patient.medical_ID}`)}
                        >
                            <h3>{patient.first_name} {patient.last_name}</h3>
                            <p>Phone: {patient.home_phone}</p>
                            <p>Email: {patient.personal_email}</p>
                        </div>
                    ))
                ) : (
                    <p>No patients found for this doctor.</p>
                )}
            </div>
            <div className="doc_container doc_patients">
                <h2>Pending Referrals</h2>
                {referrals.length > 0 ? (
                    referrals.map(referral => (
                        <div
                            className="doc_info_card"
                            key={referral.referral_ID}
                            onClick={() => navigate(`/Referral_Info/${referral.referral_ID}`)}

                        >
                            <p>Patient ID: {referral.patient_ID}</p>
                            <p>Referring Doctor: {referral.originating_doctor_contact_info}</p>
                            <p>Reason: {referral.reason}</p>
                            <p></p>
                        </div>
                    ))
                ) : (
                    <p>No pending referrals</p>
                )}
            </div>
            <div className="doc_container"
                onClick={() => navigate(`/Create_Referral/${employee.employee_ID}`)}
            >
                <h2> Generate Referral </h2>

            </div>
            <div className="doc_container"
                onClick={() => navigate(`/Doc_Avail_Summary/${employee.employee_ID}`)}
            >
                <h2> Edit available hours</h2>
                {/* <div onClick={() => navigate(`/Avail_summary/${employee.employee_ID}`)}>
                    <h3>See Current Availability</h3> */}
            </div>
            <div className='doc_container doc_patients'>
                <h1>Weight Report</h1>
                <input type="text" placeholder='patient_ID MXXXXXXXX' onChange={handleChange} name='patient_ID' />
                {patientWeight.medicalId && (
                    <button onClick={() => navigate(`/Patient_Weight_Review/${patientWeight.medicalId}`)}> Review Weight History</button>
                )}
            </div>
            {/* {availability.length > 0 ? (

                    
                    availability.map(availability => (
                        <div
                            className="di_info-card"
                            key={availability.medical_ID}
                            onClick={() => navigate(`/patient_info/${patient.medical_ID}`)}
                        >
                            <h3>{patient.first_name} {patient.last_name}</h3>
                            <p>Phone: {patient.home_phone}</p>
                            <p>Email: {patient.personal_email}</p>
                        </div>
                    ))
                ) : (
                    <p>No patients found for this doctor.</p>
                )} */}

            {/* <div className="di_container di_patients">
                <h2></h2>
            </div> */}
        </div>
    );
};

export default Doctor_View;

