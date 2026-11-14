export const mediaSrc = (name) =>
  !name
    ? ""
    : name.startsWith("data:")
    ? name
    : `${process.env.REACT_APP_MEDIA_LINK}/${name}`;
