import { collapsableSectionStyles } from '../style';

export default function getStyle() {
  return {
    useWageInputField: {
      ...collapsableSectionStyles.outsideField
    },
    firstInputInSection: {
      ...collapsableSectionStyles.firstInsideField
    }
  };
};