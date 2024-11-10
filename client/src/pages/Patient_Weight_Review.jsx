


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Patient_Weight_Review = () => {
    const { patientId } = useParams(); // Get appointment ID from URL
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get(`https://group8backend.azurewebsites.net/nurse_get_app_history/${patientId}`);
                console.log("Response type:", typeof res.data);

                // Convert to array if `res.data` is an object of objects
                const appointmentsArray = Array.isArray(res.data) ? res.data : Object.values(res.data);

                // Format and filter appointments
                const formattedAppointments = formatAppointments(appointmentsArray);
                console.log("Formatted appointments:", formattedAppointments);
                filterPreviousAppointments(formattedAppointments);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
            }
        };

        fetchAppointments();
    }, [patientId]);

    const formatAppointments = (appointments) =>
        appointments.map(appointment => ({
            ...appointment,
            parsedDateTime: new Date(appointment.dateTime)
        }));

    const filterPreviousAppointments = (formattedAppointments) => {
        const today = new Date();
        const previousAppointments = formattedAppointments.filter(appointment => {
            const appointmentDate = appointment.parsedDateTime;
            return appointmentDate < today;
        });

        console.log("Filtered previous appointments:", previousAppointments);
        setAppointments(previousAppointments); // Update state with filtered list
    };

    if (!appointments) {
        return <div>Loading history...</div>;
    }

    return (
        <div className="di_container">
            {appointments.length > 0 ? (
                <>
                    <h2>Weight History</h2>
                    <h3>{appointments[0]?.patientName || "No Name Available"}</h3>
                    {appointments.map(appointment => (
                        <div className="di_info-card" key={appointment.dateTime}>
                            <p>{appointment.parsedDateTime.toLocaleDateString()}            {appointment.patientWeight} lbs</p>
                        </div>
                    ))}
                </>
            ) : (
                <p>No Appointments Found.</p>
            )}
        </div>
    );
};

export default Patient_Weight_Review;