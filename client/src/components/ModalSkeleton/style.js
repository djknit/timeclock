export default function getStyle(sectionStyles) {
  const extraBodyBorder = 'solid 2px #dbdbdb';

  let style = {
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

  if (!sectionStyles) return style;

  Object.keys(sectionStyles).forEach(elName => {
    if (!style[elName]) style[elName] = { ...sectionStyles[elName] };
    else Object.assign(style[elName], sectionStyles[elName]);
  });

  return style;
};
