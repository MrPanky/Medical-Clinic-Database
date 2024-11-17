import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const Login = () => {
    const [ID, setID] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleIDChange = (e) => {
        setID(e.target.value);
        setError(''); // Clear error on input change
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(''); // Clear error on input change
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (!ID || !password) {
            setError("Please enter both ID and password."); // Show error if ID or password is empty
            return;
        }

        try {
            const res = await axios.post(`http://localhost:3000/login`, { ID, password });

            // Check if employee or patient data is found
            if (res.data && !res.data.message) {
                const firstLetter = ID.charAt(0); // Get the first letter

                if (firstLetter === 'E') {
                    localStorage.setItem('employee', JSON.stringify(res.data));
                    console.log('Stored employee data:', res.data);

                    // Redirect based on employee role
                    switch(res.data.role) {
                        case 'Doctor': 
                            navigate("/doctor_view");
                            break;
                        case 'Nurse': 
                            navigate("/nurse_view");
                            break;
                        case 'BillingStaff':
                            navigate("/billing_staff_view");
                            break;
                        case 'OfficeStaff':
                            navigate("/office_staff_view");
                            break; 
                        case 'Director':
                            navigate("/director_view");
                            break;   
                        default:
                            console.log("Invalid employee role");
                    }
                    
                } else if (firstLetter === 'M') {  
                    localStorage.setItem('patient', JSON.stringify(res.data));
                    console.log('Stored patient data:', res.data);
                    navigate("/patient_view");
                }
            } else {
                // If no data, set error
                setError(res.data.message || "Invalid ID or password. Please try again.");
            }
        } catch (err) {
            // Handle error when ID is not found
            setError("Invalid ID or password. Please try again.");
        }
    };


    return (
        <div>
            <h1>Login:</h1>
            <div className="form">
                <input 
                    type="text" 
                    placeholder="ID" 
                    onChange={handleIDChange} 
                    name="ID" 
                    className={error ? 'input-error' : ''} 
                />
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Password" 
                    onChange={handlePasswordChange} 
                    name="password" 
                    className={error ? 'input-error' : ''} 
                />
                <label className="show-password">
    <               input type="checkbox" checked={showPassword} onChange={togglePasswordVisibility} className="checkbox" />
                    Show Password
                </label>

                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button className="formButton" onClick={handleClick}>Login</button>
            </div>
        </div>
    );
};

export default Login;


