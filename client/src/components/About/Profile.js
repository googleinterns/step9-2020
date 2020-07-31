import React from 'react';
 
const Profile = props => {
 
  function getProfileText() {
    if (props.type === 'intern') {
      return (
        <div className="profile">
          <h3>{props.name}</h3>
          <p>Google STEP Intern</p>
          <p> Github:&nbsp;
            <a href={props.link} target="_blank" rel="noopener noreferrer">
              {props.github}
            </a>
          </p>
          <p>University: {props.university}</p>
          <p>Major: {props.major}</p>
          <p>Minor: {props.minor}</p>
          <p>Favorite food: {props.food}</p>
          <p>Favorite animal: {props.animal}</p>
          <p>Favorite subatomic particles: {props.particle}</p>
        </div>    
      );  
    } else if (props.type === 'host') {
      return (
        <div className="profile">
          <h3>{props.name}</h3>
          <p>Google Software Engineer</p>
          <p>Favorite food: {props.food}</p>
          <p>Favorite animal: {props.animal}</p>
          <p>Favorite subatomic particles: {props.particle}</p>
        </div>    
      );  
    } else {
      throw `${props.type} is not a valid role type.`;
    }
  }
 
  return (
    <div>
      {getProfileText()}
    </div>
  );
};
 
export default Profile;
