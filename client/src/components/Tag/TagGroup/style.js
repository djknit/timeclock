export default function getStyle(hasAlign, isInline) {

  let style = {
    marginBottom: 'calc(10px - .5rem)' // .5rem come from Bulma .tag style
  };

  if (isInline) {
    style.display = 'inline-block';
    style.marginRight = style.marginLeft = '.5em'
  }
  else if (hasAlign) {
    style.display = 'block';
  }

  return style;
};