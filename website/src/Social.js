import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

class SocialIcon extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return(
      <a href={this.props.link}>
        <img src={window.location.origin + "/icons/" + this.props.name + ".svg"} alt={this.props.name + " logo"}/>
      </a>
    );
  }
}

class Social extends Component {
  render() {
    return (
      <div className="social">
        <SocialIcon link="http://github.com/itsjafer" name="github"/>
        <SocialIcon link="http://linkedin.com/itsjafer" name="linkedin"/>
        <SocialIcon link="http://itsjafer@gmail.com" name="email"/>
        <SocialIcon link="http://facebook.com/itsjafer" name="facebook"/>
        <SocialIcon link="http://instagram.com/itsjafer" name="instagram"/>
      </div>
    );
  }
}
 
export default Social;