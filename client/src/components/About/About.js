import './About.css';
import Profile from './Profile';
import React from 'react';
import tardigrade from '../../images/tardigrade.png';

const About = () => {
  
  return (
    <div className="search-header">     
      <img src={tardigrade} className="logo" alt="logo" />
      <div className="info-container">
        <h3>What?</h3>
        <p>
          The Google Transparency Report is a comprehensive, 
          open source library of political advertisements hosted 
          on Google services since May of 2018. Political 
          Tardigrade is committed to presenting data from 
          this library, which represents nearly two billion 
          dollars in cumulative ad spend, in an informative 
          and interactive format — with tools that enable our 
          users to find, visualize, and perform analysis on 
          advertisements.
        </p>
        <h3>Why?</h3>
        <p>
          Many Americans are aware of how much of a role social 
          media plays in our political discourse, but the impact 
          of political ads in particular may not always be as 
          readily apparent. Political Tardigrade compiles and 
          highlights overarching trends in America’s political 
          ad space for students, researchers, or other individuals 
          who need easily readable data. By making such data more 
          accessible and easy to analyze, this project aims to 
          promote sociopolitical awareness.
        </p>
        <h3>Who?</h3>
        <p>
          Political Tardigrade is a Google STEP 2020 Capstone project. 
          Our team includes:
        </p>
        <Profile 
          name="Kira Toal"
          role="Google STEP Intern"
          university="Loyola Marymount University (class of 2023)"
          major="Computer Science"
          minor="Japanese Language"
          food="Ramen"
          animal="Orca whale"
          particle="Neutrinos"
        />
        <Profile 
          name="Robert Marcus"
          role="Google STEP Intern"
          university="Carnegie Mellon University (class of 2022)"
          major="Computational and Applied Mathematics"
          minor="Computer Science"
          food="Salmon"
          animal="Red salmon"
          particle="Salmon (also quarks)"
        />
      </div>
    </div>
  );
};

export default About;
