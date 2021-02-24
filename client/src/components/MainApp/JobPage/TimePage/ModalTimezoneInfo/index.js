import React from 'react';
import getStyle from './style';
import { currentJobSessionTzStore } from '../../../../../data';
import { getTimezoneAbbreviation, constants } from '../utilities';
import Notification, { NotificationText } from '../../../../Notification';
import Tag, { TagGroup } from '../../../../Tag';
import InfoButton from '../../../InfoButton';
import IconButtonTag from './IconButtonTag';

const { editSessionTzIconClass } = constants;

function ModalTimezoneInfo({
  showMessage,
  toggleMessage,
  toggleSessionTimezoneModal,
  disabled,
  margin = '0.75em'
}) {

  const { sessionTimezone } = currentJobSessionTzStore;

  const tzAbbreviation = getTimezoneAbbreviation(sessionTimezone);

  const style = getStyle();

  return showMessage ? (
    <Notification>
      All times are in {tzAbbreviation} ({sessionTimezone}).
    </Notification>
  ) : (
    <TagGroup tagMargin={0} groupMargin={margin} align="right">
      <Tag theme="info light">
        Timezone: {tzAbbreviation}
      </Tag>
      <Tag theme="info light">
        <InfoButton
          shadowBlurRatio={0.65}
        />
      </Tag>
      <Tag theme="primary light">
        <InfoButton
          shadowBlurRatio={0.65}
          iconClassName={editSessionTzIconClass}
          theme="primary light"
        />
      </Tag>
      <IconButtonTag
        theme="info"
        {...{ disabled }}
      />
      <IconButtonTag
        theme="primary"
        iconClassName={editSessionTzIconClass}
        {...{ disabled }}
      />
    </TagGroup>
  );
}

export default ModalTimezoneInfo;
