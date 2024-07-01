import { Avatar } from "@material-ui/core";
import React from "react";
import './CSS/appBox.css'
// import { useSelector } from "react-redux";
// import { selectUser } from '../feature/userSlice';

const appBox = () => {
 // const user = useSelector(selectUser);
  return (
    <div className="Box">
      <div className="appBox-info">
      <Avatar />
      </div>
      <div className="appBox-app">
        <h5>What is your quetions or link ?</h5>
      </div>
    </div>
  );
};

export default appBox;



