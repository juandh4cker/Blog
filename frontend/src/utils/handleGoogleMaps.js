export const handleGoogleMaps = (name, location) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    name + ', ' + location
  )}`;
  window.open(url, '_blank');
};