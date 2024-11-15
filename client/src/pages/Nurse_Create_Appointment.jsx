import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PatientCreateAppointment.css';
//DISABLE SUBMIT BUTTON WHEN APPOINTMENT IS CREATED

export default function Nurse_Create_Appointment() {
    const { medicalId } = useParams();
    const [doctors, setDoctors] = useState([]); //stores a list of patient's associated doctors
    const [selectedDoctor, setSelectedDoctor] = useState(''); // stores doctorsId
    const [selectedFacility, setSelectedFacility] = useState(''); //stores the current office selected
    const [appointmentType, setAppointmentType] = useState(''); //stores the appointment type
    const [reason, setReason] = useState(''); //stores the reason for appointment
    const [date, setDate] = useState(''); //stores the date chosen on the calender
    const [day, setDay] = useState(''); //ignore this
    const [isPickerEnabled, setIsPickerEnabled] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]) //stores all available timeslots
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); //stores the selected timeslot
    const [unavailableDates, setUnavailableDates] = useState([]); //stores fully booked days
    const [unavailableDays, setUnavailableDays] = useState([]); //stores the days where the doctor doesnt work at that office
    const [selectedDoctorID, setSelectedDoctorID] = useState(''); // ignore this line
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [patientName, setPatientName] = useState('');
    const [appCreated, setAppCreated] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedDoctor && date && selectedFacility && selectedTimeSlot) {
            setIsSubmitEnabled(true);
        }
        else {
            setIsSubmitEnabled(false);
        }

    }, [selectedDoctor, date, selectedFacility, selectedTimeSlot])
    // Fetch all doctors for the patient
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                console.log('first_medical_Id', medicalId)
                const response = await axios.get(`https://group8backend.azurewebsites.net/patient/${medicalId}/appointments/doctors`);
                console.log('reponse.data.doctors', response.data.doctors)
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
                console.log('selectedDoctor!!!!', formattedDate)
                const response = await axios.get(`https://group8backend.azurewebsites.net/patient/appointments/time_slots`, {
                    params: {
                        date: formattedDate,
                        doctorID: selectedDoctor,
                        facility: selectedFacility,
                    },

                });
                const allTimeSlots = [
                    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
                ];
                const availableTimeSlots = allTimeSlots.filter(
                    (slot) => !response.data.timeSlots.includes(slot)
                );
                console.log('timeslots:', availableTimeSlots)
                setTimeSlots(availableTimeSlots); // Update time slots based on response
            } catch (error) {
                console.error('Error fetching available time slots:', error);
            }
        };

        // Only run if all values are selected
        if (date && selectedDoctor && selectedFacility) {
            fetchAvailableTimeSlots();
        }
    }, [date, selectedDoctor, selectedFacility, medicalId]);



    // Enable date only if doctor and facility are selected
    useEffect(() => {
        const fetchAvailability = async () => {
            console.log('this is the line:', selectedDoctor)
            try {
                const response = await axios.get('https://group8backend.azurewebsites.net/patient/appointment/availability', {
                    params: {
                        doctorID: selectedDoctor,
                        officeID: selectedFacility
                    }
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

    useEffect(() => {
        if (selectedDoctor){
        const fetchAppType = async () => {
            try{
                //WRITE DOCTOR QUERY
                const doctorId = selectedDoctor
                console.log("doctorId be saying...", selectedDoctor)
                const res = await axios.get(`https://group8backend.azurewebsites.net/nurse_get_appointment_type/${selectedDoctor}`)
                console.log("res.data for appType is... ", res.data[0].specialty)
                const appType = res.data[0].specialty;
                setAppointmentType(appType);

            }
            catch (err){
                console.log("QUERY DID NOT WORK")
            }
        }
        fetchAppType();
    }
    }, [selectedDoctor]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        const defaultNurses = {
            "North": { NurseId: 'E2345671', Name: 'John Doe' },
            "South": { NurseId: 'E2345672', Name: 'Alice Johnson' },
            "East": { NurseId: 'E2345673', Name: 'Michael Brown' },
            "West": { NurseId: 'E2345674', Name: 'Emily Smith' }

        }
        const nurse = defaultNurses[selectedFacility]
        console.log('nurse', nurse)
        try {
            const res = await axios.get(`https://group8backend.azurewebsites.net/medical_get_patient_name/${medicalId}`)
            if (res.data && res.data[0]) {
                console.log("HELLO")
                console.log("the patients name returned is...", res.data)
                console.log("res data is..", res.data);
                const name = res.data[0].first_name + " " + res.data[0].last_name;
                console.log("first_name says...", name);
                setPatientName(name);
                console.log("patientName is...", patientName);
                const formattedDate = date.toISOString().split('T')[0];
                const appointmentData = {
                    patName: name,
                    doctorId: selectedDoctor,
                    nurseId: nurse.NurseId,
                    nurseName: nurse.Name,
                    facility: selectedFacility,
                    patientmedicalId: medicalId,
                    appointmentType,
                    reason,
                    date: formattedDate,
                    timeSlot: selectedTimeSlot
                };
                console.log('appointmentDate', appointmentData)
                console.log("HELLO")
                // You can post this data to the backend API
                await axios.post(`https://group8backend.azurewebsites.net/patient/${medicalId}/appointments/nurse_create_appointment`, appointmentData);
                alert('Appointment created successfully'); 
                //setAppCreated(true);
                setIsSubmitEnabled(false)
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.error); // Set custom error from backend
            } else {
                setErrorMessage('Failed to create appointment. Please try again.');
            }
            console.log('there was an error when creating an appointment')
        }
    };
    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
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
    // const handleClick = () => {
    //     if (appCreated) {
    //         setIsSubmitEnabled(false);
    //     }
    // }

    return (
        <div className='doc_appointment-form'>
            <h2>Create Appointment</h2>
            <form onSubmit={handleSubmit}>
                {/* Doctor Dropdown */}
                <div className='doc_form-group'>
                    <label htmlFor="doctor">Provider (Doctor):</label>
                    <select
                        id="doctor"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
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
                <div className='doc_form-group'>
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

                {/* Appointment Type
                <div className='doc_form-group'>
                    <label htmlFor="appointmentType">Appointment Type:</label>
                    <input
                        type="text"
                        id="appointmentType"
                        value={appointmentType}
                        onChange={(e) => setAppointmentType(e.target.value)}
                        placeholder="e.g., Check-up, Consultation"
                    />
                </div> */}

                {/* Reason for Visit */}
                <div className="doc_form-group">
                    <label htmlFor="reason">Reason for Visit:</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Provide the reason for your visit"
                    />
                </div>

                {/* Date Picker (enabled only if doctor and facility are selected) */}
                <div className="doc_form-group">
                    <label htmlFor="date">Date:</label>
                    {/*<input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={!isPickerEnabled}
          />*/}
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        // Disable unavailable dates
                        minDate={new Date()}
                        filterDate={isDateSelectable}
                        placeholderText="Select a date"
                        disabled={!isPickerEnabled}
                    />
                </div>

                {/* time Picker (enabled only if doctor and facility are selected) */}
                <div>
                    <label htmlFor="timeSlot">Time Slot:</label>
                    <select
                        id="timeSlot"
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        disabled={
                            !timeSlots.length || !date || !selectedDoctor || !selectedFacility
                        }
                    >
                        <option value="">Select a Time Slot</option>
                        {timeSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className='doc_btn' disabled={!isSubmitEnabled}>
                    Create Appointment 
                </button>
                {errorMessage && (
                    <div className="doc_error-message" style={{ color: 'red', marginTop: '10px' }}>
                        {errorMessage}
                    </div>
                )}
                <button
                    onClick={() => navigate('/Nurse_View')}>Home
            </button>
            </form>
        </div>
    );
}