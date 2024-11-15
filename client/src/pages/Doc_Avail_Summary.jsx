import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Doc_Avail_Summary = () => {
    const { employeeId } = useParams(); // Get appointment ID from URL
    const [availability, setAvailability] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await axios.get(`https://group8backend.azurewebsites.net/doc_availability/${employeeId}`);
                setAvailability(res.data[0]); // Assuming you get an array
            } catch (error) {
                console.error('Error fetching availability data:', error);
            }
        };

        fetchAvailability();
    }, [employeeId]);//leave this empty because it only need run once?? honestly idk

    useEffect(() => {
        console.log("employeeId.employee_ID =", employeeId);
    }, [employeeId]);


    if (!availability) {
        return <div>Loading availability...</div>;
    }

    return (
        <div>
            <div className="doc_availability doc_info_container">
                <div className="doc_info_card">
                    <h2>Availability Information</h2>
                    <p><strong>Monday:</strong> {availability.availabilityMon}</p>
                    <p><strong>Tuesday:</strong> {availability.availabilityTues}</p>
                    <p><strong>Wednesday:</strong> {availability.availabilityWed}</p>
                    <p><strong>Thursday:</strong> {availability.availabilityThurs}</p>
                    <p><strong>Friday:</strong> {availability.availabilityFri}</p>
                </div>
                <button className="doc_logout"
                    onClick={()=>navigate(`/Doc_Edit_Availability/${employeeId}`)}> Edit Availability
                </button>
                <button className="doc_logout"
                    onClick={() => navigate('/Doctor_View')}>Home
                </button>
            </div>
        </div>
    );
};

export default Doc_Avail_Summary;

