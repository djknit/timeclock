import React, { Component } from 'react';
import logo from './logo192.png';
import getStyle from './style';
import { isLoggedInService, profileService, userService, jobsService, currentJobService } from '../../../data';
import { api, promiseToSetState, retrieveAndSetCurrentJob } from '../utilities';
import NavItem from './NavItem';
import { DropdownContainer, Dropdown, DropdownLink } from './dropdownPieces';
import Button from '../../Button';
import { addData } from '../../higherOrder';

const menuId = 'navbar-menu';

const getJobSettingNamesObj = (settingName, propName) => ({ settingName, propName });
const jobSettingNamesAndPropNames = [
  getJobSettingNamesObj('Timezone', 'timezone'),
  getJobSettingNamesObj('Wage', 'wage'),
  getJobSettingNamesObj('Week Cutoff', 'weekBegins'),
  getJobSettingNamesObj('Day Cutoff', 'dayCutoff')
];

class _Navbar_needsData extends Component {
  constructor(props) {
    super(props);
    this.brandText = React.createRef();
    this.brandItem = React.createRef();
    this.dropdownTogglerFactory = this.dropdownTogglerFactory.bind(this);
    this.submitLogout = this.submitLogout.bind(this);
    this.state = {
      brandItemInnerHeight: undefined,
      isLoading: false,
      hasProblem: false,
      isMenuActive: false,
      isJobsDropdownActive: false,
      isCurrentJobDropdownActive: false
    };
  };

  dropdownTogglerFactory(isActivePropName) {
    return (isActiveAfterToggle => {
      const isParamDefined = typeof isActiveAfterToggle === 'boolean';
      this.setState({
        [isActivePropName]: isParamDefined ? isActiveAfterToggle : !this.state[isActivePropName]
      });
    });
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
      isLoggedIn,
      profileData,
      totalHeight,
      areAnyModalsOpen,
      jobs,
      getJobPagePath,
      dashboardPath,
      openNewJobModal,
      jobPageSubpaths,
      jobSettingsPageSubpaths,
      currentJob
    } = this.props;
    const {
      brandItemInnerHeight, isLoading, hasProblem, isMenuActive, isJobsDropdownActive, isCurrentJobDropdownActive
    } = this.state;

    const isActiveClass = isMenuActive ? ' is-active' : '';

    const toggleMenu = () => this.setState({ isMenuActive: !isMenuActive });
    const toggleJobsDropdown = this.dropdownTogglerFactory('isJobsDropdownActive');
    const toggleCurrentJobDropdown = this.dropdownTogglerFactory('isCurrentJobDropdownActive');

    const currentJobPath = getJobPagePath(currentJob && currentJob._id)
    const getJobSubpagePath = subpath => `${currentJobPath}/${subpath}`;
    const currentJobSettingsPath = getJobSubpagePath(jobPageSubpaths.settingsPage);

    const style = getStyle(brandItemInnerHeight, totalHeight);

    const commonDropdownItemAttrs = { onClick: ({ target }) => target.blur() };

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
  
        <div id={menuId} className={`navbar-menu${isActiveClass}`} style={style.menu}>
          <div className="navbar-start">
            <NavItem destinationPath={dashboardPath}>
              Dashboard
            </NavItem>
  
            {isLoggedIn && (
              <DropdownContainer isDropdownActive={isJobsDropdownActive}>
                <DropdownLink onClick={toggleJobsDropdown} isDropdownActive={isJobsDropdownActive}>
                  Jobs
                </DropdownLink>
                <Dropdown>
                  <NavItem onClick={openNewJobModal} style={style.jobsDropdownItem}>
                    <i className="fas fa-plus" />&nbsp;New
                  </NavItem>
                  {jobs && jobs.map(
                    ({ _id, name }) => (
                      <NavItem
                        destinationPath={getJobPagePath(_id)}
                        onClick={event => {
                          retrieveAndSetCurrentJob(_id);
                          event.target.blur();
                        }}
                        key={_id}
                        style={style.jobsDropdownItem}
                      >
                        <span style={style.jobLabel}>{name}</span>
                      </NavItem>
                    )
                  )}
                </Dropdown>
              </DropdownContainer>
            )}

            {currentJob && (
              <DropdownContainer isDropdownActive={isCurrentJobDropdownActive}>
                <DropdownLink onClick={toggleCurrentJobDropdown} isDropdownActive={isCurrentJobDropdownActive}>
                  <span style={style.currentJobLabel}>
                    Job: {currentJob.name}
                  </span>
                </DropdownLink>
    
                <Dropdown>
                  <NavItem destinationPath={currentJobPath} {...commonDropdownItemAttrs}>
                    Home
                  </NavItem>
                  <NavItem
                    destinationPath={getJobSubpagePath(jobPageSubpaths.timePage)}
                    {...commonDropdownItemAttrs}
                  >
                    Time
                  </NavItem>
                  <NavItem destinationPath={currentJobSettingsPath} {...commonDropdownItemAttrs}>
                    Settings
                  </NavItem>
                  {jobSettingNamesAndPropNames.map(({ settingName, propName }) => (
                    <NavItem
                      style={style.settingLabel}
                      destinationPath={`${currentJobSettingsPath}/${jobSettingsPageSubpaths[propName]}`}
                      {...commonDropdownItemAttrs}
                      key={propName}
                    >
                      {settingName}
                    </NavItem>
                  ))}
                </Dropdown>
              </DropdownContainer>
            )}
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
const _Navbar_needsMoreDataAgain = addData(_Navbar_needsMoreData, 'profileData', profileService);
const _Navbar_needsEvenMoreData = addData(_Navbar_needsMoreDataAgain, 'jobs', jobsService);
const Navbar = addData(_Navbar_needsEvenMoreData, 'currentJob', currentJobService);

export default Navbar;