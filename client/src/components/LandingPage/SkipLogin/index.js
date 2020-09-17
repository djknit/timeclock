// ABOUT THIS FILE:
  // button to fast auto-login to my account during development on my local machine
  // file w/ button & login credentials only exists on my copy (is `.gitignore`d)

import React, { Component } from 'react';

class SkipLogin extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.state = {
      Button: undefined
    };
  };
  
  componentDidMount() {
    try {
      const _Login = require('../_Login');
      if (!_Login || !_Login.default) return;
      this.setState(
        { Button: _Login.default },
        () => this.buttonRef.current && this.buttonRef.current.focus()
      );
    }
    catch (e) {
      return;
    }
  };

  render() {
    const {
      props,
      state: { Button },
      buttonRef
    } = this;
    
    return Button ? (
      <Button {...props} {...{ buttonRef }} />
    ) : (
      <></>
    );
  };
}

export default SkipLogin;