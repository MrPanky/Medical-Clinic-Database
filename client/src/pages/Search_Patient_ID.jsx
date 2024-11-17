import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './billing_staff_invoice.css';

const Search_Patient_ID = () => {

    const navigate = useNavigate();
    const [patientFirstName, setpatientFirstName] = useState('');
    const [patientLastName, setpatientLastName] = useState('');
    const [error, setError] = useState('');
    const [results, setResults] = useState('');

    const handleLogout = () => {
        navigate('/Billing_Staff_View'); // Navigate to the main page
    };

    const handleFnameChange = (e) => {
        setpatientFirstName(e.target.value);
        setError(''); // Clear error on input change
    };

    const handleLnameChange = (e) => {
        setpatientLastName(e.target.value);
        setError(''); // Clear error on input change
    };

    const SearchPatient = async (e) => {
        e.preventDefault();
        let query = `SELECT billingID, billingID, first_name, last_name, birthdate, address_line_1, address_line_2, city, state, zip, personal_email, home_phone, work_phone, cell_phone FROM patient WHERE first_name = '`+patientFirstName+`' AND last_name = '`+patientLastName+`';`;
        let res = await axios.post(`http://localhost:3000/Search_Patient_ID`, {query});
        console.log("patient results:",res.data);
        if(res.data.length === 0){
           setError("No patient exists with the given name");
           return;
        }
        localStorage.setItem("resulting-patients", JSON.stringify(res.data));
        localStorage.setItem("search-entry", patientFirstName+" "+patientLastName);

        navigate("/billing_staff_view/Search_Patient_ID/Results_Patient_ID");

        
    }


    return(
        <div>

            <h1>Enter Patient Name</h1>
            <br />
            First name:
            <input 
                    type="text" 
                    placeholder="patient first name" 
                    onChange={handleFnameChange} 
                    name="patientname" 
                    className={error ? 'input-error' : ''} 
                />
            <br />
            Last name:
            <input 
                    type="text" 
                    placeholder="patient last name" 
                    onChange={handleLnameChange} 
                    name="patientLname" 
                    className={error ? 'input-error' : ''} 
                />
                
           
                <br />
                <br />{error && <div style={{ color: 'red' }}>{error}</div>}



                <button className = 'invoiceoption' onClick={SearchPatient}>Search Patient</button>
                <br />
                <br />
                <button className = "logout" onClick={handleLogout}>Return</button>


        </div>

    )

}

export default Search_Patient_ID;