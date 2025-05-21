export const tiempoDesde = (fecha) => {
  const ahora = new Date();
  const fechaCreacion = new Date(fecha);
  const segundos = Math.floor((ahora - fechaCreacion) / 1000);

  if (segundos < 60) return `hace ${segundos} segundo${segundos !== 1 ? 's' : ''}`;
  const minutos = Math.floor(segundos / 60);

  if (minutos < 60) return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  const horas = Math.floor(minutos / 60);

  if (horas < 24) return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
  const dias = Math.floor(horas / 24);

  if (dias < 30) return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
  const meses = Math.floor(dias / 30);

  if (meses < 12) return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
  const años = Math.floor(meses / 12);

  return `hace ${años} año${años !== 1 ? 's' : ''}`;
};