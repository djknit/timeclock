import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css';
import './App.css';
import getStyle from './style';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import NotFound from './components/NotFound';
import { windowWidthService } from './data';

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
          <footer></footer>
        </div>
      </Router>
    );
  };
}

export default App;