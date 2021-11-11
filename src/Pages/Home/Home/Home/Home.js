import React from 'react';
import Footer from '../../../Shared/Footer/Footer';
import Banner from '../../Banner/Banner';
import ContactUs from '../../ContactUs/ContactUs';
import Navigation from '../../Navigation/Navigation';
import Reviews from '../../Reviews/Reviews';

const Home = () => {
    return (
        <div>
            <Navigation></Navigation>
            <Banner></Banner>
            <Reviews></Reviews>
            <ContactUs></ContactUs>
            <Footer></Footer>
        </div>
    );
};

export default Home;