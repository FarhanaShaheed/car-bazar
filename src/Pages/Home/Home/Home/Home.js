import React from 'react';
import Footer from '../../../Shared/Footer/Footer';
import Banner from '../../Banner/Banner';
import ContactUs from '../../ContactUs/ContactUs';
import Navigation from '../../Navigation/Navigation';

const Home = () => {
    return (
        <div>
            <Navigation></Navigation>
            <Banner></Banner>
            <ContactUs></ContactUs>
            <Footer></Footer>
        </div>
    );
};

export default Home;