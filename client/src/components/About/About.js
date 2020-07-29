import './About.css';
import React from 'react';
import tardigrade from '../../images/tardigrade.png';

const About = () => {
  
  return (
    <div className="search-header">
      
      <img src={tardigrade} className="logo" alt="logo" />

      <p>This is the about page</p>
    </div>
  );
};

export default About;
