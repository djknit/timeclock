import { collapsableSectionStyles } from '../style';

export default function getStyle() {
  return {
    useDefaultsInputField: {
      ...collapsableSectionStyles.outsideField
    },
    firstInputInSection: {
      ...collapsableSectionStyles.firstInsideField
    },
    weekBeginsLabel: {
      paddingTop: 0
    }
  };
};