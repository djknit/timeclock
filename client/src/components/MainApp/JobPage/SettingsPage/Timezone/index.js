import React from 'react';
import getStyle from './style';
import { formatMyDate } from '../../utilities';
import ContentArea from '../../../ContentArea';
import Button from '../../../../Button';

function Timezone({
  job
}) {

  const valueSchedule = job.timezone;

  const style = getStyle();

  return (
    <ContentArea title="Timezone Value Schedule">
      <table style={style.table}>
        <thead>
          <tr>
            <th>Start Date</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {valueSchedule.map(
            ({ value, startDate }, index) => (
              <tr>
                <td>
                  {index === 0 ? (
                    <>&mdash;</>
                  ) : (
                    formatMyDate(startDate)
                  )}
                </td>
                <td>{value}</td>
                <td>
                  <Button>Test</Button>
                  <Button>Test</Button>
                  <Button>Test</Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </ContentArea>
  );
}

export default Timezone;