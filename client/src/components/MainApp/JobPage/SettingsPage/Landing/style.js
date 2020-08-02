import { contentAreaPadding } from '../../style';

export default function getStyle() {

  return {
    contentArea: {
      paddingRight: 0,
      paddingBottom: 0
    },
    contentAreaTitle: {
      paddingRight: contentAreaPadding
    },
    button: {
      innate: {
        marginRight: contentAreaPadding,
        marginBottom: contentAreaPadding
      }
    }
  };
};