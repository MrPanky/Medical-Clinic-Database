import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './info_pages_style.css';

const Referral_Info = () => {
    const { referralId } = useParams(); // Get referral ID from URL (passed by navigate command in Doctor_View)
    const [referral, setReferral] = useState([null]);

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
            console.log(res);
            //navigate("/")
        } catch (err) {
            console.log(err)
        }

    }
    const rejectReferral = async e => {
        e.preventDefault()
        try {
            const res = await axios.put(`https://group8backend.azurewebsites.net/reject_referral/${referralId}`, {

            });
            console.log(res);
            //navigate("/")
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className="doc_referral doc_info_container">
            <h2>Referral Summary</h2>
            <div className="doc_info_card">
                <p><strong>Patient Name:</strong> {referral.patient_contact_info} {referral.patient_ID}</p>
                <p><strong>Referring Doctor:</strong> {referral.originating_doctor_contact_info} {referral.originating_doctor_ID}</p>
                <p><strong>Reason:</strong> {referral.reason}</p>
                <p><strong>Referral Created:</strong> {referral.date_created}</p>
                <p><strong>Status:</strong> {referral.status}</p>
            </div>
            <button onClick={acceptReferral}>Accept Referral</button>
            <button onClick={rejectReferral}>Reject Referral</button>
        </div>
    );
};

export default Referral_Info;