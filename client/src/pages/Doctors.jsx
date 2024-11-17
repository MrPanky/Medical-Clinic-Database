import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './style.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllDoctors();
  }, []); // This will run on component load and fetch doctors

  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:3000/doctors/${id}`);
        window.location.reload();
    } catch (error) { // Change 'err' to 'error' or use 'err' here.
        console.log(error); // Make sure to log the error variable
    }
};



  return (
    <div>
      <h1>Doctors:</h1>
      <div className="doctors">
        {doctors.map((doctor) => (
          <div className="doctor" key={doctor.employee_id}> {/* Make sure the key is unique */}
            <h2>{doctor.first_name} {doctor.last_name}</h2>
            <p>{doctor.specialty}</p>
            <p>{"Phone number: "}{doctor.phone_number}</p>
            <p>{"Work address: "}{doctor.work_address}</p>
            <button className="delete" onClick={()=>handleDelete(doctor.employee_ID)}>Delete</button>
            <button className="update"><Link to={`/update_doctor/${doctor.employee_ID}`} className="no-underline">Update</Link></button>
          </div>
        ))}
      </div>
      <button className="add">
        <Link to="/add_doctor" className="no-underline">Add Doctor</Link>
      </button>    </div>
  );
};

export default Doctors;
