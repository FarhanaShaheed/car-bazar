import React from 'react';
import { Image } from 'react-bootstrap';
import Navigation from '../Home/Navigation/Navigation';

const NotFound = () => {
    return (
        <div>
            <Navigation></Navigation>
            <Image src="https://media3.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy_s.gif?cid=790b761161428ebbe0c7f9a725e93f741705f6cab1dbef91&rid=giphy_s.gif&ct=ts" fluid></Image>
        </div>
    );
};

export default NotFound;