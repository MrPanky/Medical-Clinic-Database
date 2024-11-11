import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';

const Create_Referral = () => {
    const { employeeId } = useParams();
    const [referral, setReferral] = useState({
        created: Date(),
        creatorID: employeeId,
        date_created: Date(),
        date_reviewed: "",
        last_edited: Date(),
        last_editedID: "",
        originating_doctor_contact_info: "",
        originating_doctor_ID: employeeId,
        patient_contact_info: "",
        patient_ID: "",
        reason: "",
        receiving_doctor_contact_info: "",
        receiving_doctor_ID: "",
        referral_ID: "",
        status: "not reviewed"
    })


    useEffect(() => {
        const fetchLastName = async () => {
            try {
                console.log("fetch last name is being called");
                const res = await axios.get(`https://group8backend.azurewebsites.net/doctor_Lname/${employeeId}`);
                console.log("res.last name is...: ", res.data[0].last_name)
                setReferral(prevReferral => ({
                    ...prevReferral, // Spread in previous values
                    originating_doctor_contact_info: res.data[0].last_name // Update only this field
                }));
            } catch (err) {
                console.log(err);
            }
        }
        fetchLastName();
    }, [employeeId]);

    useEffect(() => {
        console.log('Referral info:', referral);
    }, [referral]);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setReferral(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function generateRandomId() {
        const digits = '0123456789';
        let id = 'R';

        // Generate 8 random characters
        for (let i = 0; i < 8; i++) {
            id += digits.charAt(Math.floor(Math.random() * digits.length));
        }

        return id;
    }

    const handleClick = async e => {
        e.preventDefault()
        try {
            const now = new Date();
            const isoString = now.toISOString();
            const mysqlDateTime = isoString.slice(0, 19).replace('T', ' ');
            const ID = generateRandomId();
            console.log("ON LINE 67 THE ORIGINATING DOCTORS ID IS", referral.originating_doctor_ID);
            const res = await axios.post(`https://group8backend.azurewebsites.net/create_referral/${employeeId}`, {
                created: mysqlDateTime,
                creatorID: referral.creatorID,
                date_created: mysqlDateTime,
                date_reviewed: referral.date_reviewed,
                last_edited: referral.last_edited,
                last_editedID: referral.last_editedID,
                originating_doctor_contact_info: referral.originating_doctor_contact_info,
                originating_doctor_ID: referral.originating_doctor_ID,
                patient_contact_info: referral.patient_contact_info,
                patient_ID: referral.patient_ID,
                reason: referral.reason,
                receiving_doctor_contact_info: referral.receiving_doctor_contact_info,
                receiving_doctor_ID: referral.receiving_doctor_ID,
                referral_ID: ID,
                status: referral.status

            });
            console.log(res);
            //navigate("/")
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className='doc_form'>
            <h1>Create New Referral</h1>
            <input type="text" placeholder='patient_ID MXXXXXXXX' onChange={handleChange} name='patient_ID' />
            <input type="text" placeholder='patient name' onChange={handleChange} name='patient_contact_info' />
            <input type="text" placeholder='doctor_ID EXXXXXXXX' onChange={handleChange} name='receiving_doctor_ID' />
            <input type="text" placeholder='reason' onChange={handleChange} name='reason' />
            <button onClick={handleClick}>Submit</button>
        </div>
    )
}

export default Create_Referral;