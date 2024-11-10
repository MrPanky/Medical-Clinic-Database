import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Office_Staff.css';

const OfficeStaffView = () => {
  const [employee, setEmployee] = useState(null);
  const [patients, setPatients] = useState([]); // Store patients here
  const [medicalId, setMedicalId] = useState(''); // Store the entered medical ID
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const employeeData = localStorage.getItem('employee');
    if (employeeData) {
      setEmployee(JSON.parse(employeeData));
      fetchPatients();
    }
  }, []);

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get('https://group8backend.azurewebsites.net/patients'); // GET request to fetch patients
      setPatients(response.data); // Set patients in state
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employee');
    navigate('/');
  };

  const handlePatientClick = (medicalId) => {
    navigate(`/update_patient/${medicalId}`); // Navigate to the update patient page
  };

  const handleDeletePatient = async (medicalId) => {
    try {
      const response = await axios.delete(`https://group8backend.azurewebsites.net/patients/${medicalId}`);
      if (response.data.message) {
        // Filter out the deleted patient from the list
        setPatients(patients.filter(patient => patient.medical_ID !== medicalId));
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  // Handle the medical ID form submission
  const handleMedicalIdSubmit = (e) => {
    e.preventDefault();
    if (!medicalId.trim()) {
      setErrorMessage('Please enter a valid medical ID.');
    } else {
      setErrorMessage('');
      // Navigate to the appointment page with the medical ID
      navigate(`/Nurse_Create_Appointment/${medicalId}`);
    }
  };

  if (!employee) {
    return <div>No employee information found.</div>;
  }

  return (
    <div className="ofs-form">
      <div className="ofs-header">
        <h1>Office Staff Dashboard</h1>
        <button className="ofs-logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="ofs-container">
        {/* Create Patient and Appointment Section */}
        <div className="ofs-card">
          <h3>Create New Patient & Appointment</h3>
          <div className="ofs-inner-card">
            <h4>Create New Patient</h4>
            <p>Register a new patient in the system.</p>
            <button onClick={() => navigate('/add_patient')}>Create New Patient</button>
          </div>
          <div className="ofs-inner-card">
            <h4>Create Appointment</h4>
            <p>Schedule a new appointment for a patient.</p>
            <form onSubmit={handleMedicalIdSubmit}>
              <input
                type="text"
                placeholder="Enter Medical ID"
                value={medicalId}
                onChange={(e) => setMedicalId(e.target.value)}
                className="ofs-input"
              />
              <button type="submit" className="ofs-btn">Create Appointment</button>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
          </div>
        </div>

        {/* Update Password Section */}
        <div className="ofs-card">
          <h3>Update Employee & Patient Password</h3>
          <div className="ofs-inner-card">
            <h4>Update Employee Password</h4>
            <p>Update an employee's password for their account.</p>
            <button onClick={() => navigate('/update_employee_password')}>Update Employee Password</button>
          </div>
          <div className="ofs-inner-card">
            <h4>Update Patient Password</h4>
            <p>Update a patient's password for their account.</p>
            <button onClick={() => navigate('/update_patient_password')}>Update Patient Password</button>
          </div>
        </div>

        {/* Patient Info Section */}
        <div className="ofs-card">
          <h3>Update Patient Info</h3>
          <p>Edit existing patient information.</p>
          <div className="patient-list">
            <h4>Patients:</h4>
            {patients.length > 0 ? (
              patients.map(patient => (
                <div key={patient.medical_ID} className="ofs-patient-card">
                  <h4>{patient.first_name} {patient.last_name}</h4>
                  <p>Email: {patient.personal_email}</p>
                  <p>Phone: {patient.home_phone}</p>

                  {/* Buttons for Update and Delete */}
                  <div className="patient-buttons">
                  <button className="ofs-update" onClick={() => handlePatientClick(patient.medical_ID)}>Update</button>
                  <button className="ofs-delete" onClick={() => handleDeletePatient(patient.medical_ID)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No patients found.</p>
            )}
          </div>
        </div>

        {/* User Info Card */}
        <div className="ofs-card">
          <h3>User Info</h3>
          <div className="di_info-card">
            <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
            <p><strong>Employee ID:</strong> {employee.employee_ID}</p>
            <p><strong>Role:</strong> Office Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeStaffView;
