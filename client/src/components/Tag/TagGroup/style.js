export default function getStyle(hasAlign) {

  const marginBottom = 'calc(10px - .5rem)'; // .5rem come from Bulma .tag style

  return (
    hasAlign ?
    {
      display: 'block',
      marginBottom
    } :
    { marginBottom }
  );
};