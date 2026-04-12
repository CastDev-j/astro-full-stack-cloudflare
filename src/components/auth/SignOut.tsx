import React, { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { navigate } from "astro:transitions/client";

const SignOut = () => {
  const [isLoading, setisLoading] = useState(false);

  const handleSignOut = async () => {
    setisLoading(true);
    const { data, error } = await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/auth/login");
        },
      },
    });

    setisLoading(false);
  };

  return (
    <button onClick={handleSignOut} disabled={isLoading} className="p-2 ">
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
};

export default SignOut;
