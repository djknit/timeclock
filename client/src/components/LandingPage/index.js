import React, { Component } from 'react';
import logo from '../../logo_wide.png'
import getStyle from './style';
import Button from '../Button';

class LandingPage extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const style = getStyle();

    return (
      <div className="container" style={style.container}>
        <h1 style={style.heading}>TIMECLOCK</h1>
        <img src={logo} style={style.logo} />
        <div style={style.buttonsArea}>
          <Button size="large">Sign Up</Button>
          <Button size="large">Log In</Button>
        </div>
      </div>
    );
  };
}

export default LandingPage;