import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './director_view_style.css';

const Director_View = () => {
    const [employee, setEmployee] = useState(null);
    const [info, setInfo] = useState([]); // Doctors
    const [patients, setPatients] = useState([]);
    const [staff, setStaff] = useState([]); // Office and Billing Staff
    const [appointments, setAppointments] = useState([]); 
    const [officeId, setOfficeId] = useState(null); 
    const [profit, setProfit] = useState(0); // New state for profit

    const navigate = useNavigate();

    useEffect(() => {
        const employeeData = localStorage.getItem('employee');
        if (employeeData) {
            const parsedEmployeeData = JSON.parse(employeeData);
            setEmployee(parsedEmployeeData);

            const fetchAllInfo = async () => {
                try {
                    const res = await axios.get(`http://localhost:3000/director_view/${parsedEmployeeData.employee_ID}`);
                    setInfo(res.data);
                    const fetchedOfficeId = await fetchDirectorOfficeId(parsedEmployeeData.employee_ID);
                    setOfficeId(fetchedOfficeId); 

                    await handleViewAppointments(parsedEmployeeData.employee_ID);
                    
                    if (res.data.length > 0) {
                        const firstDoctorId = res.data[0].employee_ID;
                        await handleViewPatients(firstDoctorId);
                    }
                } catch (err) {
                    console.log(err);
                }
            };
            fetchAllInfo();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('employee');
        navigate('/');
    };

    const fetchDirectorOfficeId = async (directorId) => {
        try {
            const response = await axios.get(`http://localhost:3000/director_office/${directorId}`);
            return response.data.officeId;
        } catch (error) {
            console.error('Error fetching director office ID:', error);
            throw error;
        }
    };

    const handleViewPatients = async (doctorId) => {
        try {
            const res = await axios.get(`http://localhost:3000/doctors_patient/${doctorId}`);
            setPatients(res.data);
        } catch (err) {
            console.log('Error fetching patients:', err);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/staff_management`);
            setStaff(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProfit = async (appointmentIds) => {
        try {
            const res = await axios.get(`http://localhost:3000/profit`, {
                params: { appointmentIds }
            });
            setProfit(res.data.profit);
        } catch (err) {
            console.log('Error fetching profit:', err);
        }
    };

    const handleViewAppointments = async (directorId) => {
        try {
            const res = await axios.get(`http://localhost:3000/appointments/${directorId}`);
            const futureAppointments = res.data.filter(appointment => 
                new Date(appointment.dateTime) > new Date()
            );

            setAppointments(futureAppointments);
            const appointmentIdsList = res.data.map(appointment => appointment.appointment_ID).join(',');

            const appointmentIds = futureAppointments.map(appointment => appointment.appointment_ID);
            await fetchProfit(appointmentIdsList);
        } catch (err) {
            console.log('Error fetching appointments:', err);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleDeleteDoctor = async (employeeId) => {
        try {
            await axios.delete(`http://localhost:3000/doctors/${employeeId}`);
            setInfo(info.filter(doctor => doctor.employee_ID !== employeeId));
        } catch (err) {
            console.error('Error deleting doctor:', err);
        }
    };

    const handleDeleteStaff = async (employeeId) => {
        try {
            const member = staff.find(member => member.employee_ID === employeeId);
            if (member) {
                if (member.role === 'OfficeStaff') {
                    await axios.delete(`http://localhost:3000/staff/officestaff/${employeeId}`);
                } else if (member.role === 'BillingStaff') {
                    await axios.delete(`http://localhost:3000/staff/billingstaff/${employeeId}`);
                }
                setStaff(staff.filter(member => member.employee_ID !== employeeId));
            }
        } catch (err) {
            console.error('Error deleting staff member:', err);
        }
    };

    if (!employee) {
        return <div>No employee information found.</div>;
    }

    return (
        <div className="di_dashboard">
            <div className="di_header">
                Medical Director Dashboard - Hello {employee.first_name}!
                <button className="logout" onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
            </div>

            <div className="di_container di_appointments">
                <h2>Upcoming Appointments</h2>
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div 
                            className="di_info-card" 
                            key={appointment.appointment_ID}
                            onClick={() => navigate(`/appointment_info/${appointment.appointment_ID}`)}
                        >
                            <h3>{appointment.patientName}</h3>
                            <p>Doctor: {appointment.doctor}</p>
                            <p>Date: {new Date(appointment.dateTime).toLocaleString()}</p>
                            <p>Reason: {appointment.reason}</p>
                        </div>
                    ))
                ) : (
                    <p>No future appointments found for this office.</p>
                )}
            </div>

            <div className="di_container di_reports">
                <h2>Total Profit Report</h2>
                <div className="di_info-card">
                    <p><strong> ${profit.toFixed(2)} </strong></p> 
                    <button className="view-stats" onClick={() => navigate('/director_view/office_statistics')}>View Office Statistics</button>
                </div>
            </div>

            <div className="di_container di_settings">
                <h2>User Info</h2>
                <div className="di_info-card">
                    <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
                    <p><strong>Employee ID:</strong> {employee.employee_ID}</p>
                    <p><strong>Office:</strong> {officeId}</p>
                    <p><strong>Role:</strong> {employee.role}</p>
                </div>
            </div>

            <div className="di_container di_staff">
                <h2>Staff Management</h2>
                <button className="add" onClick={() => navigate('/add_staff')}>Add Staff</button>
                {staff.length > 0 ? (
                    staff.map(member => (
                        <div 
                            className="di_info-card" 
                            key={member.employee_ID}
                        >
                            <h3>{member.first_name} {member.last_name}</h3>
                            <p>Role: {member.role.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <button className onClick={() => handleDeleteStaff(member.employee_ID)} className="delete">Delete</button>
                            <button className = "update" onClick={() => {
                                if (member.role === 'OfficeStaff') {
                                    navigate(`/update_OfficeStaff/${member.employee_ID}`);
                                } else if (member.role === 'BillingStaff') {
                                    navigate(`/update_BillingStaff/${member.employee_ID}`);
                                }
                            }}>Edit</button>
                        </div>
                    ))
                ) : (
                    <p>No staff found.</p>
                )}
            </div>

            <div className="di_container di_patients">
                <h2>Patients Overview</h2>
                {patients.length > 0 ? (
                    patients.map(patient => (
                        <div 
                            className="di_info-card" 
                            key={patient.medical_ID}
                            onClick={() => navigate(`/patient_info/${patient.medical_ID}`)}
                        >
                            <h3>{patient.first_name} {patient.last_name}</h3>
                            <p>Phone: {patient.home_phone}</p>
                            <p>Email: {patient.personal_email}</p>
                        </div>
                    ))
                ) : (
                    <p>No patients found for this doctor.</p>
                )}
            </div>
            
            <div className="di_container di_doctors">
                <h2>Doctors Overview</h2>
                <button className="add" onClick={() => navigate('/add_doctor')}>Add Doctor</button>
                {info.length > 0 ? (
                    info.map(doctor => (
                        <div 
                            className="di_info-card" 
                            key={doctor.employee_ID}
                        >
                            <h3>{doctor.first_name} {doctor.last_name}</h3>
                            <p>Specialty: {doctor.specialty}</p>
                            <p>Office: {doctor.office_name}</p>
                            <button className="delete" classNameonClick={() => handleDeleteDoctor(doctor.employee_ID)} className="delete">Delete</button>
                            <button className="update" onClick={() => navigate(`/update_doctor/${doctor.employee_ID}`)}>Edit</button>
                        </div>
                    ))
                ) : (
                    <p>No doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default Director_View;
