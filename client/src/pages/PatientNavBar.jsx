import React, { useState } from 'react';
import './PatientNavBar.css';

const PatientNavbar = ({ activeTab, setActiveTab }) => {
  // State to manage the dropdown visibility for "My Account"
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [appointmentDropdownOpen, setAppointmentDropdownOpen] = useState(false);

  const toggleAccountDropdown = () => {
    setAppointmentDropdownOpen(false);
    setAccountDropdownOpen(!accountDropdownOpen);
  };
  const toggleAppointmentDropdown = () => {
    setAccountDropdownOpen(false);
    setAppointmentDropdownOpen(!appointmentDropdownOpen);
  };

 

  return (
    <nav className="patient-navbar">
      {/* Dashboard tab without submenu */}
      <button
        className={activeTab === 'dashboard' ? 'active' : ''}
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </button>

      {/* My Account tab with a dropdown */}
      <div className="dropdown">
        <button
          className={`dropdown-toggle ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('account'); // Set active tab to 'account'
            toggleAccountDropdown(); // Toggle the dropdown visibility
          }}
        >
          My Account
        </button>

        {/* Submenu for My Account */}
        {accountDropdownOpen  && activeTab === 'account' &&(
          <div className="dropdown-menu">
            <button
              className={activeTab === 'personal_info' ? 'active' : ''}
              onClick={() => {
                setActiveTab('personal_info')
                toggleAccountDropdown();
              }}
            >
              Personal Information
            </button>
            <button
              className={activeTab === 'password_change' ? 'active' : ''}
              onClick={() => {
                setActiveTab('password_change')
                toggleAccountDropdown();
              }}
            >
              Password Change
            </button>
          </div>
        )}
      </div>





      <div className="dropdown">
        <button
          className={`dropdown-toggle ${activeTab === 'appointment' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('appointment'); // Set active tab to 'account'
            toggleAppointmentDropdown(); // Toggle the dropdown visibility
          }}
        >
          Appointments
        </button>
          
        {/* Submenu for appointments */}
        {appointmentDropdownOpen && activeTab ==='appointment' &&(
          <div className="dropdown-menu">
            <button
              className={activeTab === 'upcoming_appointments' ? 'active' : ''}
              onClick={() => {
                setActiveTab('upcoming_appointments')
                toggleAppointmentDropdown()
              }}
            >
              Upcoming Appointments
            </button>
            <button
              className={activeTab === 'create_appointment' ? 'active' : ''}
              onClick={() => {
                setActiveTab('create_appointment')
                toggleAppointmentDropdown()
              }}
            >
              Create Appointment
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PatientNavbar;