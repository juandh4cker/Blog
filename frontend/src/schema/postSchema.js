import { z } from 'zod';

const noSpecialCharsRegex = /^[a-zA-ZÀ-ÿ0-9\s'-]+$/;

const postNameField = z
  .string()
  .min(1, { message: 'El nombre del post debe tener al menos 1 caracter' })
  .max(50, { message: 'El nombre del post debe tener menos de 50 caracteres' })
  .regex(noSpecialCharsRegex, {
    message: 'El nombre del post no debe tener caracteres especiales',
  });

const locationField = z
  .string()
  .min(1, { message: 'La ubicación debe tener al menos 1 caracter' })
  .max(50, { message: 'La ubicación debe tener menos de 50 caracteres' })
  .regex(noSpecialCharsRegex, { message: 'La ubicación no debe tener caracteres especiales' });

const urlField = z.string().url({ message: 'La URL de la imagen debe ser válida' });

const reviewField = z
  .string()
  .min(1, { message: 'La reseña debe tener al menos 1 caracter' })
  .max(300, { message: 'La reseña debe tener menos de 300 caracteres' });

const ratingField = z.preprocess(
  (val) => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  },
  z
    .number({
      required_error: 'La calificación es obligatoria',
      invalid_type_error: 'La calificación debe ser un número',
    })
    .int({ message: 'La calificación debe ser un número entero' })
    .min(1, { message: 'La calificación no debe ser menor que 1' })
    .max(10, { message: 'La calificación no debe ser mayor que 10' }),
);

export const postSchema = z.object({
  name: postNameField,
  location: locationField,
  imageUrl: urlField,
  review: reviewField,
  rating: ratingField,
});

export const commentSchema = z.object({
  content: reviewField,
  rating: ratingField,
});
