export const handleGoogleMaps = (name: string, location: string): void => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name}, ${location}`
  )}`;
  window.open(url, '_blank');
};
