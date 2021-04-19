import { constants } from '../../utilities';
export * from '../../utilities';
export * from './formRefs';
export * from './elemental';
export * from './formData';
export * from './displayData';

const getIconClassName = iconName => `fas fa-${iconName}`;

const completeConstants = {
  ...constants,
  iconClassNames: {
    ...constants.iconClassNames,
    add: getIconClassName('plus'),
    edit: getIconClassName('edit'),
    delete: getIconClassName('trash-alt'),
    changeDate: getIconClassName('exchange-alt'),
    settings: getIconClassName('cog'),
    time: getIconClassName('clock'),
    view: getIconClassName('eye'),
    deleteSingleValue: getIconClassName('times'),
    createName: getIconClassName
  }
};

export {
  completeConstants as constants
};
