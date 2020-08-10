import React from 'react';
import {
  formatMyDate,
  getSimpleJobSettingValueText
} from '../../../utilities';
import getStyle from './style';
import Button from '../../../../../Button';

function ValueSchedule({
  valueSchedule,
  toggleEditValueModal,
  toggleDeleteValueModal,
  toggleChangeDateModal
}) {

  const style = getStyle();

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
            Start Date
          </th>
          <th style={style.td}>
            Value
          </th>
          <th style={style.td} />
        </tr>
      </thead>
      <tbody>
        {valueSchedule.map(
          ({ value, startDate, _id }, index) => (
            <tr key={_id}>
              <td style={style.td}>
                {index === 0 ? (
                  <>&mdash;</>
                ) : (
                  formatMyDate(startDate)
                )}
              </td>
              <td style={style.td}>
                {value}
              </td>
              <td style={style.td}>
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