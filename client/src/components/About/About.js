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
          this library, which represents nearly 310 million 
          dollars in cumulative ad spend, in an informative 
          and interactive format — with tools that enable our 
          users to find, visualize, and perform analysis on 
          advertisements.
        </p>
        <p> 
          Political Tardigrade's Github repository can be
          found <a href="https://github.com/googleinterns/step9-2020"
          target="_blank" rel="noopener noreferrer">here</a>.
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
        <h3>Tardigrade?</h3>
        <p>
          Tardigrades are eight-legged, water-dwelling micro-animals. 
          Known colloquially as water bears, tardigrades are extremely 
          resilient creatures that have made their homes in nearly 
          every ecosystem on planet Earth, from tropical rainforests to 
          icy mountaintops to ocean floors. Tardigrades are all around us, 
          but because they are only 0.1-1mm long, it’s likely that most 
          of us have never seen one before. In the context of our project, 
          the tardigrade is a symbol of consciousness. Just as it’s easy 
          to go through life without ever considering the microscopic 
          organisms all around us, it’s easy to ignore the role that 
          political advertisements have played in our democracy. But, as we 
          hope Political Tardigrade will highlight, when we take a moment to 
          stop and scrutinize, we become privy to a whole new world of 
          information. 
        </p>
        <h3>Who?</h3>
        <p>
          Political Tardigrade is a Google STEP 2020 Capstone project. 
          Our team includes:
        </p>
        <div className="profile-container">
          <Profile 
            name="Kira Toal"
            github="kirakira0"
            type="intern"
            role="Google STEP Intern"
            university="Loyola Marymount University, '23"
            major="Computer Science"
            minor="Japanese Language"
            food="Ramen"
            animal="Orca whale"
            particle="Neutrinos"
          />
          <Profile 
            name="Robert Marcus"
            github="rob-marcus"
            type="intern"
            role="Google STEP Intern"
            university="Carnegie Mellon University, '22"
            major="Computational and Applied Mathematics"
            minor="Computer Science"
            food="Salmon"
            animal="Red salmon"
            particle="Quarks"
          />
          <Profile 
            name="Scarlet Nguyen"
            profile="scarletnguyen13"
            type="intern"
            role="Google STEP Intern"
            university="University of British Columbia, '23"
            major="Computer Science"
            minor="Undecided"
            food="Steamed bun"
            animal="Wolf"
            particle="Electrons"
          />
        </div>
        <div className="profile-container">
          <Profile 
            name="Andrew Latham"
            type="host"
            role="Google Software Engineer"
            food="Steak"
            animal="Falcon"
            particle="Neutrons"
          />
          <Profile 
            name="Aileme Omogbai"
            type="host"
            role="Google Software Engineer"
            food="Nigerian Jollof rice"
            animal="Chameleons"
            particle="Neutrinos"
          />
        </div>
        <p>
          The development of Political Tardigrade has been overseen by 
          our hosts, Andrew Latham and Aileme Omogbai. We interns extend 
          our gratitude and appreciation to you both for your tireless advice 
          and encouragement. We have all grown as engineers as a result of 
          your wisdom and support, and we thank you sincerely for it.
        </p>
      </div>
    </div>
  );
};

export default About;
