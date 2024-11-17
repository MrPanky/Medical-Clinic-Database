import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Doc_Edit_Availability = () => {
    const { employeeId } = useParams(); // Get appointment ID from URL
    const [weeklyAvailability, setWeeklyAvailability] = useState([]);
    const [monAvailability, setMonAvailability] = useState([]);
    const [tuesAvailability, setTuesAvailability] = useState([]);
    const [wedAvailability, setWedAvailability] = useState([]);
    const [thursAvailability, setThursAvailability] = useState([]);
    const [friAvailability, setFriAvailability] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await axios.get(`https://group8backend.azurewebsites.net/doc_availability/${employeeId}`);
                setWeeklyAvailability(res.data[0]); // Assuming you get an array

                //await handleMonAvailability(weeklyAvailability.monAvailability)

            } catch (error) {
                console.error('Error fetching availability data:', error);
            }
        };
        fetchAvailability();
    }, [employeeId]);//leave this empty because it only need run once?? honestly idk

    useEffect(() => {
        console.log("monday avialability is now ...", monAvailability)
    }, [monAvailability]);


    // const handleMonAvailability = async (monAvailability) => {
    //     try {
    //         setMonAvailability(monAvailability);
    //         // await axios.put(`https://group8backend.azurewebsites.net/update_doc_availability/${employeeId}`, {
    //         //     monAvailability: monAvailability
    //         // });
    //         console.log("availability updated");

    //     } catch (err) {
    //         console.log('could not set availability', err);
    //     }
    // }
    // const handleTuesAvailability = async (tuesAvailability) => {
    //     try {
    //         setTuesAvailability(tuesAvailability);
    //         // await axios.put(`https://group8backend.azurewebsites.net/update_doc_availability/${employeeId}`, {
    //         //     tuesAvailability: tuesAvailability
    //         // });
    //         console.log("availability updated");

    //     } catch (err) {
    //         console.log('could not set availability', err);
    //     }
    // }
    // const handleWedAvailability = async (wedAvailability) => {
    //     try {
    //         setWedAvailability(wedAvailability);
    //         // await axios.put(`https://group8backend.azurewebsites.net/update_doc_availability/${employeeId}`, {
    //         //     tuesAvailability: tuesAvailability
    //         // });
    //         console.log("availability updated");

    //     } catch (err) {
    //         console.log('could not set availability', err);
    //     }
    // }
    // const handleThursAvailability = async (thursAvailability) => {
    //     try {
    //         setThursAvailability(thursAvailability);
    //         // await axios.put(`https://group8backend.azurewebsites.net/update_doc_availability/${employeeId}`, {
    //         //     tuesAvailability: tuesAvailability
    //         // });
    //         console.log("availability updated");

    //     } catch (err) {
    //         console.log('could not set availability', err);
    //     }
    // }
    // const handleFriAvailability = async (friAvailability) => {
    //     try {
    //         setFriAvailability(friAvailability);
    //         // await axios.put(`https://group8backend.azurewebsites.net/update_doc_availability/${employeeId}`, {
    //         //     tuesAvailability: tuesAvailability
    //         // });
    //         console.log("availability updated");

    //     } catch (err) {
    //         console.log('could not set availability', err);
    //     }
    // }
    const pushUpdatedAvailability = async () => { //async(monAvailability, tuesAvailability, wedAvailability, thursAvailability, friAvailability) => {
        try {
            // monAvailability = [monAvailability]
            // tuesAvailability = [tuesAvailability]
            // wedAvailabiilty = [wedAvailability]
            // thursAvailability = [thursAvailability]
            // friAvailability = [friAvailability]

            await axios.put(`https://group8backend.azurewebsites.net/update_doc_availability/${employeeId}`, {
                monAvailability: monAvailability,
                tuesAvailability: tuesAvailability,
                wedAvailability: wedAvailability,
                thursAvailability: thursAvailability,
                friAvailability: friAvailability
            });
            navigate(`/Doc_Avail_Summary/${employeeId}`);
        }
        catch (err) {
            console.log('could not change availability', err);
        }
    }
    return (
        <div className="doc_avail">
            <h1>Monday</h1>
            <button className={`doc_updateAvail ${monAvailability === 'morning' ? 'selected' : ''}`}
                onClick={() => setMonAvailability('morning')}> Morning </button>
            <button className={`doc_updateAvail ${monAvailability === 'afternoon' ? 'selected' : ''}`}
                onClick={() => setMonAvailability('afternoon')}> Afternoon </button>
            <button className={`doc_updateAvail ${monAvailability === 'all day' ? 'selected' : ''}`}
                onClick={() => setMonAvailability('all day')}> All day </button>
            <button className={`doc_updateAvail ${monAvailability === 'not available' ? 'selected' : ''}`}
                onClick={() => setMonAvailability('not available')}> Not Available </button>
            <h1>Tuesday</h1>
            <button className={`doc_updateAvail ${tuesAvailability === 'morning' ? 'selected' : ''}`}
                onClick={() => setTuesAvailability('morning')}> Morning </button>
            <button className={`doc_updateAvail ${tuesAvailability === 'afternoon' ? 'selected' : ''}`}
                onClick={() => setTuesAvailability('afternoon')}> Afternoon </button>
            <button className={`doc_updateAvail ${tuesAvailability === 'all day' ? 'selected' : ''}`}
                onClick={() => setTuesAvailability('all day')}> All day </button>
            <button className={`doc_updateAvail ${tuesAvailability === 'not available' ? 'selected' : ''}`}
                onClick={() => setTuesAvailability('not available')}> Not Available </button>
            <h1>Wednesday</h1>
            <button className={`doc_updateAvail ${wedAvailability === 'morning' ? 'selected' : ''}`}
                onClick={() => setWedAvailability('morning')}> Morning </button>
            <button className={`doc_updateAvail ${wedAvailability === 'afternoon' ? 'selected' : ''}`}
                onClick={() => setWedAvailability('afternoon')}> Afternoon </button>
            <button className={`doc_updateAvail ${wedAvailability === 'all day' ? 'selected' : ''}`}
                onClick={() => setWedAvailability('all day')}> All day </button>
            <button className={`doc_updateAvail ${wedAvailability === 'not available' ? 'selected' : ''}`}
                onClick={() => setWedAvailability('not available')}> Not Available </button>
            <h1>Thursday</h1>
            <button className={`doc_updateAvail ${thursAvailability === 'morning' ? 'selected' : ''}`}
                onClick={() => setThursAvailability('morning')}> Morning </button>
            <button className={`doc_updateAvail ${thursAvailability === 'afternoon' ? 'selected' : ''}`}
                onClick={() => setThursAvailability('afternoon')}> Afternoon </button>
            <button className={`doc_updateAvail ${thursAvailability === 'all day' ? 'selected' : ''}`}
                onClick={() => setThursAvailability('all day')}> All day </button>
            <button className={`doc_updateAvail ${thursAvailability === 'not available' ? 'selected' : ''}`}
                onClick={() => setThursAvailability('not available')}> Not Available </button>
            <h1>Friday</h1>
            <button className={`doc_updateAvail ${friAvailability === 'morning' ? 'selected' : ''}`}
                onClick={() => setFriAvailability('morning')}> Morning </button>
            <button className={`doc_updateAvail ${friAvailability === 'afternoon' ? 'selected' : ''}`}
                onClick={() => setFriAvailability('afternoon')}> Afternoon </button>
            <button className={`doc_updateAvail ${friAvailability === 'all day' ? 'selected' : ''}`}
                onClick={() => setFriAvailability('all day')}> All day </button>
            <button className={`doc_updateAvail ${friAvailability === 'not available' ? 'selected' : ''}`}
                onClick={() => setFriAvailability('not available')}> Not Available </button>
            <h1>CONFIRM SELECTIONS</h1>
            <button className="doc_updateAvail"
                onClick={() => pushUpdatedAvailability()}> Confirm </button>
            <h1>Return home</h1>
            <button className="doc_updateAvail"
                onClick={() => navigate('/')}>Home</button>
        </div>

    );

};

export default Doc_Edit_Availability;