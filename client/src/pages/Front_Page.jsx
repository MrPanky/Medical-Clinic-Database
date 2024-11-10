import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Front_Page.css'; // Import the CSS file

const Front_Page = () => {
  const navigate = useNavigate(); // For navigation
  
  // Function to handle login navigation
  const handleLoginClick = () => {
    navigate('/login'); // This will navigate to the login page without reloading
  };

  return (
    <div className="group8-app">
      <div className="group8-header">
        <h1>Welcome to Group8 Medical Clinic</h1>
        <p>Your health is our top priority. We provide world-class medical care and personalized attention to all our patients.</p>
        
        {/* Replace anchor tag with a button or clickable div */}
        <button 
          onClick={handleLoginClick} 
          className="group8-login-button">
          Login to Your Account
        </button>
      </div>

      {/* New container for text and info cards */}
      <div className="group8-info-container">
        <div className="group8-info-section">
          <h2>Why Choose Us?</h2>
          <h4>At Group8 Medical Clinic, we focus on patient-centered care, offering a range of services to support your well-being.</h4>
          <div className="group8-info-cards">
            <div className="group8-info-card">
              <h3>Experienced Doctors</h3>
              <p>Our team of highly qualified professionals is here to help you with the best possible care.</p>
            </div>
            <div className="group8-info-card">
              <h3>State-of-the-Art Facilities</h3>
              <p>We use the latest medical technology to ensure the most accurate diagnoses and effective treatments.</p>
            </div>
            <div className="group8-info-card">
              <h3>Comprehensive Services</h3>
              <p>From check-ups to specialized treatments, we offer a wide range of healthcare services.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="group8-footer">
        <p>Contact us for appointments or more information.</p>
        <div className="group8-contact-info">
          <a href="tel:+1234567890" className="group8-phone">Call Us: +1 (234) 567-890</a>
          <a href="fax:+1234567890" className="group8-fax">Fax: +1 (234) 567-8910</a>
        </div>
      </div>
    </div>
  );
}

export default Front_Page;
