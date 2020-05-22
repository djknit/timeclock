import React, { Component } from 'react';
import logo from './logo192.png';
import { isLoggedInService, profileService } from '../../../data';
import getStyle from './style';
import { addData } from '../../higherOrder';

class _Navbar_needsData extends Component {
  constructor(props) {
    super(props);
    this.brandText = React.createRef();
    this.brandItem = React.createRef();
    this.state = {
      brandItemInnerHeight: undefined,
      totalHeight: undefined
    };
  }

  componentDidMount() {
    this.setState({
      brandItemInnerHeight: this.brandText.current.clientHeight,
      totalHeight: this.brandItem.current.clientHeight
    });
  };

  render() {
    const style = getStyle(this.state.brandItemInnerHeight, this.state.totalHeight);

    return (
      <nav className="navbar" role="navigation" ariaLabel="main navigation" style={style.nav}>
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
            className="navbar-burger burger"
            ariaLabel="menu"
            ariaExpanded="false"
            dataTarget="navbarBasicExample"
          >
            <span ariaHidden="true"></span>
            <span ariaHidden="true"></span>
            <span ariaHidden="true"></span>
          </a>
        </div>
  
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">
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
            </div>
          </div>
  
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a className="button is-light">
                  Log in
                </a>
              </div>
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