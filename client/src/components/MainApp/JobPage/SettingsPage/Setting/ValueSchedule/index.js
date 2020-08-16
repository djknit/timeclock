import React from 'react';
import {
  getSimpleJobSettingValueText
} from '../../../utilities';
import getStyle from './style';
import Button from '../../../../../Button';
import SettingValueDisplay from '../../../SettingValueDisplay';

function ValueSchedule({
  valueSchedule,
  toggleEditValueModal,
  toggleDeleteValueModal,
  toggleChangeDateModal,
  settingName
}) {

  const style = getStyle(settingName === 'wage');

  function SchedEntryButton({ text, toggle, iconClass, isRemove, index }) {
    return (
      <Button
        styles={style.button}
        theme={isRemove ? 'danger' : 'primary'}
        onClick={() => toggle(true, index)}
      >
        <i className={iconClass} />&ensp;{text}
      </Button>
    );
  }

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
        {valueSchedule.map(
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
                  detailsMarginTop=".4em"
                />
              </td>
              <td style={style.buttonsTd}>
                <SchedEntryButton
                  text="Edit Value"
                  toggle={toggleEditValueModal}
                  iconClass="fas fa-edit"
                  {...{ index }}
                />
                {index !== 0 && (
                  <>
                    <SchedEntryButton
                      text="Change Date"
                      toggle={toggleChangeDateModal}
                      iconClass="fas fa-exchange-alt"
                      {...{ index }}
                    />
                    <SchedEntryButton
                      text="Remove Value"
                      toggle={toggleDeleteValueModal}
                      iconClass="fas fa-trash-alt"
                      isRemove
                      {...{ index }}
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

export default ValueSchedule;