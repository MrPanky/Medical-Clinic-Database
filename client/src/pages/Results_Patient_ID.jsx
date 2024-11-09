import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './billing_staff_invoice.css';

const Results_Patient_ID = () => {
    const navigate = useNavigate();

    const [resultpatient, setresultpatient] = useState('');
    const [searchentry, setsearchentry] = useState('');

    useEffect(() => {
        const results_Data = localStorage.getItem('resulting-patients');
        setsearchentry(localStorage.getItem('search-entry'));
        if (results_Data) {
            setresultpatient(JSON.parse(results_Data));
            console.log('Retrieved patients data:', resultpatient); // Add this line for debugging
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('resulting-patients'); // Clear patients info
        localStorage.removeItem('search-entry');
        navigate('/Billing_Staff_View/Search_Patient_ID'); // Navigate to the main page
    };

    const getDate = (birthdate) =>{
        let bdate = new Date(birthdate);

        let formattedDate = `${bdate.getMonth() + 1}/${bdate.getDate()}/${bdate.getFullYear()}`;
        return formattedDate;

    }

    try{
        return(
            <div>
                <h1>Results for given name: {searchentry}</h1>
            <div className='invoiceList'>
              <table className='invoicetable'>
                <thead>
                 <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Birthdate</th>
                    <th>adress</th>
                    <th>email</th>
                    <th>phone</th>
                 </tr>
                </thead>
                <tbody>
                    {resultpatient.map((row) =>(
                            <tr key ={row.medical_ID}>
                            <td>{row.medical_ID}</td>
                            <td>{row.first_name} {row.last_name}</td>
                            <td>{getDate(row.birthdate)}</td>
                            <td>{row.address_line_1}</td>
                            <td>{row.personal_email}</td>
                            <td>{row.home_phone}</td>
                            </tr>
                        ))}
                </tbody>
            </table>

            </div>
            <br />
            <button className = "logout" onClick={handleLogout}>Return</button>


            </div>
        );

    }catch{
        console.log("catched");
    }
    

};



export default Results_Patient_ID;



