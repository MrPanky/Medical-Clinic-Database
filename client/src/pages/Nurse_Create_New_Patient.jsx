import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';

const Nurse_Create_New_Patient = () => {
    const { employeeId } = useParams();
    const [patient, setPatient] = useState({
        medical_ID: "",
        billing_ID: "",
        first_name: "dude",
        last_name: "",
        age: null,
        birthdate: "",
        address_line_1: "Cuba",
        address_line_2: "",
        city: "",
        state: "",
        zip: "",
        personal_email: "",
        work_email: "",
        home_phone: "",
        work_phone: "",
        cell_phone: "",
        emergency_contact: "",
        is_child: 0,
        balance: 0,
        created: Date(),
        creatorID: employeeId,
        last_edited: Date(),
        last_editedID: employeeId
    })
    const [message, setMessage] = useState('');
    const [patCreated, setPatCreated] = useState(false)

    useEffect(() => {
        console.log('current nurse ID:', employeeId);
    }, [employeeId]);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setPatient(prev => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(e.target.name, e.target.value)
    };

    function generateRandomPatientId() {
        const digits = '0123456789';
        let id = 'M';

        // Generate 8 random characters
        for (let i = 0; i < 8; i++) {
            id += digits.charAt(Math.floor(Math.random() * digits.length));
        }

        return id;
    }

    function generateRandomBillingId() {
        const digits = '0123456789';
        let id = 'B';

        // Generate 8 random characters
        for (let i = 0; i < 8; i++) {
            id += digits.charAt(Math.floor(Math.random() * digits.length));
        }

        return id;
    }

    function generateMySqlDateTime(date) {
        const currentDateTime = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log("the date time being returned is... ", currentDateTime)
        return currentDateTime
    }
    function generateMysqlDate(date) {
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        console.log("the date time being returned is... ", `${year}-${month}-${day}`)
        return `${year}-${month}-${day}`;
    }

    const handleClick = async e => {
        e.preventDefault()
        try {
            console.log("the patients name is", patient.first_name);
            const now = new Date();
            const currentDateTime = generateMySqlDateTime(now)
            const currentMySqlDate = generateMysqlDate(now)
            const patientID = generateRandomPatientId();
            const billingId = generateRandomBillingId();
            //console.log("ON LINE 67 THE ORIGINATING DOCTORS ID IS", );
            const res = await axios.post(`https://group8backend.azurewebsites.net/nurse_create_patient/${employeeId}`, {
                medical_ID: patientID,
                billingID: billingId,
                first_name: patient.first_name,
                last_name: patient.last_name,
                birthdate: currentMySqlDate,
                address: patient.address_line_1,
                city: patient.city,
                state: patient.state,
                zip: patient.zip,
                email: patient.personal_email,
                home_phone: patient.home_phone,
                emergency_contact: patient.emergency_contact,
                date_created: currentDateTime,
                creator: patient.creatorID,
                last_edited: currentDateTime,
                last_editedID: patient.creatorID

            })
            const assignPatient = await axios.post(`https://group8backend.azurewebsites.net/nurse_assign_new_patient/${patientID}`);
            console.log(res.data);
            setMessage(res.data);
            if (res.data === 'patient created')
            {
                setPatCreated(true)
            }
            //navigate("/")
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className='doc_form'>
            <h1>Create New Patient</h1>
            <input type="text" placeholder='First Name' onChange={handleChange} name='first_name' />
            <input type="text" placeholder='Last Name' onChange={handleChange} name='last_name' />
            <input type="text" placeholder='Birth Date YYYY/MM/DD' onChange={handleChange} name='birthdate' />
            <input type="text" placeholder='Address' onChange={handleChange} name='address_line_1' />
            <input type="text" placeholder='City' onChange={handleChange} name='city' />
            <input type="text" placeholder='State' onChange={handleChange} name='state' />
            <input type="text" placeholder='Postal Code' onChange={handleChange} name='zip' />
            <input type="text" placeholder='Primary Email' onChange={handleChange} name='personal_email' />
            <input type="text" placeholder='Primary Phone' onChange={handleChange} name='home_phone' />
            <input type="text" placeholder='Emergency Contact' onChange={handleChange} name='emergency_contact' />
            <button className={`doc_referralButton ${patCreated ? 'selected' : ''}`} 
            disabled={patCreated}
            onClick={handleClick}>
                Submit</button>
            <button
                    onClick={() => navigate('/Nurse_View')}>Home
            </button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Nurse_Create_New_Patient;