import React, { Component } from 'react';
import logo from '../../../logo_wide.png'
import { windowWidthService } from '../../../data';
import getStyle from './style';
import { modalManagement } from './utilities';
import Button from '../../Button';
import SkipLogin from './SkipLogin'; // fast auto-login only for development
import NewUserModal from './NewUserModal';
import LoginModal from './LoginModal';
import { addData } from '../../higherOrder';

const {
  addModalsStateAndMethods, createModalInfo, reportModalsClosedFor, extractModalsResources
} = modalManagement;

const modalsInfo = [
  createModalInfo('newUser', NewUserModal, true),
  createModalInfo('login', LoginModal, true)
];

class _LandingPage_needsData extends Component {
  constructor(props) {
    super(props);
    let state = {};
    addModalsStateAndMethods(this, state, modalsInfo);
    this.state = state;
  };
  
  componentWillUnmount() {
    reportModalsClosedFor(this);
  };

  render() {

    const { windowWidth, areAnyModalsOpen, history } = this.props;

    const { modalTogglers, modals } = extractModalsResources(this, modalsInfo);

    const toggleLoginModal = modalTogglers.login;
    const toggleNewUserModal = modalTogglers.newUser;

    const style = getStyle(windowWidth);

    return (
      <div style={style.outerContainer}>
        <div className="container" style={style.innerContainer}>
          <SkipLogin {...{ history }} />
          <h1 style={style.heading}>TIMECLOCK</h1>
          <img src={logo} style={style.logo} />
          <div style={style.buttonsArea}>
            <Button
              size="large"
              style={style.leftButton}
              onClick={() => toggleNewUserModal(true)}
              allowTabFocus={!areAnyModalsOpen}
            >
              Sign Up
            </Button>
            <Button
              size="large"
              style={style.rightButton}
              onClick={() => toggleLoginModal(true)}
              allowTabFocus={!areAnyModalsOpen}
            >
              Log In
            </Button>
          </div>
          {modals.map(
            ({ ModalComponent, toggle, isActive, inputRef, name }) => (
              <ModalComponent
                key={name}
                {...{
                  isActive,
                  inputRef,
                  history
                }}
                closeModal={() => toggle(false)}
              />
            )
          )}
        </div>
      </div>
      
    );
  };
}

const LandingPage = addData(_LandingPage_needsData, 'windowWidth', windowWidthService);

export default LandingPage;