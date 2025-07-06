export const setLocalstorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getLocalstorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}