import React, { Component } from 'react';
import { userService } from '../../data';
import { api } from '../../utilities';
import Navbar from './Navbar';
import { addData } from '../higherOrder';

class _MainApp_needsData extends Component {
  componentDidMount() {
    api.auth.test()
    .then(res => {
      if (!this.props.user && res.data.user) {
        userService.setUser(res.data.user);
      }
    })
    .catch(() => {
      userService.clearUser();
      this.props.history.push('/');
    });
  }

  render() {
    const { props } = this;

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