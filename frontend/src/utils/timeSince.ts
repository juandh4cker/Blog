export const timeSince = (date: string): string => {
  const now = new Date();
  const dateCreation = new Date(date);
  const seconds = Math.floor((now.getTime() - dateCreation.getTime()) / 1000);

  if (seconds < 60) return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hora${hours !== 1 ? 's' : ''}`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} día${days !== 1 ? 's' : ''}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mes${months !== 1 ? 'es' : ''}`;

  const years = Math.floor(months / 12);
  return `${years} año${years !== 1 ? 's' : ''}`;
};
