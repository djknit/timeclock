import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.css';
import getStyle from './AppStyle';
import { windowWidthService, areModalsOpenService } from './data';
import Lobby from './components/Lobby';
import MainApp from './components/MainApp';
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

    return (
      <Router>
        <div style={style.wholeApp}>
          <div style={style.allExceptFooter}>
            <Switch>
              <Route
                path="/app"
                render={props => (
                  <MainApp
                    {...{
                      areAnyModalsOpen,
                      ...props
                    }}
                  />
                )}
              />
              <Route
                render={props => (
                  <Lobby {...{ areAnyModalsOpen, ...props }} />
                )}
              />
            </Switch>
          </div>
          <Footer {...{ areAnyModalsOpen }} />
        </div>
      </Router>
    );
  };
}

export default App;
