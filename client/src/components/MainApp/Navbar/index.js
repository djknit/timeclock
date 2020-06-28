import React, { Component } from 'react';
import logo from './logo192.png';
import { isLoggedInService, profileService, userService } from '../../../data';
import { api } from '../utilities';
import getStyle from './style';
import Button from '../../Button';
import { addData } from '../../higherOrder';

class _Navbar_needsData extends Component {
  constructor(props) {
    super(props);
    this.brandText = React.createRef();
    this.brandItem = React.createRef();
    this.setStatePromise = this.setStatePromise.bind(this);
    this.submitLogout = this.submitLogout.bind(this);
    this.state = {
      brandItemInnerHeight: undefined,
      isLoading: false,
      hasProblem: false
    };
  };

  setStatePromise(updates) {
    return new Promise(resolve => {
      this.setState(updates, resolve)
    });
  }

  submitLogout() {
    this.setStatePromise({ isLoading: true, hasProblem: false })
    .then(api.auth.logout)
    .then(res => this.setStatePromise({ isLoading: false, hasProblem: false }))
    .then(() => {
      userService.clearUser();
      this.props.history.push('/');
    })
    .catch(err => {
      if (this.props.catchApiUnauthorized(err)) return;
      this.setState({
        isLoading: false,
        hasProblem: true
      });
    });
  };

  componentDidMount() {
    this.setState({
      brandItemInnerHeight: this.brandText.current.clientHeight
    });
    this.props.reportHeight(this.brandItem.current.clientHeight);
  };

  render() {
    const { isLoggedIn, profileData, totalHeight, areAnyModalsOpen } = this.props;
    const { brandItemInnerHeight, isLoading, hasProblem } = this.state;

    const style = getStyle(brandItemInnerHeight, totalHeight);

    return (
      <nav className="navbar" role="navigation" aria-label="main navigation" style={style.nav}>
        <div className="navbar-brand" style={style.brand}>
          <div className="navbar-item" style={style.brandImgItem}>
            <img src={logo} style={style.brandImg} />
          </div>
          <div className="navbar-item" style={style.brandTextItem} ref={this.brandItem}>
            <span style={style.brandText} ref={this.brandText}>
              TIME<br />CLOCK
            </span>
          </div>

          {/* <a
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a> */}
        </div>
  
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            {/* <a className="navbar-item">
              Home
            </a>
  
            <a className="navbar-item">
              Documentation
            </a>
  
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                More
              </a>
  
              <div className="navbar-dropdown">
                <a className="navbar-item">
                  About
                </a>
                <a className="navbar-item">
                  Jobs
                </a>
                <a className="navbar-item">
                  Contact
                </a>
                <hr className="navbar-divider" />
                <a className="navbar-item">
                  Report an issue
                </a>
              </div>
            </div> */}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <span style={style.welcomeText}>
                {profileData && isLoggedIn ?
                  <>Hi, <strong style={style.welcomeText}>{profileData.username || profileData.email}</strong>!</> :
                  <>No user found.</>
                }
                {hasProblem &&
                  <>Unexpected outcome.</>
                }
              </span>
              {isLoggedIn &&
                <Button
                  size="none"
                  // theme="white"
                  onClick={this.submitLogout}
                  isLoading={isLoading}
                  styles={style.logoutButton}
                  allowTabFocus={!areAnyModalsOpen}
                >
                  Sign Out
                </Button>
              }
            </div>
          </div>
        </div>
      </nav>
    );
  };
}

const _Navbar_stillNeedsData = addData(_Navbar_needsData, 'isLoggedIn', isLoggedInService);
const Navbar = addData(_Navbar_stillNeedsData, 'profileData', profileService);

export default Navbar;