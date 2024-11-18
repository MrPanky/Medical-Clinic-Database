import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PatientCreateAppointment.css';

export default function PatientCreateAppointment({ medicalId, first_name, last_name, patientBillingId }) {
  const [doctors, setDoctors] = useState([]); // Stores a list of patient's associated doctors
  const [selectedDoctor, setSelectedDoctor] = useState(''); // Stores doctorsId
  const [selectedFacility, setSelectedFacility] = useState(''); // Stores the current office selected
  const [appointmentType, setAppointmentType] = useState(''); // Stores the appointment type
  const [reason, setReason] = useState(''); // Stores the reason for appointment
  const [date, setDate] = useState(''); // Stores the date chosen on the calendar
  const [isPickerEnabled, setIsPickerEnabled] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]); // Stores all available timeslots
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // Stores the selected timeslot
  const [unavailableDates, setUnavailableDates] = useState([]); // Stores fully booked days
  const [unavailableDays, setUnavailableDays] = useState([]); // Stores the days where the doctor doesn't work at that office
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // NEW: Tracks if the form is being submitted

  useEffect(() => {
    if (selectedDoctor && date && selectedFacility && selectedTimeSlot) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [selectedDoctor, date, selectedFacility, selectedTimeSlot]);

  // Fetch all doctors for the patient
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`https://group8backend.azurewebsites.net/patient/${medicalId}/appointments/doctors`);
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, [medicalId]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
        const response = await axios.get(`https://group8backend.azurewebsites.net/patient/appointments/time_slots`, {
          params: {
            date: formattedDate,
            doctorID: selectedDoctor,
            facility: selectedFacility,
          },
        });
        const allTimeSlots = [
          '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
          '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
        ];
        const availableTimeSlots = allTimeSlots.filter(
          (slot) => !response.data.timeSlots.includes(slot)
        );
        setTimeSlots(availableTimeSlots); // Update time slots based on response
      } catch (error) {
        console.error('Error fetching available time slots:', error);
      }
    };

    // Only run if all values are selected
    if (date && selectedDoctor && selectedFacility) {
      fetchAvailableTimeSlots();
    }
  }, [date, selectedDoctor, selectedFacility]);

  // Enable date only if doctor and facility are selected
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get('https://group8backend.azurewebsites.net/patient/appointment/availability', {
          params: {
            doctorID: selectedDoctor,
            officeID: selectedFacility,
          },
        });
        // Set the state with the unavailable dates and days
        setUnavailableDates(response.data.fullyBookedDates);
        setUnavailableDays(response.data.unavailableDays);
        setIsPickerEnabled(true);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setIsPickerEnabled(false);
      }
    };
    if (selectedDoctor && selectedFacility) {
      fetchAvailability();
    } else {
      setIsPickerEnabled(false);
    }
  }, [selectedDoctor, selectedFacility]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true); // Start loading to prevent spamming
    const defaultNurses = {
      North: { NurseId: 'E2345671', Name: 'John Doe' },
      South: { NurseId: 'E2345672', Name: 'Alice Johnson' },
      East: { NurseId: 'E2345673', Name: 'Michael Brown' },
      West: { NurseId: 'E2345674', Name: 'Emily Smith' },
    };
    const nurse = defaultNurses[selectedFacility];
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const fullName = `${first_name} ${last_name}`;
      const appointmentData = {
        patientName: fullName,
        doctorId: selectedDoctor,
        nurseId: nurse.NurseId,
        nurseName: nurse.Name,
        facility: selectedFacility,
        patientmedicalId: medicalId,
        appointmentType,
        reason,
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        patientBillingId: patientBillingId,
      };

      await axios.post(`https://group8backend.azurewebsites.net/patient/${medicalId}/appointments/create_appointment`, appointmentData);
      alert('Appointment created successfully');
      setSelectedDoctor('');
      setSelectedFacility('');
      setAppointmentType('');
      setReason('');
      setDate('');
      setTimeSlots([]);
      setSelectedTimeSlot('');
      setIsPickerEnabled(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.error); // Set custom error from backend
      } else {
        setErrorMessage('Failed to create appointment. Please try again.');
      }
    } finally {
      setIsLoading(false); // Stop loading after request completes
    }
  };

  const isDateSelectable = (date) => {
    const day = date.getDay();
    const isWeekday = day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
    const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    const isNotFullyBooked = !unavailableDates.includes(formattedDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const isNotUnavailableDay = !unavailableDays.includes(dayNames[day]);

    // The date must be a weekday, not fully booked, and not an unavailable day
    return isWeekday && isNotFullyBooked && isNotUnavailableDay;
  };

  return (
    <div className='appointment-form'>
      <h2>Create Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Doctor Dropdown */}
        <div className='form-group'>
          <label htmlFor="doctor">Provider (Doctor):</label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => {
              const selectedDoctorId = e.target.value;
              setSelectedDoctor(selectedDoctorId);

              // Find the selected doctor in the doctors array
              const selectedDoctorData = doctors.find(doctor => doctor.employee_ID === selectedDoctorId);

              // Set the appointment type based on the doctor's specialty
              if (selectedDoctorData) {
                setAppointmentType(selectedDoctorData.specialty);
              } else {
                setAppointmentType(''); // Reset if no doctor is selected
              }
            }}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor.employee_ID}>
                {doctor.first_name} {doctor.last_name} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Facility Dropdown */}
        <div className='form-group'>
          <label htmlFor="facility">Facility:</label>
          <select
            id="facility"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            <option value="">Select a Facility</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>

        {/* Appointment Type */}
        <div className='form-group'>
          <label htmlFor="appointmentType">Doctor Specialty:</label>
          <input
            type="text"
            id="appointmentType"
            value={appointmentType}
            placeholder="e.g., general practitioner"
            readOnly
          />
        </div>

        {/* Reason for Visit */}
        <div className="form-group">
          <label htmlFor="reason">Reason for Visit:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide the reason for your visit"
          />
        </div>

        {/* Date Picker */}
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            minDate={new Date()}
            filterDate={isDateSelectable}
            placeholderText="Select a date"
            disabled={!isPickerEnabled}
          />
        </div>

        {/* Time Slot Picker */}
        <div>
          <label htmlFor="timeSlot">Time Slot:</label>
          <select
            id="timeSlot"
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            disabled={!timeSlots.length || !date || !selectedDoctor || !selectedFacility}
          >
            <option value="">Select a Time Slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className='btn'
          disabled={isLoading || !isSubmitEnabled}
        >
          {isLoading ? 'Submitting...' : 'Create Appointment'}
        </button>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
