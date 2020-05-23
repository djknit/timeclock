import React, { Component } from 'react';
import { userService } from '../../data';
import { api } from './utilities';
import getStyle from './style';
import Navbar from './Navbar';
import { addData } from '../higherOrder';

class _MainApp_needsData extends Component {
  constructor(props) {
    super(props);
    this.setNavHeight = this.setNavHeight.bind(this);
    this.state = {
      navHeight: undefined
    };
  };

  setNavHeight(navHeight) {
    this.setState({ navHeight });
  };

  componentDidMount() {
    api.auth.test()
    .then(res => {
      if (!this.props.user && res.data.user) {
        userService.setUser(res.data.user);
      }
    })
    .catch(() => {
      userService.clearUser();
      this.props.history.push('/');
    });
  }

  render() {
    const { history, user } = this.props;
    const { navHeight } = this.state;

    const style = getStyle(navHeight);

    return (
      <>
        <Navbar
          history={history}
          totalHeight={navHeight}
          reportHeight={this.setNavHeight}
        />
        <div className="content" style={style.mainContentArea}>
          {/* <h1>
            Welcome!&nbsp;
            {(user && (user.username || user.email)) || 'No user found.'}
          </h1> */}
          <div style={style.jobsArea}></div>
        </div>
      </>
    );
  };
}

const MainApp = addData(_MainApp_needsData, 'user', userService);

export default MainApp;