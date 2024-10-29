import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientPersonalInfo.css';

export default function PatientPersonalInfo({ medicalId }) {
    const [patientInfo, setPatientInfo] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                console.log('loooook',medicalId)
                const response = await axios.get(`https://group8backend.azurewebsites.net/patient/${medicalId}/my_account/personal_information`);
                setPatientInfo(response.data);
            } catch (err) {
                console.error('Error fetching patient information:', err);
                setError('Failed to fetch patient information. Please try again.');
            }
        };

        if (medicalId) {
            fetchPatientInfo();
        }
    }, [medicalId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!patientInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="patient-personal-info">
            <h2>Personal Information</h2>
            <div className="section">
                <label>Name:</label>
                <input type="text" value={`${patientInfo.first_name} ${patientInfo.last_name}`} readOnly />
                <label>Date of Birth:</label>
                <input type="text" value={patientInfo.birthdate} readOnly />
                <label>Age:</label>
                <input type="text" value={patientInfo.age} readOnly />
            </div>

            <div className="section">
                <h3>Address Details</h3>
                <label>Address 1:</label>
                <input type="text" value={patientInfo.address.line_1} readOnly />
                <label>Address 2:</label>
                <input type="text" value={patientInfo.address.line_2 || ''} readOnly />
                <label>City:</label>
                <input type="text" value={patientInfo.address.city} readOnly />
                <label>State:</label>
                <input type="text" value={patientInfo.address.state} readOnly />
                <label>Zip:</label>
                <input type="text" value={patientInfo.address.zip} readOnly />
            </div>

            <div className="section">
                <h3>Contact Details</h3>
                <label>Personal Email:</label>
                <input type="text" value={patientInfo.contact.personal_email} readOnly />
                <label>Home Phone:</label>
                <input type="text" value={patientInfo.contact.home_phone} readOnly />
                <label>Work Phone:</label>
                <input type="text" value={patientInfo.contact.work_phone || ''} readOnly />
                <label>Cell Phone:</label>
                <input type="text" value={patientInfo.contact.cell_phone} readOnly />
            </div>
        </div>
    );
}
