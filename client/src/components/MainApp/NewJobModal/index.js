import React, { Component } from 'react';
import getStyle from './style';
import ModalSkeleton from '../../ModalSkeleton';
import Button from '../../Button';
import { TextInput } from '../../formPieces';
import Notification, { NotificationText } from '../../Notification';
import { api, constants } from '../utilities';
import { jobsService, currentJobService } from '../../../data';

const formId = 'new-user-form';
const startingState = {
  name: '',
  startDate: {
    day: undefined,
    month: undefined,
    year: undefined
  },
  timezone: '',
  useWage: false,
  wage: {
    rate: undefined,
    currency: 'USD',
    useOvertime: true,
    overtime: {
      useMultiplier: true,
      multiplier: 1.5,
      rate: undefined,
      cutoff: 40
    }
  },
  dayCutoff: 0,
  weekBegins: 0,
  problems: {},
  hasSuccess: false,
  isLoading: false,
  hasProblem: false,
  problemMessages: [],
  showMessage: true,
  hasBeenSubmitted: false,
  secondsUntilRedirect: undefined
};

class NewJobModal extends Component {
  constructor(props) {
    super(props);
    this.state = startingState;
  };

  render() {

    return (
      <ModalSkeleton

      >

      </ModalSkeleton>
    );
  };
}