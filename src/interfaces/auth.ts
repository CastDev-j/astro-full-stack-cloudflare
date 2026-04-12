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
};
