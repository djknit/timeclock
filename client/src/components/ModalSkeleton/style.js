import { appMinWidth } from '../style';

export default function getStyle(hasExtraSection) {

  const bodySectionStyles = { padding: '10px 20px' };

  return {
    modalContainer: {
      minWidth: appMinWidth
    },
    body: hasExtraSection ? { padding: 0 } : bodySectionStyles,
    firstSection: {
      ...bodySectionStyles
    },
    sectionNotFirst: {
      ...bodySectionStyles,
      borderTop: 'solid 2px #dbdbdb'
    },
    footer: {
      textAlign: 'right',
      display: 'block'
    }
  };
};
