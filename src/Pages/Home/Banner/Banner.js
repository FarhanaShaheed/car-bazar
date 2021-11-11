import React from 'react';
import { Image } from 'react-bootstrap';
import banner from '../../images/banner.jfif';

const Banner = () => {
    return (
        <div>
            <Image src={banner} style={{'height':'75vh', 'width':'100%'}} fluid></Image>
        </div>
    );
};

export default Banner;