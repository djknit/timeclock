import React, { Component } from 'react';
import logo from '../../logo_wide.png'
import { windowWidthService, userService } from '../../data';
import getStyle from './style';
import { api } from './utilities';
import Button from '../Button';
import NewUserModal from './NewUserModal';
import LoginModal from './LoginModal';
import { addData } from '../higherOrder';

class _LandingPage_needsData extends Component {
  constructor(props) {
    super(props);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleNewUserModal = this.toggleNewUserModal.bind(this);
    this.afterToggleCbFactory = this.afterToggleCbFactory.bind(this);
    this.newUserInputRef = React.createRef();
    this.loginInputRef = React.createRef();
    this.state = {
      isLoginModalActive: false,
      isNewUserModalActive: false
    };
  };

  toggleLoginModal(isActiveAfterToggle) {
    this.setState(
      { isLoginModalActive: isActiveAfterToggle },
      this.afterToggleCbFactory(isActiveAfterToggle, this.loginInputRef)
    );
  };

  toggleNewUserModal(isActiveAfterToggle) {
    this.setState(
      { isNewUserModalActive: isActiveAfterToggle },
      this.afterToggleCbFactory(isActiveAfterToggle, this.newUserInputRef)
    );
  };

  afterToggleCbFactory(isActiveAfterToggle, inputRef) {
    return (() => {
      if (isActiveAfterToggle) inputRef.current.focus();
      const hasModalOpen = this.state.isLoginModalActive || this.state.isNewUserModalActive;
      if (hasModalOpen !== this.props.areAnyModalsOpen) this.props.setAreAnyModalsOpen(hasModalOpen);
    });
  };

  componentDidMount() {
    api.auth.test()
    .then(res => {
      if (!res.data.user) return console.error('Missing user.');
      userService.setUser(res.data.user);
      this.props.history.push('/app');
    })
    .catch(err => {});
  };

  componentWillUnmount() {
    this.props.setAreAnyModalsOpen(false);
  };

  render() {

    const { state, props, toggleLoginModal, toggleNewUserModal, loginInputRef, newUserInputRef } = this;
    const { isNewUserModalActive, isLoginModalActive } = state;
    const { windowWidth, areAnyModalsOpen } = props;

    const style = getStyle(windowWidth);

    return (
      <div className="container" style={style.container}>
        <h1 style={style.heading}>TIMECLOCK</h1>
        <img src={logo} style={style.logo} />
        <div style={style.buttonsArea}>
          <Button
            size="large"
            styles={style.leftButton}
            onClick={() => toggleNewUserModal(true)}
            allowTabFocus={!areAnyModalsOpen}
          >
            Sign Up
          </Button>
          <Button
            size="large"
            styles={style.rightButton}
            onClick={() => toggleLoginModal(true)}
            allowTabFocus={!areAnyModalsOpen}
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

const LandingPage = addData(_LandingPage_needsData, 'windowWidth', windowWidthService);

export default LandingPage;