import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Format the date properly for MySQL DATETIME format
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

const UpdatePatient = () => {
  const [patient, setPatient] = useState({
    first_name: "",
    last_name: "",
    age: "",
    birthdate: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip: "",
    personal_email: "",
    home_phone: "",
    emergency_contact_info: "",
    height: "",
    weight: "",
    sex: "",
    allergies: "",
    updated: currentDate, // Timestamp for when the update happens
  });
  const [loading, setLoading] = useState(true); // Track loading state

  const navigate = useNavigate();
  const location = useLocation();
  const medical_ID = location.pathname.split("/")[2]; // Extract medical ID from URL

  // Fetch the current patient's details when the component mounts
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`https://group8backend.azurewebsites.net/patient/${medical_ID}`);
        setPatient(response.data[0]); // Assuming the response is an array with a single patient object
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchPatient();
  }, [medical_ID]);

  const handleChange = (e) => {
    setPatient((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      await axios.put(`https://group8backend.azurewebsites.net/patient/${medical_ID}`, patient); // Update patient data
      navigate("/office_staff"); // Redirect to the Office Staff Dashboard after update
    } catch (err) {
      console.error(err); // Log any errors
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <div className="form">
      <h1>Update Patient Information</h1>
      <div className="form-column">
        {/* First Column */}
        <div className="column">
          <input
            type="text"
            placeholder="First Name"
            value={patient.first_name}
            onChange={handleChange}
            name="first_name"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={patient.last_name}
            onChange={handleChange}
            name="last_name"
          />
          <input
            type="number"
            placeholder="Age"
            value={patient.age}
            onChange={handleChange}
            name="age"
          />
          <input
            type="date"
            placeholder="Birthdate"
            value={patient.birthdate}
            onChange={handleChange}
            name="birthdate"
          />
          <input
            type="text"
            placeholder="Address Line 1"
            value={patient.address_line_1}
            onChange={handleChange}
            name="address_line_1"
          />
          <input
            type="text"
            placeholder="Address Line 2"
            value={patient.address_line_2}
            onChange={handleChange}
            name="address_line_2"
          />
        </div>

        {/* Second Column */}
        <div className="column">
          <input
            type="text"
            placeholder="City"
            value={patient.city}
            onChange={handleChange}
            name="city"
          />
          <input
            type="text"
            placeholder="State"
            value={patient.state}
            onChange={handleChange}
            name="state"
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={patient.zip}
            onChange={handleChange}
            name="zip"
          />
          <input
            type="email"
            placeholder="Email"
            value={patient.personal_email}
            onChange={handleChange}
            name="personal_email"
          />
          <input
            type="text"
            placeholder="Phone"
            value={patient.home_phone}
            onChange={handleChange}
            name="home_phone"
          />
          <input
            type="text"
            placeholder="Emergency Contact Info"
            value={patient.emergency_contact_info}
            onChange={handleChange}
            name="emergency_contact_info"
          />
        </div>
      </div>

      <div className="form-column">
        {/* Third Column */}
        <div className="column">
          <input
            type="number"
            placeholder="Height (cm)"
            value={patient.height}
            onChange={handleChange}
            name="height"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={patient.weight}
            onChange={handleChange}
            name="weight"
          />
        </div>

        {/* Fourth Column */}
        <div className="column">
          <input
            type="text"
            placeholder="Allergies"
            value={patient.allergies}
            onChange={handleChange}
            name="allergies"
          />
          <select
            value={patient.sex}
            onChange={handleChange}
            name="sex"
          >
            <option value="" disabled>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
      </div>
      <button className="formButton" onClick={handleClick}>Submit</button>
    </div>
  );
};

export default UpdatePatient;
