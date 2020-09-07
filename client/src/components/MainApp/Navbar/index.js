import React, { Component } from 'react';
import logo from './logo192.png';
import getStyle from './style';
import { isLoggedInService, profileService, userService } from '../../../data';
import { api } from '../utilities';
import NavItem from './NavItem';
import { DropdownContainer, Dropdown, DropdownLink } from './dropdownPieces';
import Button from '../../Button';
import { addData } from '../../higherOrder';

const menuId = 'navbar-menu';

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
          <div className="navbar-item" style={style.brandImgItem}>
            <img src={logo} style={style.brandImg} />
          </div>
          <div className="navbar-item" style={style.brandTextItem} ref={this.brandItem}>
            <span style={style.brandText} ref={this.brandText}>
              TIME<br />CLOCK
            </span>
          </div>

          <a
            role="button"
            className={`navbar-burger burger${isActiveClass}`}
            aria-label="menu"
            aria-expanded="false"
            data-target={menuId}
            style={style.burger}
            onClick={toggleMenu}
          >
            {[...Array(3)].map((_e, _i) => (
              <span aria-hidden="true" key={_i} />
            ))}
          </a>
        </div>
  
        <div id={menuId} className={`navbar-menu${isActiveClass}`}>
          <div className="navbar-start" style={style.navStart}>
            <NavItem>
              Dashboard
            </NavItem>
  
            <DropdownContainer>
              <DropdownLink>
                Jobs
              </DropdownLink>
  
              <Dropdown>
                <NavItem>
                  <i className="fas fa-plus" />&nbsp;New
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
              </Dropdown>
            </DropdownContainer>

            <div className="navbar-item has-dropdown is-hoverable">
              <DropdownLink>
                Jobs
              </DropdownLink>
  
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
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
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