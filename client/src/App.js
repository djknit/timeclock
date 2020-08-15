import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.css';
import getStyle from './AppStyle';
import { windowWidthService, areModalsOpenService } from './data';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

class App extends Component {
  constructor() {
    super();
    this.reportWindowWidthChange = this.reportWindowWidthChange.bind(this);
    this.setAreAnyModalsOpen = this.setAreAnyModalsOpen.bind(this);
    this.state = {
      areAnyModalsOpen: false
    };
  };

  reportWindowWidthChange() {
    windowWidthService.reportChange(window.innerWidth);
  };

  setAreAnyModalsOpen() {
    this.setState({
      areAnyModalsOpen: areModalsOpenService.getValue()
    });
  };

  componentDidMount() {
    this.reportWindowWidthChange();
    areModalsOpenService.subscribe(this.setAreAnyModalsOpen);
    window.addEventListener('resize', this.reportWindowWidthChange);
  };

  render() {
    const style = getStyle();
    
    const { areAnyModalsOpen } = this.state;
    const { setAreAnyModalsOpen } = this;

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
                    {...{
                      areAnyModalsOpen,
                      setAreAnyModalsOpen
                    }}
                  />
                }
              />
              <Route
                exact
                path="/"
                render={
                  props => <LandingPage
                    {...props}
                    {...{
                      areAnyModalsOpen,
                      // setAreAnyModalsOpen
                    }}
                  />
                }
              />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer {...{ areAnyModalsOpen }} />
        </div>
      </Router>
    );
  };
}

export default App;