export const handleCopy = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy);

  } catch (err) {
    console.error('Error copiando al portapapeles:', err);
  }
};