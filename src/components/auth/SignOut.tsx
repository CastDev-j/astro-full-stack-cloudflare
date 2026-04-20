import React, { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { navigate } from "astro:transitions/client";
import { FaDoorOpen, FaDoorClosed } from "react-icons/fa";
import { Button } from "../ui/Button";
import { cn } from "@/lib/cn";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const SignOut = ({ className, children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const { data, error } = await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/auth/login");
        },
        onError: () => {
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      size="sm"
      aria-label="Cerrar sesión"
      aria-busy={isLoading}
      variant="outline"
      className={cn(`group relative w-full sm:min-w-27.5 py-4.5`, className)}
    >
      <span className="inline-flex size-4 items-center justify-center">
        {isLoading ? (
          <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <FaDoorOpen className="size-4 shrink-0" aria-hidden="true" />
        )}
      </span>

      <span className="min-w-22.5 text-left text-sm hidden sm:inline-block">
        {isLoading ? (
          <span className="inline-flex items-center gap-1.5">Cerrando...</span>
        ) : (
          "Cerrar sesión"
        )}
      </span>
    </Button>
  );
};

export default SignOut;
