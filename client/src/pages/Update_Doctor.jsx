import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const Update_Doctor = () => {
  const [doctor, setDoctor] = useState({
    first_name: "",
    last_name: "",
    specialty: "",
    phone_number: "",
    work_address: "",
    created: currentDate
  });
  const [loading, setLoading] = useState(true); // Track loading state

  const navigate = useNavigate();
  const location = useLocation();
  const employee_ID = location.pathname.split("/")[2]; // Extract employee ID from URL

  // Fetch the current doctor's details when the component mounts
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`https://group8backend.azurewebsites.net/doctors/${employee_ID}`);
        setDoctor(response.data); // Update state with doctor data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchDoctor();
  }, [employee_ID]);

  const handleChange = (e) => {
    setDoctor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      await axios.put(`https://group8backend.azurewebsites.net/doctors/${employee_ID}`, doctor); // Update doctor data
      navigate("/"); // Redirect to the Doctors page
    } catch (err) {
      console.error(err); // Log any errors
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <div className='form'>
      <h1>Update Doctor</h1>
      <input
        type="text"
        placeholder="First Name"
        value={doctor.first_name}
        onChange={handleChange}
        name="first_name"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={doctor.last_name}
        onChange={handleChange}
        name="last_name"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={doctor.phone_number}
        onChange={handleChange}
        name="phone_number"
      />
      <input
        type="text"
        placeholder="Work Address"
        value={doctor.work_address}
        onChange={handleChange}
        name="work_address"
      />
      <select
        value={doctor.specialty}
        onChange={handleChange}
        name="specialty"
      >
        <option value="" disabled>Select Specialty</option>
        <option value="General Practitioner">General Practitioner</option>
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

export default Update_Doctor;
