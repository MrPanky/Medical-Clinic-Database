import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Update_Employee_Password = () => {
  const [employeeID, setEmployeeID] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/employee/password/${employeeID}`,
        { newPassword }
      );
      setMessage(response.data.message);

      setTimeout(() => {
        navigate('/office_staff_view');
      }, 2000); // Redirect after a short delay to show the message

    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating password');
    }
  };

  return (
    <div className="form">
      <h1>Update Employee Password</h1>
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeID}
        onChange={(e) => setEmployeeID(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button className="formButton" onClick={handleSubmit}>Update Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Update_Employee_Password;
