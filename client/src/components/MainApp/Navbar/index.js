import React, { Component } from 'react';
import logo from './logo192.png';
import getStyle from './style';
import {
  isLoggedInService, profileService, userService, jobsService, currentJobService, windowWidthService
} from '../../../data';
import { api, promiseToSetState, retrieveAndSetCurrentJob, keyTriggerCheckerFactory } from '../utilities';
import NavItem from './NavItem';
import Dropdown from './Dropdown';
import WelcomeAndLogout from './WelcomeAndLogout';
import { addData, addPseudoPseudoClasses } from '../../higherOrder';

const menuId = 'navbar-menu';
const minScreenWidthForFullDisp = 1024; // matches Bulma

const getJobSettingNamesObj = (settingName, propName) => ({ settingName, propName });
const jobSettingNamesAndPropNames = [
  getJobSettingNamesObj('Timezone', 'timezone'),
  getJobSettingNamesObj('Wage', 'wage'),
  getJobSettingNamesObj('Week Cutoff', 'weekBegins'),
  getJobSettingNamesObj('Day Cutoff', 'dayCutoff')
];
const dropdownActivityPropNames = {
  jobs: 'isJobsDropdownActive',
  currentJob: 'isCurrentJobDropdownActive'
};

class _Navbar_needsDataAndPseudo extends Component {
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
      [dropdownActivityPropNames.jobs]: false,
      [dropdownActivityPropNames.currentJob]: false,
      useDefaultDropdownActivity: true
    };
  };

  dropdownTogglerFactory(isActivePropName) {
    return (isActiveAfterToggle => {
      const isParamDefined = typeof isActiveAfterToggle === 'boolean';
      const _updatedIsActive = isParamDefined ? isActiveAfterToggle : !this.state[isActivePropName];
      let stateUpdates = {
        [isActivePropName]: _updatedIsActive,
        useDefaultDropdownActivity: false
      };
      if (_updatedIsActive) {
        Object.keys(dropdownActivityPropNames)
        .filter(key => dropdownActivityPropNames[key] !== isActivePropName)
        .forEach(key => stateUpdates[dropdownActivityPropNames[key]] = false);
      }
      this.setState(stateUpdates);
    });
  };

  submitLogout() {
    promiseToSetState(this, { isLoading: true, hasProblem: false })
    .then(api.auth.logout)
    .then(res => promiseToSetState(this, { isLoading: false, hasProblem: false }))
    .then(() => {
      userService.clearUser();
      this.props.goTo('/');
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

  componentDidUpdate() {
    if (!this.state.useDefaultDropdownActivity) return;
    const { windowWidth, currentJob } = this.props;
    const isFullNavDisplayed = windowWidth >= minScreenWidthForFullDisp;
    const shouldJobsDropBeActive = !isFullNavDisplayed && !currentJob;
    const shouldCurrentJDBeActive = !isFullNavDisplayed && !!currentJob;
    if (
      this.state[dropdownActivityPropNames.jobs] !== shouldJobsDropBeActive ||
      this.state[dropdownActivityPropNames.currentJob] !== shouldCurrentJDBeActive
    ) {
      this.setState({
        [dropdownActivityPropNames.jobs]: shouldJobsDropBeActive,
        [dropdownActivityPropNames.currentJob]: shouldCurrentJDBeActive
      });
    }
  };

  render() {
    const { submitLogout } = this;
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
      currentJob,
      windowWidth,
      goTo,
      pseudoState: burgerPseudoState,
      pseudoHandlers
    } = this.props;
    const {
      brandItemInnerHeight, isLoading, hasProblem, isMenuActive, isJobsDropdownActive, isCurrentJobDropdownActive
    } = this.state;

    const isActiveClass = isMenuActive ? ' is-active' : '';

    const toggleMenu = () => this.setState({ isMenuActive: !isMenuActive });
    const toggleJobsDropdown = this.dropdownTogglerFactory(dropdownActivityPropNames.jobs);
    const toggleCurrentJobDropdown = this.dropdownTogglerFactory(dropdownActivityPropNames.currentJob);

    const currentJobPath = getJobPagePath(currentJob && currentJob._id);
    const getJobSubpagePath = subpath => `${currentJobPath}/${subpath}`;
    const currentJobSettingsPath = getJobSubpagePath(jobPageSubpaths.settingsPage);

    const isFullNavDisplayed = windowWidth >= minScreenWidthForFullDisp;

    const style = getStyle(brandItemInnerHeight, totalHeight, burgerPseudoState);

    const handleLinkClick = ({ target }) => {
      target.blur();
      this.setState({ isMenuActive: false, useDefaultDropdownActivity: true });
    };
    const commonNavItemAttrs = {
      onClick: handleLinkClick,
      goTo,
      tabIndex: 0
    };

    const welcomeLogoutAttrs = {
      profileData, isLoading, isLoggedIn, areAnyModalsOpen, hasProblem, submitLogout
    };

    const commonDropdownAttrs = { isFullNavDisplayed, goTo };

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
            {...pseudoHandlers}
            tabIndex={isFullNavDisplayed ? -1 : 0}
            onKeyDown={keyTriggerCheckerFactory(toggleMenu)}
          >
            {[...Array(3)].map((_e, _i) => (
              <span aria-hidden="true" key={_i} />
            ))}
          </a>
        </div>
  
        <div id={menuId} className={`navbar-menu${isActiveClass}`} style={style.menu}>
          <div className="navbar-start">
            {!isFullNavDisplayed && (
              <WelcomeAndLogout {...welcomeLogoutAttrs} />
            )}
            <NavItem destinationPath={dashboardPath} {...commonNavItemAttrs}>
              Dashboard
            </NavItem>

            {isLoggedIn && (
              <Dropdown
                isActive={isJobsDropdownActive}
                {...commonDropdownAttrs}
                toggle={toggleJobsDropdown}
                label="Jobs"
              >
                <NavItem
                  onClick={(event) => {
                    openNewJobModal();
                    handleLinkClick(event);
                  }}
                  style={style.jobsDropdownItem}
                >
                  <i className="fas fa-plus" />&nbsp;New
                </NavItem>
                {jobs && jobs.map(
                  ({ _id, name }) => (
                    <NavItem
                      destinationPath={getJobPagePath(_id)}
                      onClick={event => {
                        retrieveAndSetCurrentJob(_id);
                        handleLinkClick(event);
                      }}
                      key={_id}
                      style={style.jobsDropdownItem}
                    >
                      <span style={style.jobLabel}>{name}</span>
                    </NavItem>
                  )
                )}
              </Dropdown>
            )}

            {currentJob && (
              <Dropdown
                isActive={isCurrentJobDropdownActive}
                {...commonDropdownAttrs}
                toggle={toggleCurrentJobDropdown}
                label={
                  <span style={style.currentJobLabel}>
                    Job: {currentJob.name}
                  </span>
                }
              >
                <NavItem destinationPath={currentJobPath} {...commonNavItemAttrs}>
                  Home
                </NavItem>
                <NavItem
                  destinationPath={getJobSubpagePath(jobPageSubpaths.timePage)}
                  {...commonNavItemAttrs}
                >
                  Time
                </NavItem>
                <NavItem destinationPath={currentJobSettingsPath} {...commonNavItemAttrs}>
                  Settings
                </NavItem>
                {jobSettingNamesAndPropNames.map(({ settingName, propName }) => (
                  <NavItem
                    style={style.settingLabel}
                    destinationPath={`${currentJobSettingsPath}/${jobSettingsPageSubpaths[propName]}`}
                    {...commonNavItemAttrs}
                    key={propName}
                  >
                    {settingName}
                  </NavItem>
                ))}
              </Dropdown>
            )}
          </div>

          <div className="navbar-end">
            {isFullNavDisplayed && (
              <WelcomeAndLogout {...welcomeLogoutAttrs} />
            )}
          </div>
        </div>
      </nav>
    );
  };
}

const _Navbar_needsData = addPseudoPseudoClasses(_Navbar_needsDataAndPseudo);
const _Navbar_needsMoreData = addData(_Navbar_needsData, 'isLoggedIn', isLoggedInService);
const _Navbar_needsMoreDataAgain = addData(_Navbar_needsMoreData, 'profileData', profileService);
const _Navbar_needsEvenMoreData = addData(_Navbar_needsMoreDataAgain, 'jobs', jobsService);
const _Navbar_needsEvenEvenMoreData = addData(_Navbar_needsEvenMoreData, 'currentJob', currentJobService);
const Navbar = addData(_Navbar_needsEvenEvenMoreData, 'windowWidth', windowWidthService);

export default Navbar;