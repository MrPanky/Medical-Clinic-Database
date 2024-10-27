import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const randomEmployeeID = () => { // generate a random employee id
    return Math.floor(Math.random() * 100000000);
  }
const Add_Doctor = () => {
  const [doctor, setDoctor] = useState({
    first_name: "",
    last_name: "",
    employee_ID: "E" + randomEmployeeID(),
    specialty: "",
    phone_number: "",
    work_address: "",
    availabilityMon: "all day",
    availabilityTues: "all day",
    availabilityWed: "all day",
    availabilityThurs: "all day",
    availabilityFri: "all day",
    created: currentDate
  });

  const navigate = useNavigate();

  
  const handleChange = (e) => {
    setDoctor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    try {
      await axios.post("https://group8backend.azurewebsites.net/doctors", doctor); // Send doctor data to the backend
      navigate("/"); // Navigate back to the Doctors page ("/")
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
      <select  onChange={handleChange} name="specialty">
      <option value="" disabled selected>Select Specialty</option>
        <option value="General Practioner">General Practitioner</option>
        <option value="Oncologist">Oncologist</option>
        <option value="Radiologist">Radiologist</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Obstetrician">Obstetrician</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Gastroenterologist">Gastroenterologist</option>
        <option value="Immunologist">Immunologist</option>
      </select>
      <button className="formButton" onClick={handleClick}>Submit</button>
    </div>
  );
};

export default Add_Doctor;
