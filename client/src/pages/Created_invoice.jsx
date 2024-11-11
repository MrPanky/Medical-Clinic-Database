import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/redcross.png';
import './billing_staff_invoice.css';


const Created_invoice = () => {

    const navigate = useNavigate();
    const [appointment, setAppointment] = useState('');
    const choice = (localStorage.getItem('choice') === 'true');

    
    
    const [office, setOffice] = useState('');


    useEffect(() => {
        const app_Data = localStorage.getItem('single_appointment');
        console.log('Retrieved appointment data:', app_Data);
        if (app_Data) {
            setAppointment(JSON.parse(app_Data));
        }
        const off_Data = localStorage.getItem('office_loc');
        if (off_Data) {
            setOffice(JSON.parse(off_Data)[0]);
            console.log('Retrieved office data:', JSON.parse(off_Data)[0]);
        }
        
    }, []);

    const handlePrint = () => {
        window.print();
    }

    const handleButtonClick = () => {
        const userConfirmed = window.confirm('Are you sure you want to proceed');
    
        if (userConfirmed) {
          // The user clicked "OK"
          return true;
        } else {
          // The user clicked "Cancel"
          return false;

        }
    };

    const getDate = (date) =>{
        let bdate = new Date(date);

        let formattedDate = `${bdate.getMonth() + 1}/${bdate.getDate()}/${bdate.getFullYear()}`;
        return formattedDate;

    }

    const handleLogout = async () => {

        if(!choice){
            if(!handleButtonClick()){
                return;
            }
        }

        

        localStorage.removeItem('single_appointment'); // Clear appointment info
        localStorage.removeItem('office_loc');
        
        

       
        if(!choice){
            localStorage.removeItem('patient');
            const patientID = appointment.patientBillingID;
            
            const res = await axios.post(`https://group8backend.azurewebsites.net/SearchPatient`, {patientID});
            console.log("new app data: ", JSON.stringify(res.data)); 
            localStorage.setItem('patient', JSON.stringify(res.data));
            navigate('/Billing_Staff_View/SearchPatient/See_Patient_Balance');
            return;
    
        }
        navigate('/Billing_Staff_View/SearchPatient/See_Previous_Invoices');
       
    };

    
    return (
        <div className='invoice'>
            <div style={{ textAlign: 'left' }}>


                <h1 className='invoiceContainer'>
                        <img src={logo} alt="redcross logo" className='invoiceImage' style={{ width: '200px', height: '150px' }}/>
                        <div className='invoiceText'>
                            <br /> Hospital
                            <br />{office.name} Location
                            <br />{office.address} 
                        </div>
                                       
                </h1>
            
            
            
            <br />Issue date (MM/DD/YYYY): {getDate(appointment.created)}
            <h2>Invoice To:</h2>
            {appointment.patientName}
            <br />{appointment.address_line_1} {appointment.address_line_2}
            <br />{appointment.city}, {appointment.state} {appointment.zip}
            <h4>Status: <span style = {{color : 'green'}}>PAID</span></h4>
            
            Appointment ID: {appointment.appointment_ID}
            </div>
            
            <table className='invoicetable'>
                <thead>
                    <tr className='invoiceth'>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='invoicetd'>
                        <td>{appointment.appointment_type} appointment
                            <div className= "invoiceTab">
                            Doctor: {appointment.doctor}
                            <br /> Nurse: {appointment.nurse}
                            <br /> Date: {getDate(appointment.appointmentDateTime)}
                            </div>
                            
                        </td>
                        <td>1</td>
                        <td> $ {appointment.amountCharged}</td>
                    </tr>
                    
                </tbody>
            </table>
            <h4 style={{ textAlign: 'right' }} >Total $ {appointment.amountCharged}</h4>
            <br /><button onClick={handleLogout}>Return</button> <button onClick={handlePrint}>Print This Page</button>
        </div>
    );
};



export default Created_invoice;