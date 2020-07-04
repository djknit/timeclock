import React, { Component } from 'react';
import getStyle from './style';
import { windowWidthService } from '../../../../data';
import PageTitle from '../../PageTitle';
import Button from '../../../Button';
import ContentArea, { ContentAreaTitle } from '../../ContentArea';

class JobDash extends Component {
  constructor(props) {
    super(props);
    this.quickNavButton = React.createRef();
    this.state = {
      quickNavButtonHeight: undefined
    };
  };

  componentDidMount() {
    this.setState({ quickNavButtonHeight: this.quickNavButton.current.clientHeight });
  };

  render() {
    const { quickNavButton, state, props } = this;
    const { job, match, history, returnToDashboard } = props;
    const { quickNavButtonHeight } = state;
    console.log(match) 
    console.log(history)

    const style = getStyle(quickNavButtonHeight);

    

    return (
      <>
        <PageTitle>JOB:&nbsp;{job.name}</PageTitle>
        <ContentArea style={style.quickNavArea}>
          <ContentAreaTitle style={style.quickNavTitle}>Quick Links:</ContentAreaTitle>
          <Button
            theme="info"
            onClick={returnToDashboard}
            styles={style.quickNavButton}
            buttonRef={quickNavButton}
          >
            <i className="far fa-arrow-alt-circle-left" /> Back to Dashboard
          </Button>
          {/* <br /> */}
          <Button theme="primary" onClick={returnToDashboard} styles={style.quickNavButton}>
            <i className="far fa-clock" /> Time Page
          </Button>
          {/* <br /> */}
          <Button theme="primary" onClick={returnToDashboard} styles={style.quickNavButton}>
            <i className="fas fa-cog" /> Job Settings
          </Button>
        </ContentArea>
        <div style={style.contentAreasRow}>
          <ContentArea style={style.basics}>
            <ContentAreaTitle>Basics</ContentAreaTitle>
          </ContentArea>
          <ContentArea style={style.menu}>
            <ContentAreaTitle>Settings:</ContentAreaTitle>
          </ContentArea>
        </div>
      </>
    );
  };
}

export default JobDash;