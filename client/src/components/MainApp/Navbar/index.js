import React, { Component } from 'react';
import logo from './logo192.png';
import getStyle from './style';
import { isLoggedInService, profileService, userService, jobsService } from '../../../data';
import { api, promiseToSetState, retrieveAndSetCurrentJob } from '../utilities';
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
    this.submitLogout = this.submitLogout.bind(this);
    this.state = {
      brandItemInnerHeight: undefined,
      isLoading: false,
      hasProblem: false,
      isMenuActive: false
    };
  };

  submitLogout() {
    promiseToSetState(this, { isLoading: true, hasProblem: false })
    .then(api.auth.logout)
    .then(res => promiseToSetState(this, { isLoading: false, hasProblem: false }))
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
    const {
      isLoggedIn, profileData, totalHeight, areAnyModalsOpen, jobs, getJobPagePath, dashboardPath, openNewJobModal
    } = this.props;
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
            <NavItem destinationPath={dashboardPath}>
              Dashboard
            </NavItem>
  
            {isLoggedIn && (
              <DropdownContainer>
                <DropdownLink>
                  Jobs
                </DropdownLink>
                <Dropdown>
                  <NavItem onClick={openNewJobModal}>
                    <i className="fas fa-plus" />&nbsp;New
                  </NavItem>
                  {jobs && jobs.map(
                    ({ _id, name }) => (
                      <NavItem
                        destinationPath={getJobPagePath(_id)}
                        onClick={() => retrieveAndSetCurrentJob(_id)}
                        key={_id}
                      >
                        {name}
                      </NavItem>
                    )
                  )}
                </Dropdown>
              </DropdownContainer>
            )}

            <DropdownContainer>
              <DropdownLink>
                Jobs
              </DropdownLink>
  
              <Dropdown>
                <NavItem>
                  About
                </NavItem>
                <NavItem>
                  Jobs
                </NavItem>
                <NavItem>
                  Contact
                </NavItem>
                {/* <hr className="navbar-divider" /> */}
              </Dropdown>
            </DropdownContainer>
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

const _Navbar_needsMoreData = addData(_Navbar_needsData, 'isLoggedIn', isLoggedInService);
const _Navbar_needsEvenMoreData = addData(_Navbar_needsMoreData, 'profileData', profileService);
const Navbar = addData(_Navbar_needsEvenMoreData, 'jobs', jobsService);

export default Navbar;