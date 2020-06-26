export default function getStyle(hasAlign) {
  return (
    hasAlign ?
    { display: 'block' } :
    {}
  );
};