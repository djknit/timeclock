import React, { Component } from 'react';
import logo from '../../logo_wide.png'
import { windowWidthService, userService, areModalsOpenService } from '../../data';
import getStyle from './style';
import { api } from './utilities';
import Button from '../Button';
import NewUserModal from './NewUserModal';
import LoginModal from './LoginModal';
import { addData } from '../higherOrder';

class _LandingPage_needsData extends Component {
  constructor(props) {
    super(props);
    this.modalToggleFactory = this.modalToggleFactory.bind(this);
    this.newUserInputRef = React.createRef();
    this.loginInputRef = React.createRef();
    this.toggleNewUserModal = (
      this.modalToggleFactory('isNewUserModalActive', this.newUserInputRef).bind(this)
    );
    this.toggleLoginModal = (
      this.modalToggleFactory('isLoginModalActive', this.loginInputRef).bind(this)
    );
    this.state = {
      isLoginModalActive: false,
      isNewUserModalActive: false,
      modalsRegistrationId: undefined
    };
  };
  
  modalToggleFactory(modalIsActivePropName, inputRef) {
    return function(isActiveAfterToggle) {
      this.setState(
        { [modalIsActivePropName]: !!isActiveAfterToggle },
        () => {
          if (isActiveAfterToggle) inputRef.current.focus();
          const { isLoginModalActive, isNewUserModalActive, modalsRegistrationId } = this.state;
          const areModalsOpen = isLoginModalActive || isNewUserModalActive;
          areModalsOpenService.report(modalsRegistrationId, areModalsOpen);
        }
      );
    };
  };

  componentDidMount() {
    api.auth.test()
    .then(res => {
      if (!res.data.user) return console.error('Missing user.');
      userService.setUser(res.data.user);
      this.props.history.push('/app');
    })
    .catch(() => {});
    this.setState({
      modalsRegistrationId: areModalsOpenService.getId()
    });
  };

  componentWillUnmount() {
    areModalsOpenService.report(this.state.modalsRegistrationId, false);
  };

  render() {

    const {
      state, props, toggleLoginModal, toggleNewUserModal, loginInputRef, newUserInputRef
    } = this;
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