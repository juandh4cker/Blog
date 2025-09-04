export const random = (min=0, max=1) => {
  return Math.random() * (max - min) + min;
};

export const randint = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const choice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const sample = (arr, n) => {
  const copy = [...arr];
  shuffle(copy);
  return copy.slice(0, n);
};