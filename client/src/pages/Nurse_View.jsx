import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';


const Nurse_View = () => {
    const [employee, setEmployee] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [info, setInfo] = useState([]);
    const [patientApp, setPatientApp] = useState([{ medicalId: '' }]);
    const navigate = useNavigate();

    useEffect(() => {
        const employee_Data = localStorage.getItem('employee');
        console.log('Retrieved employee data:', employee_Data); // Add this line for debugging
        if (employee_Data) {
            const parsedNurseInfo = JSON.parse(employee_Data);
            setEmployee(parsedNurseInfo);
            const fetchAllInfo = async () => {
                try {
                    const nurseId = parsedNurseInfo.employee_ID;
                    await handleViewAppointments(nurseId);
                    await handleViewPatients(nurseId);
                }
                catch (err) {
                    console.log(err)
                }
            };
            fetchAllInfo();
        }
    }, []);

    useEffect(() => {
        console.log("patients is", patients)
    }, [patients]);

    const handleViewAppointments = async (nurseId) => { //argument is directorId
        try {
            const res = await axios.get(`https://group8backend.azurewebsites.net/nurse_appointments/${nurseId}`);//request appointments that correspond to directorId
            const futureAppointments = res.data.filter(appointment => { //.filter filters data in res using below comparisons
                console.log("RES DATA IS...", typeof (res.data))
                console.log("RES DATA SAYS...", res.data)
                const appointmentDate = new Date(appointment.dateTime);
                const today = new Date();
                // console.log("the datetime being return by axios is... ", appointment.dateTime);
                // console.log("The date of the future appointment is...", appointmentDate.getTime())
                // console.log("todays date + 500 days in the future is...", today.getTime() + 500 * 60 * 60 * 1000)
                return ((appointmentDate.getTime() > today.getTime()))
            } //&& (appointmentDate.getTime() < today.getTime() + 500 * 60 * 60 * 1000))} //create date with appointment datetime, use > to compare to current date
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

    const handleViewPatients = async () => { //doctorId passed as argument
        try {
            const res = await axios.get(`https://group8backend.azurewebsites.net/view_all_patients/`); //request doctors_patient entries with doctor_ids
            setPatients(res.data); //update patients state with res
            console.log("patients returned: ", patients)
        } catch (err) {
            console.log('Error fetching patients:', err);
        }
    };

    const handleChange = (e) => {
        setPatientApp(prev => ({ ...prev, medicalId: e.target.value }));

    };

    const handleLogout = () => {
        localStorage.removeItem('employee'); // Clear employee info
        navigate('/'); // Navigate to the main page
    };


    if (!employee) {
        return <div>No employee information found.</div>;
    }

    return (
        <div className="grid-container">
            <div className="form">
                <h1>Employee Information</h1>
                <p>ID: {employee.employee_ID}</p>
                <p>Name: {employee.first_name} {employee.last_name}</p>
                <p>Role: {employee.role}</p>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>
            <div className="di_container di_appointments">
                <h2>Upcoming Appointments</h2>
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div
                            className="di_info-card"
                            key={appointment.appointment_ID}
                            onClick={() => navigate(`/appointment_info/${appointment.appointment_ID}`)}
                        >
                            <h3>{appointment.patientName}</h3>
                            <p>Doctor: {appointment.doctor}</p>
                            <p>Date: {new Date(appointment.dateTime).toLocaleString()}</p>
                            <p>Reason: {appointment.reason}</p>
                        </div>
                    ))
                ) : (
                    <p>No appointments currently set.</p>
                )}
            </div>
            <div className="di_container di_patients">
                <h2>Patients Overview</h2>
                {patients.length > 0 ? (
                    patients.map(patient => (
                        <div
                            className="di_info-card"
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
            <div className='d_container di_patients'>
                <h1>Create Appointment</h1>
                <input type="text" placeholder='patient_ID MXXXXXXXX' onChange={handleChange} name='patient_ID' />
                <button onClick={() => navigate(`/Nurse_Create_Appointment/${patientApp.medicalId}`)}> Create App for Patient</button>
            </div>
            <div className="di_container di_patients"
                onClick={() => navigate(`/Nurse_Create_New_Patient/${employee.employee_ID}`)}
            >
                <h2>Create New Patient</h2>

            </div>
        </div>
    );
};



export default Nurse_View;