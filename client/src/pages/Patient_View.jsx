import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import './style.css';
import PatientNavBar from './PatientNavBar';
import PatientDashBoard from './PatientDashBoard';
import './Patient_View.css'
import PatientCreateAppointment from './PatientCreateAppointment';
import PatientUpcomingAppointment from './PatientUpcomingAppointments';

const Patient_View = () => {
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const patient_Data = localStorage.getItem('patient');
        console.log('Retrieved patient data:', patient_Data); // Add this line for debugging
        if (patient_Data) {
            setPatient(JSON.parse(patient_Data));
        }
        console.log('patient medicalID:',patient_Data)
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('patient'); // Clear patient info
        navigate('/'); // Navigate to the main page
    };


    if (!patient) {
        return <div>No patient information found.</div>;
    }
    
    const renderContent = () => {
        switch (activeTab) {
          case 'dashboard':
            return <PatientDashBoard medicalId={patient} />; // Pass medicalId as a prop
          case 'account':
            return <PatientDashBoard medicalId={patient} />;
          case 'appointment':
            return <PatientDashBoard medicalId={patient} />;
          case 'personal_info':
            return <div><h2>Personal Information</h2><p>Here you can view or edit your personal information.</p></div>;
          case 'password_change':
            return <div><h2>Password Change</h2><p>Change your password here.</p></div>;
          case 'create_appointment':
            return <PatientCreateAppointment medicalId={patient} />;
          case 'upcoming_appointments':
            return <PatientUpcomingAppointment medicalId={patient} />;
          default:
            return null;
        }}

    return (
        <>
        
          <PatientNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        
            <div className="content">
                {renderContent()}
            </div>
            

        </>
        
    );
};


export default Patient_View;