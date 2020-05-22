import React, { Component } from 'react';
import getStyle from './style';

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
    const {
      children, size, color, style, onClick, disabled, formId, isSubmit, allowTabFocus, isLoading
    } = props;

    let formRelatedAttributes = (
      isSubmit ?
      {
        form: formId,
        type: 'submit'
      } :
      { type: 'button' }
    );
    
    const completeStyle = getStyle(style, state.isFocused);

    const sizeClass = (
      size === 'none' ?
      '' :
      (size ? `is-${size}` : 'is-medium')
    );
    const colorClass = color ? `is-${color}` : 'is-light';
    const loadingClass = isLoading ? 'is-loading' : '';

    return (
      <button
        className={`button ${sizeClass} ${colorClass} ${loadingClass}`}
        style={completeStyle.button}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClick={onClick}
        disabled={disabled}
        {...formRelatedAttributes}
        tabIndex={allowTabFocus !== false ? 0 : -1}
      >
        {children}
      </button>
    );
  };
}

export default Button;      