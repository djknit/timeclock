export default function getStyle(styleProp) {
  
  const tagLineHeight = 1.5; // matches Bulma
  const tagEmHeight = 2; // Matches Bulma. Must be greater than lineHeight.
  const tagYPadding = `${(tagEmHeight - tagLineHeight) / 2}em` 

  return {
    tag: {
      maxWidth: '100%',
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      height: 'auto',
      lineHeight: tagLineHeight,
      paddingTop: tagYPadding,
      paddingBottom: tagYPadding,
      ...styleProp
    }
  };
};
