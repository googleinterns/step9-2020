import React from 'react';

const Profile = props => {
  // const { currentPage, setCurrentPage } = props;

  return (
    <div className="profile">
      <h3>{props.name}</h3>
      <p>{props.role}</p>
      <p>University: {props.university}</p>
      <p>Major: {props.major}</p>
      <p>Minor: {props.minor}</p>
      <p>Favorite food: {props.food}</p>
      <p>Favorite animal: {props.animal}</p>
      <p>Favorite subatomic particles: {props.particle}</p>
    </div>
  );
};

export default Profile;
