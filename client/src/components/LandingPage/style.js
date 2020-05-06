import { headingFontFam } from '../../style';

export default function getStyle() {
  return {
    container: {
      paddingTop: 20
    },
    heading: {
      fontSize: 'calc(26px + 3vw)',
      fontFamily: headingFontFam,
      color: '#303030',
      fontWeight: 'bold'
    },
    logo: {
      maxWidth: '70%',
      maxHeight: 350
    },
    buttonsArea: {
      padding: '20px 15% 0'
    }
  };
};