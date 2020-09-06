import React, { Component } from 'react';
import logo from './logo192.png';
import { isLoggedInService, profileService, userService } from '../../../data';
import { api } from '../utilities';
import getStyle from './style';
import NavItem from './NavItem';
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
      hasProblem: false,
      isMenuActive: false
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
    const { brandItemInnerHeight, isLoading, hasProblem, isMenuActive } = this.state;

    const isActiveClass = isMenuActive ? ' is-active' : '';

    const toggleMenu = () => this.setState({ isMenuActive: !isMenuActive });

    const style = getStyle(brandItemInnerHeight, totalHeight);

    return (
      <nav className="navbar" role="navigation" aria-label="main navigation" style={style.nav}>
        <div className="navbar-brand" style={style.brand}>
          <div className="navbar-item" style={style.navItem} style={style.brandImgItem}>
            <img src={logo} style={style.brandImg} />
          </div>
          <div className="navbar-item" style={style.navItem} style={style.brandTextItem} ref={this.brandItem}>
            <span style={style.brandText} ref={this.brandText}>
              TIME<br />CLOCK
            </span>
          </div>

          <a
            role="button"
            className={`navbar-burger burger${isActiveClass}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            style={style.burger}
            onClick={toggleMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
  
        <div id="navbarBasicExample" className={`navbar-menu${isActiveClass}`}>
          <div className="navbar-start">
            <NavItem>
              Dashboard
            </NavItem>
  
            <NavItem hasDropdown>
              <a className="navbar-link is-arrowless" style={style.navItem}>
                Jobs&nbsp;<i className="fas fa-chevron-down" style={style.dropdownArrow} />
              </a>
  
              <div className="navbar-dropdown">
                <NavItem>
                  <i className="fas fa-plus" /> New
                </NavItem>
                <NavItem>
                  Jobs
                </NavItem>
                <NavItem>
                  Contact
                </NavItem>
                <hr className="navbar-divider" />
                <NavItem>
                  Report an issue
                </NavItem>
              </div>
            </NavItem>

            {/* <div className="navbar-item has-dropdown is-hoverable">
              
            </div> */}

            <NavItem hasDropdown>
              <a className="navbar-link is-arrowless" style={style.navItem}>
                Jobs&nbsp;<i className="fas fa-angle-down" style={style.dropdownArrow} />
              </a>
  
              <div className="navbar-dropdown">
                <NavItem>
                  About
                </NavItem>
                <NavItem>
                  Jobs
                </NavItem>
                <NavItem>
                  Contact
                </NavItem>
                <hr className="navbar-divider" />
                <NavItem>
                  Report an issue
                </NavItem>
              </div>
            </NavItem>

            {/* <div className="navbar-item has-dropdown is-hoverable">
              
            </div> */}
          </div>

          <div className="navbar-end">
            <div className="navbar-item" style={style.navItem}>
              <span style={style.welcomeText}>
                {profileData && isLoggedIn ? (
                  <>Hi, <strong style={style.welcomeText}>{profileData.username || profileData.email}</strong>!</>
                ) : (
                  <>No user found.</>
                )}
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