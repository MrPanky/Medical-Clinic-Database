import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './info_pages_style.css';

const Referral_Info = () => {
    const { referralId } = useParams(); // Get referral ID from URL (passed by navigate command in Doctor_View)
    const [referral, setReferral] = useState([null]);
    const [message, setMessage] = useState('');
    const [patientName, setPatientName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchReferral = async () => {
            try {
                //console.log(useParams())
                const response = await axios.get(`https://group8backend.azurewebsites.net/view_specific_referral/${referralId}`);
                setReferral(response.data[0]); // Assuming you get an array
            } catch (error) {
                console.error('Error fetching referral data:', error);
            }
        };
        
        fetchReferral();
    }, [referralId]);

    useEffect(() => {
        const fetchPatientName = async() => {
            try {
                console.log("behold! referral.patient_ID is currently", referral.patient_ID)
                const response = await axios.get(`https://group8backend.azurewebsites.net/medical_get_patient_name/${referral.patient_ID}`);
                console.log("the patient name we have retrieved is...", response.data[0])
                const patName = response.data[0].first_name + " " + response.data[0].last_name;
                console.log("the patientName const is...", patName);
                setPatientName(patName);
            }
            catch(error) {
                console.error("could not find patient name")
            }
        }
        fetchPatientName();
    }, [referral]);

    useEffect(() => {
        console.log("This referral is: ", referral)
    }, [referral]);
    useEffect(() => {
        console.log("This referral ID: ", referralId)
    }, [referralId]);


    if (!referral) {
        return <div>Loading referral info...</div>;
    }
    const acceptReferral = async e => {
        e.preventDefault()
        try {
            const res = await axios.put(`https://group8backend.azurewebsites.net/accept_referral/${referralId}`, {

            });
            console.log("hi from referral_info", res.data);
            setMessage(res.data);
            setMessage("BLARG");
            const blarg = message;
            console.log("The message is....", message)
            navigate('/Doctor_View');
            //navigate("/")
        } catch (err) {
            console.log(err)
            setMessage('patient already assigned to current doctor, please reject referral')
        }

    }
    const rejectReferral = async e => {
        e.preventDefault()
        try {
            const res = await axios.put(`https://group8backend.azurewebsites.net/reject_referral/${referralId}`, {

            });
            console.log(res.data);
            setMessage(res.data);
            navigate('/Doctor_View');
            //navigate("/")
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className="doc_referral doc_info_container">
            <h2>Referral Summary</h2>
            <div className="doc_info_card">
                <p><strong>Patient Name:</strong> {patientName} {referral.patient_ID}</p>
                <p><strong>Patient Phone:</strong> {referral.patient_contact_info}</p>
                <p><strong>Referring Doctor:</strong> {referral.originating_doctor_contact_info} {referral.originating_doctor_ID}</p>
                <p><strong>Reason:</strong> {referral.reason}</p>
                <p><strong>Referral Created:</strong> {referral.date_created}</p>
                <p><strong>Status:</strong> {referral.status}</p>
            </div>
            <button onClick={acceptReferral}>Accept Referral</button>
            <button onClick={rejectReferral}>Reject Referral</button>
            <button onClick= {() => navigate('/Doctor_View')}>Return home</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Referral_Info;