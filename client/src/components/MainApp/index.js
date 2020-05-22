import React, { Component } from 'react';
import { userService } from '../../data';
import Navbar from './Navbar';
import { addData } from '../higherOrder';

class _MainApp_needsData extends Component {

  render() {
    const { props } = this;
    console.log(props.history)

    return (
      <>
        <Navbar history={props.history} />
        <div className="content" style={{paddingTop: 20}}><h1>
          Welcome!&nbsp;
          {(props && props.user && (props.user.username || props.user.email)) || 'No user found.'}
        </h1></div>
      </>
    );
  };
}

const MainApp = addData(_MainApp_needsData, 'user', userService);

export default MainApp;