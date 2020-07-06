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
    const { returnToDashboard, disabled, style } = props;
    const { buttonHeight } = state;

    const completeStyle = getStyle(buttonHeight, style);

    return (
      <ContentArea style={completeStyle.contentArea}>
        <ContentAreaTitle style={completeStyle.title}>Quick Links:</ContentAreaTitle>
        <Button
          theme="info"
          onClick={returnToDashboard}
          styles={completeStyle.button}
          {...{
            buttonRef,
            disabled
          }}
        >
          <i className="far fa-arrow-alt-circle-left" /> Back to Dashboard
        </Button>
        <Button
          theme="primary"
          onClick={returnToDashboard}
          styles={completeStyle.button}
          {...{ disabled }}
        >
          <i className="far fa-clock" /> Time Page
        </Button>
        <Button
          theme="primary"
          onClick={returnToDashboard}
          styles={completeStyle.button}
          {...{ disabled }}
        >
          <i className="fas fa-cog" /> Job Settings
        </Button>
      </ContentArea>
    );
  };
};

export default QuickNav;