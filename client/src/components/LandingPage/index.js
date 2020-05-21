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
    this.focusLoginModal = this.focusLoginModal.bind(this);
    this.focusNewUserModal = this.focusNewUserModal.bind(this);
    this.newUserInputRef = React.createRef();
    this.loginInputRef = React.createRef();
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
    if (isActiveAfterToggle) {
      setTimeout(
        () => this.focusLoginModal(),
        250
      );
    }
  };

  toggleNewUserModal(isActiveAfterToggle) {
    this.setState({ isNewUserModalActive: isActiveAfterToggle });
    if (isActiveAfterToggle) {
      setTimeout(
        () => this.focusNewUserModal(),
        250
      );
    }
  };

  focusLoginModal() {
    this.loginInputRef.current.focus();
  };

  focusNewUserModal() {
    this.newUserInputRef.current.focus();
  };

  render() {

    const { state, props, toggleLoginModal, toggleNewUserModal, loginInputRef, newUserInputRef } = this;
    const { windowWidth, isNewUserModalActive, isLoginModalActive } = state;
    const isAnyModalActive = isLoginModalActive || isNewUserModalActive;

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
            allowTabFocus={!isAnyModalActive}
          >
            Sign Up
          </Button>
          <Button
            size="large"
            onClick={() => toggleLoginModal(true)}
            allowTabFocus={!isAnyModalActive}
          >
            Log In
          </Button>
        </div>
        <NewUserModal
          history={props.history}
          isActive={isNewUserModalActive}
          closeModal={() => toggleNewUserModal(false)}
          inputRef={newUserInputRef}
        />
        <LoginModal
          history={props.history}
          isActive={isLoginModalActive}
          closeModal={() => toggleLoginModal(false)}
          inputRef={loginInputRef}
        />
      </div>
    );
  };
}

export default LandingPage;