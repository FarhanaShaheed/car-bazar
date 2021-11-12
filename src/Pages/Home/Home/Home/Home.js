import React from 'react';
import Footer from '../../../Shared/Footer/Footer';
import Banner from '../../Banner/Banner';
import ContactUs from '../../ContactUs/ContactUs';
import Navigation from '../../Navigation/Navigation';
import Reviews from '../../Reviews/Reviews';
import PopularCars from '../PopularCars/PopularCars';

const Home = () => {
    return (
        <div>
            <Navigation></Navigation>
            <Banner></Banner>
            <PopularCars></PopularCars>
            <Reviews></Reviews>
            <ContactUs></ContactUs>
            <Footer></Footer>
        </div>
    );
};

export default Home;