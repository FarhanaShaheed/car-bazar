import React from 'react';
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'*/
import './Footer.css'; 

const Footer = () => {
    return (
        <div className="custom-footer">
            <div className="row">
             <div className="col-sm-4">
                 <h4>Phone Support</h4>
                 <p>24 HOURS A DAY</p>
                 <h4>+01 345 97637</h4>
             </div>
             <div className="col-sm-4">
                 <h4>Connect Wth Us</h4>
                 <p>SOCIAL MEDIA CHANNELS</p>
                 <i class="fab fa-facebook-square"></i> <i class="fab fa-google-plus-square"></i> <i class="fab fa-twitter-square"></i> <i class="fab fa-instagram-square"></i>
                 

             </div>
             <div className="col-sm-4">
                 <h4>NEWSTELLER</h4>
                 <p>SIGN UP FOR SPECIAL OFFERS</p>
                 <p>&copy; 2021 farhana15-734@diu.edu.bd</p>
             </div>
        </div>
        </div>
    );
};

export default Footer;

//<p>Travel Booking System</p>
//<p>&copy; 2021 farhana15-734@diu.edu.bd</p>