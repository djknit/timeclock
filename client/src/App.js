import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.css';
import getStyle from './AppStyle';
import { windowWidthService } from './data';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

import sharedResources from 'timeclock-shared-resources';
console.log(sharedResources.testValue)

class App extends Component {
  constructor() {
    super();
    this.reportWindowWidthChange = this.reportWindowWidthChange.bind(this);
  };

  reportWindowWidthChange() {
    windowWidthService.reportChange(window.innerWidth);
  }

  componentDidMount() {
    this.reportWindowWidthChange();
    window.addEventListener('resize', this.reportWindowWidthChange);
  }

  render() {
    const style = getStyle();

    return (
      <Router>
        <div style={style.wholeApp}>
          <div style={style.allExceptFooter}>
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
          <Footer />
        </div>
      </Router>
    );
  };
}

export default App;