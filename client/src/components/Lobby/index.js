import React, { Component } from 'react';
import { userService } from '../../data';
import { api } from '../utilities';
import { Switch, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import NotFound from '../NotFound';

class Lobby extends Component {
  constructor(props) {
    super(props);
  };

  componentDidMount() {
    const { pathname } = this.props.history.location;
    api.auth.test()
    .then(res => {
      if (!res.data.user) return console.error('Missing user.');
      userService.setValue(res.data.user);
      this.props.history.push(`/app${pathname}`);
    })
    .catch(() => {});
  };

  render() {

    const { areAnyModalsOpen } = this.props;

    return (
      <Switch>
        <Route
          path="/"
          render={props => (
            <LandingPage {...{ areAnyModalsOpen, ...props }} />
          )}
          exact
        />
        <Route component={NotFound} />
      </Switch>
    );
  };
}

export default Lobby;
