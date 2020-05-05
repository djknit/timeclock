import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo_wide.png';
import './App.css';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import NotFound from './components/NotFound';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    return (
      <Router>
        <div className="App">
          <div className="whole-page-except-footer">
            <Switch>
              <Route
                path="/app"
                render={
                  props => <MainApp
                    {...props}
                  />
                }
              />
              <Route
                exact
                path="/"
                render={
                  props => <LandingPage
                    {...props}
                  />
                }
              />
              <Route component={NotFound} />
            </Switch>
          </div>
          <footer></footer>
        </div>
      </Router>
    );
  };
}

export default App;