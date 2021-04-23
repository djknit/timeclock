export default function getStyle(styleProp, styleVars = {}) {
  const {
    tagLineHeight = 1.5, // default matches Bulma
    tagEmHeight = 2, // Must be greater than lineHeight. Default matches Bulma.
  } = styleVars;
  
  const tagYPadding = `${(tagEmHeight - tagLineHeight) / 2}em` 

  return {
    tag: {
      maxWidth: '100%',
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      height: `${tagEmHeight}em`, // redundant when tag has text; needed otherwise
      lineHeight: tagLineHeight,
      paddingTop: tagYPadding,
      paddingBottom: tagYPadding,
      ...styleProp
    }
  };
};
