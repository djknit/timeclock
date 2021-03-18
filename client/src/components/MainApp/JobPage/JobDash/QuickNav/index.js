import React, { Component } from 'react';
import getStyle from './style';
import ContentArea, { ContentAreaTitle } from '../../../ContentArea';
import Button from '../../../../Button';

class QuickNav extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.state = {
      buttonHeight: undefined
    };
  };

  componentDidMount() {
    this.setState({ buttonHeight: this.buttonRef.current.clientHeight });
  };

  render() {
    const { props, state, buttonRef } = this;
    const {
      disabled,
      style: styleProp,
      jobSettingsPath,
      timePagePath,
      dashboardPath,
      windowWidth
    } = props;
    const { buttonHeight } = state;

    const style = getStyle(buttonHeight, windowWidth, styleProp);

    const commonAttrs = {
      allowTabFocus: !disabled,
      styles: style.button,
      isLink: true
    };

    return (
      <ContentArea style={style.contentArea}>
        <ContentAreaTitle style={style.title}>Quick Links:</ContentAreaTitle>
        <Button
          theme="info"
          to={dashboardPath}
          {...{ buttonRef }}
          {...commonAttrs}
        >
          <i className="far fa-arrow-alt-circle-left" /> Back to Dashboard
        </Button>
        <Button
          theme="primary"
          to={timePagePath}
          {...commonAttrs}
        >
          <i className="far fa-clock" /> Time Page
        </Button>
        <Button
          theme="primary"
          to={jobSettingsPath}
          {...commonAttrs}
        >
          <i className="fas fa-cog" /> Job Settings
        </Button>
      </ContentArea>
    );
  };
};

export default QuickNav;
