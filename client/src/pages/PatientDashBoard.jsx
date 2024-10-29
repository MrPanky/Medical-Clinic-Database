import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientDashBoard.css'

const Dashboard = ({ medicalId }) => {
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [recentTests, setRecentTests] = useState(null);
  const [recentReferrals, setRecentReferrals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        console.log('api/patient', typeof medicalId, medicalId)
        const response = await axios.get(`http://localhost:3000/api/patient/${medicalId}`);
        const { upcomingAppointment, recentTests, recentReferrals } = response.data;

        setUpcomingAppointment(upcomingAppointment);
        setRecentTests(recentTests);
        setRecentReferrals(recentReferrals)
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    };

    if (medicalId) {
      fetchPatientData();
    }
  }, [medicalId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Welcome to your Dashboard</h2>
      <div className="cards-container">
        {/* Upcoming Appointment Card */}
        <div className="card">
          <h3>Upcoming Appointment</h3>
          {upcomingAppointment ? (
            <div>
              <p><strong>Date & Time:</strong> {new Date(upcomingAppointment.dateTime).toLocaleString()}</p>
              <p><strong>Doctor:</strong> {upcomingAppointment.doctor}</p>
              <p><strong>Reason:</strong> {upcomingAppointment.reason}</p>
              <p><strong>Office:</strong> {upcomingAppointment.name}</p>
              <p><strong>Address:</strong> {upcomingAppointment.address}</p>
            </div>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </div>

        {/* Recent Test Results Card */}
        <div className="card">
          <h3>Recent Test Results</h3>
          {recentTests && recentTests.length > 0 ? (
            <div>
              {recentTests.map((test, index) => (
                <div key={index}>
                  <p><strong>Test Name:</strong> {test.test_name}</p>
                  <p><strong>Date:</strong> {new Date(test.test_date).toLocaleDateString()}</p>
                  <p><strong>Result:</strong> {test.result}</p>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p>No recent test results.</p>
          )}
        </div>



        <div className="card">
        <h3>Recent Referrals</h3>
        {recentReferrals && recentReferrals.length > 0 ? (
          <div>
            {recentReferrals.map((referral, index) => (
              <div key={index}>
                <p><strong>Status:</strong> {referral.status}</p>
                <p><strong>Date Reviewed:</strong> {new Date(referral.date_reviewed).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {referral.reason}</p>
                <p><strong>Originating Doctor:</strong> {referral.origin_first_name} {referral.origin_last_name}</p>
                <p><strong>Receiving Doctor:</strong> {referral.receive_first_name} {referral.receive_last_name}</p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>No recent referrals.</p>
        )}
      </div>





      </div>
    </div>
  );
};

export default Dashboard;