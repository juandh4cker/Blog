import { z } from 'zod';

const usernameField = z
  .string()
  .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  .max(12, { message: 'El nombre de usuario debe tener menos de 12 caracteres' })
  .regex(/^[a-zA-Z0-9._]+$/, {
    message: 'En el nombre de usuario solo se permiten letras, números, puntos y guiones bajos',
  })
  .regex(/^[a-zA-Z0-9].*$/, { message: 'El nombre de usuario debe comenzar con letra o número' })
  .regex(/.*[a-zA-Z0-9]$/, { message: 'El nombre de usuario debe terminar con letra o número' });

const emailField = z.string().email({ message: 'Email inválido' });

const passwordField = z
  .string()
  .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una letra minúscula' })
  .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
  .regex(/\d/, { message: 'La contraseña debe contener al menos un número' });

export const registerSchema = z
  .object({
    username: usernameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  });
