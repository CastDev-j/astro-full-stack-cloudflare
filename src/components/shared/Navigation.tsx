import React, { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { navigate } from "astro:transitions/client";
import { FaBars, FaDoorOpen } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { cn } from "@/lib/cn";

const navigationItems = [
  { name: "Inicio", href: "/" },
  { name: "Pendientes", href: "/todos" },
];

interface Props {
  currentPath: string;
}

const Navigation = ({ currentPath }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div>
      <div className="flex md:hidden">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 "
        >
          <FaBars />
        </button>

        <div
          className={cn(
            isSidebarOpen ? "translate-y-0" : "-translate-y-full",
            "fixed top-0 left-0 w-dvw h-dvh bg-white transition-transform duration-300 z-50 flex flex-col",
          )}
        >
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="text-2xl self-end mr-5 mt-2 p-3"
          >
            <IoCloseCircleOutline />
          </button>
          <nav className="flex flex-col w-full items-center gap-4 mt-10">
            {navigationItems.map((item) => (
              <a
                onClick={() => setIsSidebarOpen(false)}
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-xl font-medium hover:underline decoration-2 underline-offset-4",
                  currentPath === item.href
                    ? "underline"
                    : "text-neutral-600 hover:text-neutral-800",
                )}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="group flex items-center text-xl gap-2 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <FaArrowRotateRight className="animate-spin" />
              ) : (
                <FaDoorOpen />
              )}
              <span className="group-hover:underline decoration-2 group-hover:underline-offset-4">
                {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
              </span>
            </button>
          </nav>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-between gap-4">
        <nav>
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium hover:underline decoration-2 underline-offset-4",
                currentPath === item.href && "underline ",
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="group flex items-center text-sm gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <FaArrowRotateRight className="animate-spin" />
          ) : (
            <FaDoorOpen />
          )}
          <span className="group-hover:underline decoration-2 group-hover:underline-offset-4">
            {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
