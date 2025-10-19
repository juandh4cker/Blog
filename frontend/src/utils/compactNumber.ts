export const compactNumber = (num: number): string => {
  if (num < 1000) return num.toString();

  const units = ['k', 'M', 'B', 'T'] as const;
  let unitIndex = -1;
  let compactNum = num;

  while (compactNum >= 1000 && unitIndex < units.length - 1) {
    compactNum /= 1000;
    unitIndex++;
  }

  return `${Math.round(compactNum)}${units[unitIndex]}`;
};