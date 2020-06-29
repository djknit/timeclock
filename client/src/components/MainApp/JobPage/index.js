import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { currentJobService } from '../../../data';
import { api } from '../utilities'
import getStyle from './style';
import ContentArea from '../ContentArea';
import PageTitleArea from '../PageTitleArea';
import Notification, { NotificationText } from '../../Notification';
import { ProgressBar } from '../../formPieces';
import JobDash from './JobDash';
import SettingsPage from './SettingsPage';
import TimePage from './TimePage';
import { addData } from '../../higherOrder';

class _JobPage_needsData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasProblem: false,
      problemMessages: []
    };
  };

  componentDidMount() {
    const { job, match } = this.props;
    const { jobId } = match.params;
    if (!job || job.id !== jobId) {
      api.jobs.get(jobId)
      .then(res => {
        if (!res || !res.data) throw new Error('Failed to retrieve for data for job.');
        currentJobService.setCurrentJob(res.data);
      })
      .catch(err => {
        this.props.catchApiUnauthorized(err);
        this.setState({
          hasProblem: true,
          problemMessages: getMessagesFromErr(err)
        });
      });
    }
  };

  render() {
    const { job, match } = this.props;
    const { isLoading, hasProblem, problemMessages } = this.state;

    const style = getStyle();

    const buildPath = subpath => `${match.path}/${subpath}`;

    return (
      job ? (
        <Switch>
          <Route
            path={buildPath('settings')}
            render={props => (
              <SettingsPage {...props} />
            )}
          />
          <Route
            path={buildPath('time')}
            render={props => (
              <TimePage {...props} />
            )}
          />,
          <Route
            exact
            path={buildPath('')}
            render={props => (
              <JobDash {...props} />
            )}
          />
        </Switch>
      ) : (
        <>
          <PageTitleArea title="JOB" />
          <ContentArea style={style.noDataContentArea}>
            {
              isLoading ? (
                <Notification theme="info">
                  <NotificationText>Retrieving data...</NotificationText>
                  <ProgressBar
                    theme="primary"
                    max={100}
                  />
                </Notification>
              ) : (
                <Notification theme="danger">
                  <NotificationText>Oops! Your job data failed to load.</NotificationText>
                  <NotificationText>
                    Try going back to a previous page and then loading this page again.
                    You may also try logging out and logging back in.
                  </NotificationText>
                  <hr />
                  <NotificationText>Error(s):</NotificationText>
                  {problemMessages.map(
                    (msg, index) => (
                      <NotificationText isLast={index === problemMessages.length - 1}>
                        {msg}
                      </NotificationText>
                    )
                  )}
                </Notification>
              )
            }
          </ContentArea>
        </>
      )
    );
  };
}

const JobPage = addData(_JobPage_needsData, 'job', currentJobService);

export default JobPage;

function getMessagesFromErr(err) {
  return (
    (err && err.response && err.response.data && err.response.data.problemMessages) ||
    (err && err.messages) ||
    (err && err.message && [err.message]) ||
    ['An unknown problem was encountered.']
  );
}