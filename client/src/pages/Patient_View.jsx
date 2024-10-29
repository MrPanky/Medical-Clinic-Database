import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PatientNavBar from './PatientNavBar';
import PatientDashBoard from './PatientDashBoard';
import './Patient_View.css'
import PatientCreateAppointment from './PatientCreateAppointment';
import PatientUpcomingAppointment from './PatientUpcomingAppointments';
import PatientPersonalInfo from './PatientPersonalInfo';
import PatientReferrals from './PatientReferrals';
import PatientLabTests from './PatientLabTests';
import PatientMedicalHistory from './PatientMedicalHistory';

const Patient_View = () => {
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const patient_Data = localStorage.getItem('patient');
        // Add this line for debugging
        if (patient_Data) {
            setPatient(JSON.parse(patient_Data).medical_ID);
            console.log('retrieve patient data:', patient)
        }
       
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
          // case 'dashboard':
          //   return <PatientDashBoard medicalId={patient} />; // Pass medicalId as a prop
          // case 'account':
          //   return <PatientDashBoard medicalId={patient} />;
          // case 'appointment':
          //   return <PatientDashBoard medicalId={patient} />;
          // case 'medical_records':
          //   return <PatientDashBoard medicalId={patient} />;
          case 'personal_info':
            return <PatientPersonalInfo medicalId={patient}/>;
          case 'password_change':
            return <h1>password_change</h1>
          case 'create_appointment':
            return <PatientCreateAppointment medicalId={patient} />;
          case 'upcoming_appointments':
            return <PatientUpcomingAppointment medicalId={patient} />;
          case 'medical_history':
            return <PatientMedicalHistory medicalId={patient} />;
          case 'referrals':
            return <PatientReferrals medicalId={patient} />
          case 'lab_tests':
            return <PatientLabTests medicalId={patient} />
          default:
            return <PatientDashBoard medicalId={patient} />;
        }}

    return (
        <div className="PatientView">
          <PatientNavBar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
        
        <div className="content">
            {renderContent()}
        </div>
        

        </div>
        
        
    );
};


export default Patient_View;