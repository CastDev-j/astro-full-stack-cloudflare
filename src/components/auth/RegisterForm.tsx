import { signUp } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/interfaces/auth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { cn } from "@/lib/cn";
import { navigate } from "astro:transitions/client";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isValid,
      isDirty,
      isSubmitSuccessful,
      dirtyFields,
    },
  } = useForm({
    resolver: zodResolver(authSchema.register),
    mode: "onChange",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-xs w-full transition-all">
      <h2 className="text-xl">Crear Cuenta</h2>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(async ({ name, email, password }) => {
          try {
            const { data } = await signUp.email({
              name,
              email,
              password,
              callbackURL: "/",
              fetchOptions: {
                onSuccess: (data) => {
                  if (data) navigate("/");
                },
              },
            });
          } catch (error) {
            console.error("Error during sign-up:", error);
          }
        })}
      >
        <div className="text-sm flex flex-col gap-1">
          <label htmlFor="name">Nombre:</label>
          <Input
            id="name"
            placeholder="Tu nombre"
            error={!!errors.name}
            success={dirtyFields.name && !errors.name}
            {...register("name", { required: true })}
          />
          <p
            className={cn(
              "text-rose-500 text-sm transition-opacity",
              errors.name ? "opacity-100" : "opacity-0",
            )}
          >
            {errors.name?.message}
          </p>
        </div>

        <div className="text-sm flex flex-col gap-1">
          <label htmlFor="email">Correo Electrónico:</label>
          <Input
            id="email"
            placeholder="ejemplo@correo.com"
            error={!!errors.email}
            success={dirtyFields.email && !errors.email}
            {...register("email", { required: true })}
          />
          <p
            className={cn(
              "text-rose-500 text-sm transition-opacity",
              errors.email ? "opacity-100" : "opacity-0",
            )}
          >
            {errors.email?.message}
          </p>
        </div>

        <div className="text-sm flex flex-col gap-1">
          <label htmlFor="password">Contraseña:</label>
          <Input
            id="password"
            placeholder="Crea una contraseña"
            type="password"
            error={!!errors.password}
            success={dirtyFields.password && !errors.password}
            {...register("password", { required: true })}
          />
          <p
            className={cn(
              "text-rose-500 text-sm transition-opacity",
              errors.password ? "opacity-100" : "opacity-0",
            )}
          >
            {errors.password?.message}
          </p>
        </div>

        <div className="text-sm flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <Input
            id="confirmPassword"
            placeholder="Repite tu contraseña"
            type="password"
            error={!!errors.confirmPassword}
            success={
              dirtyFields.confirmPassword &&
              !errors.confirmPassword &&
              !!dirtyFields.password
            }
            {...register("confirmPassword", { required: true })}
          />
          <p
            className={cn(
              "text-rose-500 text-sm transition-opacity",
              errors.confirmPassword ? "opacity-100" : "opacity-0",
            )}
          >
            {errors.confirmPassword?.message}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !isValid || isSubmitSuccessful}
        >
          {!isSubmitting && !isSubmitSuccessful && "Crear Cuenta"}
          {isSubmitting && !isSubmitSuccessful && "Creando cuenta..."}
          {isSubmitSuccessful && "Redireccionando..."}
        </Button>
      </form>

      <a
        href="/auth/login"
        className="text-sm text-neutral-600 hover:underline"
      >
        ¿Ya tienes una cuenta? Inicia sesión
      </a>
    </div>
  );
};

export default RegisterForm;
