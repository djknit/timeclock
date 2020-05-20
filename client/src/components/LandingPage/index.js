import React, { Component } from 'react';
import logo from '../../logo_wide.png'
import { windowWidthService } from '../../data';
import getStyle from './style';
import Button from '../Button';
import NewUserModal from './NewUserModal';
import LoginModal from './LoginModal';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleNewUserModal = this.toggleNewUserModal.bind(this);
    this.state = {
      windowWidth: windowWidthService.getValue(),
      isLoginModalActive: false,
      isNewUserModalActive: false
    };
  };

  componentDidMount() {
    windowWidthService.subscribe(
      () => this.setState({
        windowWidth: windowWidthService.getValue()
      })
    );
  };

  toggleLoginModal(isActiveAfterToggle) {
    this.setState({ isLoginModalActive: isActiveAfterToggle });
  }

  toggleNewUserModal(isActiveAfterToggle) {
    this.setState({ isNewUserModalActive: isActiveAfterToggle });
  }

  render() {

    const { state, props, toggleLoginModal, toggleNewUserModal } = this;
    const { windowWidth, isNewUserModalActive, isLoginModalActive } = state;

    const style = getStyle(windowWidth);

    return (
      <div className="container" style={style.container}>
        <h1 style={style.heading}>TIMECLOCK</h1>
        <img src={logo} style={style.logo} />
        <div style={style.buttonsArea}>
          <Button
            size="large"
            style={style.leftButton}
            onClick={() => toggleNewUserModal(true)}
          >
            Sign Up
          </Button>
          <Button size="large" onClick={() => toggleLoginModal(true)}>
            Log In
          </Button>
        </div>
        <NewUserModal
          history={props.history}
          isActive={isNewUserModalActive}
          closeModal={() => toggleNewUserModal(false)}
        />
        <LoginModal
          history={props.history}
          isActive={isLoginModalActive}
          closeModal={() => toggleLoginModal(false)}
        />
      </div>
    );
  };
}

export default LandingPage;