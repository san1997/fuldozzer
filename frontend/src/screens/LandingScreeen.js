import React, { useState } from 'react';
import { COMPANY_NAME } from '../constants';
import './LandingScreen.css';

const LandingScreen = ({ location, history, match }) => {
	
    return (
        <div className='container'>
            <div className='heading'>{COMPANY_NAME}</div>

            <div className='topdiv'>

                <div className='top-info'>

                    <div className='list-title'>If facing any of the below issues:</div>
                    <ul>
                        <li>Trouble of dealing with 10+ distributors and irregular delivery?</li>
                        <li>Lesser margins to pass on to the customers?</li>
                        <li>Non-availability of medicines on time leads to poor business?</li>
                        <li>Looking for better customer retention?</li>
                    </ul>

                    <div className='list-title'>Then we have a solution for you:</div>
                    <ul>
                        <li>One stop solution for all your inventory.</li>
                        <li>Special rates and discounts on each product.</li>
                        <li>Slick ordering and quick delivery of your stock.</li>
                    </ul>

                </div>
                <div className='top-image'>
                    <img width="300px" src='https://img.freepik.com/premium-photo/pharmacy-drugstore-shop-building-as-flat-icon-blue-background-3d-rendering_476612-7904.jpg?w=2000'/>
                </div>
            </div>

            <div className='fuldose gradient-border'>
                Fuldose is a managed marketplace, which collects products from all the manufacturers & distributors, 
                and provide pharamcists a one stop platform to meet all their inventory requirements. 
            </div>

            <div className='selling-points'>
                <div className='list-title'>How fuldose is better, faster and cheaper ?</div>
                <ul>
                    <li>Virtual inventory of all the products.</li>
                    <li>Timely delivery with live tracking and online payments.</li>
                    <li>Intelligent and easy product exploration & ordering.</li>
                    <li>Get on the digital journey to digitize pharmaceutical industry.</li>
                </ul>
            </div>
            
        </div>
    );
}

export default LandingScreen;
