import React from 'react';
import getStyle from './style';
import { constants } from '../../../utilities';
import SchedEntryButton from '../SchedEntryBtn';
import SettingValueDisplay from '../../../../SettingValueDisplay';

const { iconClassNames } = constants;

function MobileSchedule({
  valueSchedule,
  toggleEditValueModal,
  toggleDeleteValueModal,
  toggleChangeDateModal,
  settingName,
  areAnyModalsOpen
}) {

  const style = getStyle(settingName === 'wage');

  return (
    <table style={style.table} className="table">
      <thead>
        <tr>
          <th style={style.td}>
            Start&nbsp;Date
          </th>
          <th style={style.valueTd}>
            Value
          </th>
          <th style={style.td} />
        </tr>
      </thead>
      <tbody>
        {valueSchedule && valueSchedule.map(
          ({ value, startDateText, _id }, index) => (
            <tr key={_id}>
              {index === 0 ? (
                <td style={style.dateTdNoDate}>
                  &mdash;
                </td>
              ) : (
                <td styled={style.dateTd}>
                  {startDateText}
                </td>
              )}
              <td style={style.valueTd}>
                <SettingValueDisplay
                  {...{
                    settingName,
                    value
                  }}
                />
              </td>
              <td style={style.buttonsTd}>
                <SchedEntryButton
                  text="Edit Value"
                  toggle={toggleEditValueModal}
                  iconClass={iconClassNames.edit}
                  {...{ areAnyModalsOpen }}
                  style={index !== 0 && style.buttonNotLast}
                  schedEntryId={_id}
                />
                {index !== 0 && (
                  <>
                    <SchedEntryButton
                      text="Change Date"
                      toggle={toggleChangeDateModal}
                      iconClass={iconClassNames.changeDate}
                      {...{ areAnyModalsOpen }}
                      schedEntryId={_id}
                      style={style.buttonNotLast}
                    />
                    <SchedEntryButton
                      text="Remove Value"
                      toggle={toggleDeleteValueModal}
                      iconClass={iconClassNames.delete}
                      isRemove
                      {...{ areAnyModalsOpen }}
                      schedEntryId={_id}
                    />
                  </>
                )}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default MobileSchedule;