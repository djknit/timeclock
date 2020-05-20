import React, { Component } from 'react';
import { userService } from '../../data';

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.setUser = this.setUser.bind(this);
    this.state = {
      user: userService.getValue()
    };
  };

  setUser() {
    this.setState({ user: userService.getValue() });
  };

  componentDidMount() {
    userService.subscribe(this.setUser);
  };

  componentWillUnmount() {
    userService.unsub(this.setUser);
  }

  render() {
    const { props, state } = this;

    return (
      <h1>Welcome, {state.user.username || state.user.email}</h1>
    );
  };
}

export default MainApp;