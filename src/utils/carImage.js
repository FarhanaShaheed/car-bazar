/* Car photos come from two places: absolute URLs (remote stock photos) and
   repo-local files under public/cars/. Local paths need the PUBLIC_URL prefix
   so the app keeps working if it is ever served from a sub-path. */
const carImage = (img) =>
  !img || /^https?:\/\//.test(img) ? img : `${process.env.PUBLIC_URL}${img}`;

export default carImage;
