import { z } from "astro/zod";
export const authSchema = {
  login: z.object({
    email: z.email({
      error: "Ingresa un correo electrónico válido",
    }),
    password: z.string().min(8, {
      error: "La contraseña debe tener al menos 8 caracteres",
    }),
    rememberMe: z.boolean().optional(),
  }),
  register: z
    .object({
      name: z.string().min(2, {
        error: "El nombre debe tener al menos 2 caracteres",
      }),
      email: z.email({
        error: "Ingresa un correo electrónico válido",
      }),
      password: z.string().min(8, {
        error: "La contraseña debe tener al menos 8 caracteres",
      }),
      confirmPassword: z.string().min(8, {
        error: "Confirma tu contraseña",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
};
