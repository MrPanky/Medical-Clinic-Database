import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registering the necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const today = new Date().toISOString().split('T')[0];

const Patient_Weight_Review = () => {
    const { patientId } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Adding date filters if provided
                const queryParams = {};
                if (startDate) queryParams.startDate = startDate;
                if (endDate) queryParams.endDate = endDate;

                const res = await axios.get(`http://localhost:3000/nurse_get_app_history/${patientId}`, {
                    params: queryParams
                });

                console.log("API response:", res.data); // Log the API response to inspect the structure

                // Convert the response data into an array if it's not already
                const appointmentsArray = Array.isArray(res.data) ? res.data : Object.values(res.data);
                
                // Format the appointments for easier date handling
                const formattedAppointments = formatAppointments(appointmentsArray);

                // Sort appointments by date (oldest to newest)
                formattedAppointments.sort((a, b) => a.parsedDateTime - b.parsedDateTime);

                // Filter previous appointments (appointments before today)
                filterPreviousAppointments(formattedAppointments);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
                setError('Error fetching appointment data');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId, startDate, endDate]);

    // Format the appointments (parse the date)
    const formatAppointments = (appointments) =>
        appointments.map(appointment => ({
            ...appointment,
            parsedDateTime: new Date(appointment.dateTime)
        }));

    // Filter previous appointments (only appointments before today)
    const filterPreviousAppointments = (formattedAppointments) => {
        const today = new Date();
        const previousAppointments = formattedAppointments.filter(appointment => {
            const appointmentDate = appointment.parsedDateTime;
            return appointmentDate < today;
        });
        setAppointments(previousAppointments);
    };

    // Check loading and error state
    if (loading) {
        return <div>Loading history...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (appointments.length === 0) {
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="di_container" style={{ flex: 1 }}>
            <h2>Weight History</h2>
            <h3>{appointments[0]?.patientName || "No Name Available"}</h3>

            {/* Date Filter Inputs */}
            <div style={{ marginBottom: '20px' }}>
                <label>Start Date:</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    max={today}
                />
                <label>End Date:</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    max={today}
                />
            </div>

            {/* Display Appointment History */}
            {appointments.map(appointment => (
                <div className="di_info-card" key={appointment.dateTime}>
                    <h2>No Appointments found</h2>
                </div>
            ))}
        </div>

        <div className="os_chart-container" style={{ flex: 1, marginLeft: '20px' }}>
            <h3>Weight Chart</h3>
            <div style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    </div>

    }

    // Log the appointments to ensure correct data
    console.log("Appointments to display in chart:", appointments);

    // Prepare the chart data with treatments included in the labels
    const chartData = {
        labels: appointments.map(appointment => {
            // Combine date and treatment in the label
            const treatment = appointment.treatments || "No treatment";
            return `${appointment.parsedDateTime.toLocaleDateString()} - ${treatment}`;
        }),
        datasets: [
            {
                label: 'Weight (lbs)',
                data: appointments.map(appointment => appointment.patientWeight), // Correctly passing weight as data
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date and Treatment',
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight (lbs)',
                },
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="di_container" style={{ flex: 1 }}>
                <h2>Weight History</h2>
                <h3>{appointments[0]?.patientName || "No Name Available"}</h3>

                {/* Date Filter Inputs */}
                <div style={{ marginBottom: '20px' }}>
                    <label>Start Date:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                    <label>End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </div>

                {/* Display Appointment History */}
                {appointments.map(appointment => (
                    <div className="di_info-card" key={appointment.dateTime}>
                        <p>{appointment.parsedDateTime.toLocaleDateString()} - {appointment.patientWeight} lbs</p>
                        <p>Treatment: {appointment.treatments || "No treatment"}</p>
                    </div>
                ))}
            </div>

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
