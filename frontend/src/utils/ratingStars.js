export const ratingStars = (rating) => {
  return (
    Array(Math.floor(rating / 2)).fill('★').join('') +
    Array(5 - Math.floor(rating / 2)).fill('☆').join('')
  );
};