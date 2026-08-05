import React from 'react';
import Footer from '../../../Shared/Footer/Footer';
import Banner from '../../Banner/Banner';
import ContactUs from '../../ContactUs/ContactUs';
import Navigation from '../../Navigation/Navigation';
import Reviews from '../../Reviews/Reviews';
import Showroom3D from '../../Showroom3D/Showroom3D';
import PopularCars from '../PopularCars/PopularCars';

const Home = () => {
    return (
        <div>
            <Navigation></Navigation>
            <Banner></Banner>
            <PopularCars></PopularCars>
            <Showroom3D></Showroom3D>
            <Reviews></Reviews>
            <ContactUs></ContactUs>
            <Footer></Footer>
        </div>
    );
};

export default Home;