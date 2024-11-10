import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,    // Register PointElement here
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,    // Register PointElement to avoid "point not registered" error
  Title,
  Tooltip,
  Legend
);

const Patient_Weight_Review = () => {
    const { patientId } = useParams(); // Get patient ID from URL
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get(`https://group8backend.azurewebsites.net/nurse_get_app_history/${patientId}`);
                console.log("API response:", res.data);

                const appointmentsArray = Array.isArray(res.data) ? res.data : Object.values(res.data);
                console.log("Appointments array:", appointmentsArray);

                const formattedAppointments = formatAppointments(appointmentsArray);
                console.log("Formatted appointments:", formattedAppointments);
                filterPreviousAppointments(formattedAppointments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
                setError('Error fetching appointment data');
                setLoading(false);
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
        setAppointments(previousAppointments);
    };

    if (loading) {
        return <div>Loading history...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (appointments.length === 0) {
        return <div>No appointments found for this patient.</div>;
    }

    // Prepare the chart data
    const chartData = {
        labels: appointments.map(appointment => appointment.parsedDateTime.toLocaleDateString()),
        datasets: [
            {
                label: 'Weight (lbs)',
                data: appointments.map(appointment => appointment.patientWeight),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight (lbs)',
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* First di_container for Appointment History */}
            <div className="di_container" style={{ flex: 1 }}>
                {appointments.length > 0 ? (
                    <>
                        <h2>Weight History</h2>
                        <h3>{appointments[0]?.patientName || "No Name Available"}</h3>
                        
                        {appointments.map(appointment => (
                            <div className="di_info-card" key={appointment.dateTime}>
                                <p>{appointment.parsedDateTime.toLocaleDateString()} {appointment.patientWeight} lbs</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>No Appointments Found.</p>
                )}
            </div>

            {/* Second di_container for the Chart */}
            <div className="os_chart-container" style={{ flex: 1, marginLeft: '20px' }}>
                <h3>Weight Chart</h3>
                <div style={{ height: '400px' }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Patient_Weight_Review;
