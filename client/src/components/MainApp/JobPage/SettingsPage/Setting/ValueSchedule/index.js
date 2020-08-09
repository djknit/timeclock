import React from 'react';
import {
  formatMyDate
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
                <Button
                  styles={style.button}
                  theme="primary"
                  onClick={() => toggleEditValueModal(true, index)}
                >
                  <i className="fas fa-edit" /> Edit Value
                </Button>
                {index !== 0 && (
                  <>
                    <Button
                      styles={style.button}
                      theme="primary"
                    >
                      <i className="fas fa-exchange-alt" /> Change Date
                    </Button>
                    <Button
                      styles={style.button}
                      theme="danger"
                    >
                      <i className="fas fa-trash-alt" /> Remove Value
                    </Button>
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