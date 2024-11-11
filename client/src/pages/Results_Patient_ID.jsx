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

    const getPhone = (index) =>{
        if(resultpatient[index].home_phone != null){
            return resultpatient[index].home_phone;
        }else if(resultpatient[index].cell_phone != null){
            return resultpatient[index].cell_phone;
        }else{
            return resultpatient[index].work_phone;
        }
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
                    <th>Adress</th>
                    <th>Email</th>
                    <th>Phone</th>
                 </tr>
                </thead>
                <tbody>
                    {resultpatient.map((row, index) =>(
                            <tr key ={row.medical_ID}>
                            <td>{row.billingID}</td>
                            <td>{row.first_name} {row.last_name}</td>
                            <td>{getDate(row.birthdate)}</td>
                            <td>{row.address_line_1}</td>
                            <td>{row.personal_email}</td>
                            <td>{getPhone(index)}</td>
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

