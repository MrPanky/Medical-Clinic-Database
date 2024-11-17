import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './info_pages_style.css';

const Patient_Info = () => {
    const { id } = useParams(); // Get medical ID from URL
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/patient/${id}`);
                setPatient(response.data[0]); // Assuming you get an array
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatient();
    }, [id]);

    if (!patient) {
        return <div>Loading patient info...</div>;
    }

    return (
        <div className="di_patients info_container">
            <h2>Patient Information</h2>
            <div className="info_card">
                <p><strong>Medical ID:</strong> {patient.medical_ID}</p>
                <p><strong>Name:</strong> {patient.first_name} {patient.last_name}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Birthdate:</strong> {new Date(patient.birthdate).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {patient.address_line_1}, {patient.city}, {patient.state} {patient.zip}</p>
                <p><strong>Email:</strong> {patient.personal_email}</p>
                <p><strong>Phone:</strong> {patient.home_phone}</p>
                <p><strong>Emergency Contact:</strong> {patient.emergency_contact_info}</p>
                <p><strong>Height:</strong> {patient.height} cm</p>
                <p><strong>Weight:</strong> {patient.weight} kg</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>Allergies:</strong> {patient.medical_allergies}</p>

                <h3>Medical History</h3>
                <p><strong>Conditions:</strong> {patient.medical_conditions || 'None'}</p>
                <p><strong>Treatment:</strong> {patient.treatment || 'None'}</p>
                <p><strong>Medication:</strong> {patient.medication || 'None'}</p>
                <p><strong>Diagnosis Date:</strong> {patient.diagnosis_date ? new Date(patient.diagnosis_date).toLocaleDateString() : 'N/A'}</p>

                <h3>Family History</h3>
                <p><strong>Relation:</strong> {patient.relation || 'None'}</p>
                <p><strong>Family Conditions:</strong> {patient.family_conditions || 'None'}</p>
            </div>
        </div>
    );
};

export default Patient_Info;
