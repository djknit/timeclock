import React, { Component } from 'react';
import getStyle from './style';
import {footerHeight} from './style'

class Button extends Component {
  constructor(props) {
    super(props);
    this.setFocus = this.setFocus.bind(this);
    this.state = {
      isFocused: false
    };
  };

  setFocus(newValue) {
    this.setState({ isFocused: newValue });
  };

  render() {

    const { props, state, setFocus } = this;
    const { children, size, color, style, onClick } = props;
    
    const completeStyle = getStyle(style, state.isFocused);

    const sizeClass = size ? `is-${size}` : 'is-medium';
    const colorClass = color ? `is-color` : 'is-light'

    return (
      <button
        className={`button ${sizeClass} ${colorClass}`}
        style={completeStyle.button}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
}

export default Button;