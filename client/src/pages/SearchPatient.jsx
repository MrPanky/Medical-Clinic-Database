import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './billing_staff_invoice.css';


const SearchPatient = () => {
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [patientID, setpatientID] = useState('');
    let option = false;
    const choice = (localStorage.getItem('choice') === 'true');


    useEffect(() => {
        const employee_Data = localStorage.getItem('employee');
        console.log('Retrieved employee data:', employee_Data); // Add this line for debugging
        console.log(choice);
        if (employee_Data) {
            setEmployee(JSON.parse(employee_Data));
        }
    }, []);


    

    const handleLookUpChange = (e) => {
        setpatientID(e.target.value);
        setError(''); // Clear error on input change
        setStatus('');
    };

    const handleLogout = () => {
        localStorage.removeItem('choice');
        navigate('/Billing_Staff_View'); // Navigate to the main page
    };

    const searchpatientID = async (e) => {
        e.preventDefault();

        if(!patientID){
            setError("Please enter a valid patient ID"); // Show error if ID or password is empty
            setError('');
            return;
        }

        try{
            option = false;
            console.log(patientID);
            console.log(option);
            

            let res = await axios.post(`https://group8backend.azurewebsites.net/SearchPatient`, {patientID, option, choice}); 


            console.log(res.data);
            
            if (res.data.length  > 0) {
                localStorage.setItem('patient', JSON.stringify(res.data));
                setStatus("Success!!!");
                console.log ("patient: ", res.data);
                if(!choice){
                    navigate("/billing_staff_view/SearchPatient/See_Patient_Balance");
                    return;
                }else{
                    console.log("here");
                    navigate("/billing_staff_view/SearchPatient/See_Previous_Invoices");
                    return;
                }
            }else{
                option = true;
                console.log("here", option);
                res = await axios.post(`https://group8backend.azurewebsites.net/SearchPatient`, {patientID, option});
                console.log(res.data);
                if(res.data.length  > 0){
                    if(!choice){
                        console.log("Patient has no amount due");
                        setStatus("Patient has no amount due");
                        return;
                    }else{
                        console.log("Patient has no invoices");
                        setStatus("Patient has no invoices");
                        return;
                    }
                    
                }else{
                    // If no data, set error
                    console.log("Not found. Please try again.");
                    setError("Not found. Please try again.");
                    return;
                }
            } 
        } catch(err){
            console.log(err);
            setError("Not found");
        }
        
    };

    const displayMenu = () =>{
        console.log("inside display menu: ", choice);
        if(!choice){
            console.log("opt false");
            return "to Pay Invoices";
        }else{
            console.log("opt true");
            return "to View Previous Invoices";
        }

    }

    return(
        <div>
            <h1>Enter patient ID {displayMenu()}: </h1>
        <input 
                    type="text" 
                    placeholder="patient ID" 
                    onChange={handleLookUpChange} 
                    name="patientID" 
                    className={error ? 'input-error' : ''} 
                />
            <br />{error && <div style={{ color: 'red' }}>{error}</div>}
            {status && <div style={{ color: 'black' }}>{status}</div>}
            <br />
            <button className = 'invoiceoption' onClick={searchpatientID}>Search Patient</button>
            <br />
            <br />
                <button className = "logout" onClick={handleLogout}>Return</button>
            </div>
            
        
    )
};



export default SearchPatient;