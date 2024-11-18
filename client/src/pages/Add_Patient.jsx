import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const randomMedicalID = () => { 
  // Generate a random medical ID that starts with 'M' and has a total of 9 characters
  const randomNumber = Math.floor(Math.random() * 100000000);
  return `M${randomNumber.toString().padStart(8, '0')}`;
};

const Add_Patient = () => {
    const [patient, setPatient] = useState({
        first_name: "",
        last_name: "",
        birthdate: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        zip: "",
        personal_email: "",
        home_phone: "",
        emergency_contact_info: "",
        created: currentDate,
        medical_ID: randomMedicalID(),
        password: 'Patient',  // Default password for the patient
        doctor_ID: "E1234578"  // Default doctor ID
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setPatient((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing

        try {
            // Send the patient data to the backend
            await axios.post("https://group8backend.azurewebsites.net/patients", patient);

            // Redirect to a different page after successful submission
            navigate("/office_staff_view"); // You can change the path accordingly

        } catch (err) {
            console.log(err); // Log any errors for debugging
        }
    };

    return (
        <div className='form'>
            <h1>Add New Patient</h1>
            <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" />
            <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" />
            <input type="date" placeholder="Birthdate" onChange={handleChange} name="birthdate" />
            <input type="text" placeholder="Address Line 1" onChange={handleChange} name="address_line_1" />
            <input type="text" placeholder="Address Line 2" onChange={handleChange} name="address_line_2" />
            <input type="text" placeholder="City" onChange={handleChange} name="city" />
            <input type="text" placeholder="State" onChange={handleChange} name="state" />
            <input type="text" placeholder="Zip Code" onChange={handleChange} name="zip" />
            <input type="email" placeholder="Personal Email" onChange={handleChange} name="personal_email" />
            <input type="text" placeholder="Home Phone" onChange={handleChange} name="home_phone" />
            <textarea placeholder="Emergency Contact Info" onChange={handleChange} name="emergency_contact_info"></textarea>

            <button className="formButton" onClick={handleClick}>Submit</button>
        </div>
    );
};

export default Add_Patient;
