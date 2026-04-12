import { signIn } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/interfaces/auth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { cn } from "@/lib/cn";
import { navigate } from "astro:transitions/client";

const LoginForm = () => {
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
    resolver: zodResolver(authSchema.login),
    mode: "onChange",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 max-w-xs w-full transition-all">
      <h2 className="text-xl">Inicio de Sesión</h2>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(async ({ email, password, rememberMe }) => {
          const { data } = await signIn.email({
            email,
            password,
            rememberMe,
            callbackURL: "/",
            fetchOptions: {
              onSuccess: (data) => {
                if (data) navigate("/");
              },
            },
          });
        })}
      >
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
            placeholder="Ingrese su contraseña"
            type="password"
            {...register("password", { required: true })}
            error={!!errors.password}
            success={dirtyFields.password && !errors.password}
          />
          {errors.password && (
            <p
              className={cn(
                "text-rose-500 text-sm transition-opacity",
                errors.password ? "opacity-100" : "opacity-0",
              )}
            >
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="text-sm flex items-center gap-2">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <label htmlFor="rememberMe">Recuerdame</label>
          {errors.rememberMe && (
            <p
              className={cn(
                "text-rose-500 text-sm transition-opacity",
                errors.rememberMe ? "opacity-100" : "opacity-0",
              )}
            >
              {errors.rememberMe.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !isValid || isSubmitSuccessful}
        >
          {!isSubmitting && !isSubmitSuccessful && "Iniciar Sesión"}
          {isSubmitting && !isSubmitSuccessful && "Iniciando sesión..."}
          {isSubmitSuccessful && "Redireccionando..."}
        </Button>

        <p
          className={cn(
            "text-rose-500 text-sm transition-opacity",
            errors.form ? "opacity-100 flex" : "opacity-0 hidden",
          )}
        >
          {errors.form?.message}
        </p>
      </form>

      <a
        href="/auth/register"
        className="text-sm text-neutral-600 hover:underline"
      >
        {" "}
        ¿No tienes una cuenta? Regístrate
      </a>
    </div>
  );
};

export default LoginForm;
