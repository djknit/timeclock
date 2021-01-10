export default function getStyle() {
  const extraBodyBorder = 'solid 2px #dbdbdb';

  return {
    body: {
      padding: '10px 20px'
    },
    precedingBody: {
      borderBottom: extraBodyBorder
    },
    followingBody: {
      borderTop: extraBodyBorder
    },
    footer: {
      textAlign: 'right',
      display: 'block'
    }
  };
};