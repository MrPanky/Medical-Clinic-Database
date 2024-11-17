import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ChartData, 
    ScatterDataPoint,
    CategoryScale,
    LinearScale,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, PointElement);


const Past_Due_Patients = () => {
    const [patients, setPatients] = useState([]);
    const [officeData, setOfficeData] = useState([]);
    const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
    const navigate = useNavigate();
    const [lineChartData, setLineChartData] = useState({});


    
    useEffect(() => {
        fetchPatientStatistics();
    }, [filterDateRange]);

    const fetchPatientStatistics = async () =>{
        if (!filterDateRange.start || !filterDateRange.end) {
            console.error('Start date and end date must be provided.');
            return;
        }

        try {
            const res = await axios.post(`https://group8backend.azurewebsites.net/Past_Due_Patients`, {
                params: {
                    startDate: filterDateRange.start,
                    endDate: filterDateRange.end,
                },
            });

            setPatients(res.data);
            console.log("past due patient data:",res.data);
            prepareLineChartData(res.data);
        } catch (error) {
            console.error('Error fetching patient statistics:', error);
        }
    }

    const colors = [
        'rgba(75, 192, 192, 0.6)', 
        'rgba(255, 99, 132, 0.6)', 
        'rgba(255, 206, 86, 0.6)', 
        'rgba(54, 162, 235, 0.6)', 
        'rgba(153, 102, 255, 0.6)', 
        'rgba(255, 159, 64, 0.6)', 
    ];

    const prepareLineChartData = (data) => {
        const labels = data.map((item) => new Date(item.appointmentDateTime).toLocaleDateString(
            'en-US', { month: 'short', day: 'numeric', year: 'numeric'}
        ));
        const amountDue = data.map((item) => item.amountDue);

        setLineChartData({
            labels,
            datasets: [
                {
                    label: 'Total Debt',
                    data: amountDue,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 0.6)',
                    borderWidth: 2,
                    pointBorderColor:'rgba(75, 192, 192, 0.6)',
                    spanGaps : true,
                    fill : false
                },
            ],
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('Past_Due_Patients'); // Clear employee info
        navigate('/Billing_Staff_View'); // Navigate to the main page
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';  

        const localDateString = dateString.replace('Z', '');
        const dateObj = new Date(localDateString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        let formattedHour = hours % 12;
        formattedHour = formattedHour === 0 ? 12 : formattedHour;  
        const period = hours >= 12 ? 'PM' : 'AM';

        return `${month}/${day}/${year.toString().slice(-2)} ${formattedHour}:${minutes} ${period}`;
    };

    const today = new Date().toISOString().split('T')[0];

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
                    text: 'Total Amount Due', }, },}
    
    }
    

    return (
        <div>
            <h1>Due Invoices Report</h1>

            <div className="Report-container">
                    <div className="Report-left">
                        <label className="os_label">
                            <h3 className="os_h3">Start Date</h3>
                            <input className="os_input-date" type="date" onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })} />
                        </label>
                        <label className="os_label">
                            <h3 className="os_h3">End Date</h3>
                            <input className="os_input-date" type="date" onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })} />
                        </label>
                        <button className="add" onClick={fetchPatientStatistics}>Filter</button>
                    </div>
                    <div className="Report-right">
                        {lineChartData.labels && lineChartData.labels.length > 0 ? (
                            <Line data={lineChartData} options = {chartOptions} />
                        ) : (
                            <p>No data available for the selected filters.</p>
                        )}
                </div>
            </div>

                


            
            <br />

            <table  className='invoicetable'>
                <thead className='invoicetable-cell'>
                    <tr>
                        <th>Patient ID</th>
                        <th>Patient Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Unpaid invoice creation</th>
                        <th>amount Due</th>
                    </tr>
                </thead>
                <tbody className='invoicetable-cell'>
                    {patients.map((patient) => (
                        <tr key = {patient.appointmentDateTime}>
                            <td>{patient.patientBillingID}</td>
                            <td>{patient.patient_name}</td>
                            <td>{patient.personal_email}</td>
                            <td>{patient.home_phone}</td>
                            <td>{formatDate(patient.appointmentDateTime)}</td>
                            <td>$ {patient.amountDue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button className = "logout" onClick={handleLogout}>Return</button>


        </div>
    );


    
};



export default Past_Due_Patients;