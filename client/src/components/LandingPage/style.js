import { headingFontFam } from '../../AppStyle';

export default function getStyle(windowWidth) {
  const buttonsAreaXPadding = windowWidth > 700 ? '25%' : '10%';

  // const buttonStyles = {
  //   focus: {
  //     backgroundColor: '#e7e7e7'
  //   },
  //   active: {
  //     backgroundColor: '#f8f8f8'
  //   }
  // };

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
      padding: `20px ${buttonsAreaXPadding} 0`
    },
    leftButton: {
      innate: { marginRight: 'calc(24% - 40px)' },
    },
    rightButton: {
      
    }
  };
};