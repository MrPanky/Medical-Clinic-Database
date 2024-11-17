import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Appointment_Info = () => {
    const { appointmentId } = useParams(); // Get appointment ID from URL
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get(`https://group8backend.azurewebsites.net/appointment/${appointmentId}`);
                setAppointment(response.data[0]); // Assuming you get an array
            } catch (error) {
                console.error('Error fetching appointment data:', error);
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    if (!appointment) {
        return <div>Loading appointment info...</div>;
    }

    return (
        <div>
            <div className="di_appointments info_container">
                <div className="info_card">
                    <h2>Appointment Information</h2>
                    <p><strong>Appointment ID:</strong> {appointment.appointment_ID}</p>
                    <p><strong>Patient Name:</strong> {appointment.patientName}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor}</p>
                    <p><strong>Nurse:</strong> {appointment.nurse}</p>
                    <p><strong>Date and Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    <p><strong>Treatments:</strong> {appointment.treatments || 'None'}</p>
                    <p><strong>Diagnoses:</strong> {appointment.diagnoses || 'None'}</p>
                    <p><strong>Allergies:</strong> {appointment.allergies || 'None'}</p>
                    <p><strong>Patient Weight:</strong> {appointment.patientWeight} kg</p>
                    <p><strong>Blood Pressure:</strong> {appointment.patientBP}</p>
                    <p><strong>Heart Rate:</strong> {appointment.patientHR} bpm</p>
                </div>
            </div>
        </div>
    );
};

export default Appointment_Info;
