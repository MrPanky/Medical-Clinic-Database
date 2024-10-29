import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientUpcomingAppointments.css'; // You can style this component separately

const PatientUpcomingAppointments = ({ medicalId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await axios.get(`https://group8backend.azurewebsites.net/patient/${medicalId}/appointments/upcoming_appointments`);
        console.log('response',response)
        setAppointments(response.data.appointments);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch upcoming appointments');
        setLoading(false);
      }
    };

    if (medicalId) {
      fetchUpcomingAppointments();
    }
  }, [medicalId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="upcoming-appointments">
      <h2>Upcoming Appointments</h2>
      <div className="cards-container">
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div className="card" key={index}>
              <h3>Appointment {index + 1}</h3>
              <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
              <p><strong>Doctor:</strong> {appointment.doctor}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Office:</strong> {appointment.name}</p>
              <p><strong>Address:</strong> {appointment.address}</p>
            </div>
          ))
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default PatientUpcomingAppointments;