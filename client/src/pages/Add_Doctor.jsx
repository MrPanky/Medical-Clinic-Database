import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const randomEmployeeID = () => { // generate a random employee id
    return Math.floor(Math.random() * 100000000);
};

const Add_Doctor = () => {
    const [doctor, setDoctor] = useState({
        first_name: "",
        last_name: "",
        employee_ID: "E" + randomEmployeeID(),
        specialty: "",
        phone_number: "",
        work_address: "",
        availabilityMon: "",
        availabilityTues: "",
        availabilityWed: "",
        availabilityThurs: "",
        availabilityFri: "",
        created: currentDate
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setDoctor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing

        try {
            await axios.post("http://localhost:3000/doctors", doctor); // Send doctor data to the backend
            navigate("/director_view"); // Navigate back to the Doctors page
        } catch (err) {
            console.log(err); // Log any errors
        }
    };

    return (
        <div className='form'>
            <h1>Add New Doctor</h1>
            <input type="text" placeholder="First Name" onChange={handleChange} name="first_name" />
            <input type="text" placeholder="Last Name" onChange={handleChange} name="last_name" />
            <input type="text" placeholder="Phone Number" onChange={handleChange} name="phone_number" />
            <input type="text" placeholder="Work Address" onChange={handleChange} name="work_address" />
            <select onChange={handleChange} name="specialty">
                <option value="" disabled selected>Select Specialty</option>
                <option value="General Practitioner">General Practitioner</option>
                <option value="Oncologist">Oncologist</option>
                <option value="Radiologist">Radiologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Obstetrician">Obstetrician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Immunologist">Immunologist</option>
            </select>

            {/* Dropdowns for Location Availability */}
            <h3>Location Availability</h3>
            {["Mon", "Tues", "Wed", "Thurs", "Fri"].map((day, index) => (
                <div key={index}>
                    <label>{day}:</label>
                    <select onChange={handleChange} name={`availability${day}`}>
                        <option value="" disabled selected>Select Location</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>
            ))}

            <button className="formButton" onClick={handleClick}>Submit</button>
        </div>
    );
};

export default Add_Doctor;
