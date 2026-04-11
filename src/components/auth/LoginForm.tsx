import { signIn } from "@/lib/auth-client";
import React, { useState } from "react";

const LoginForm = () => {
  const [useForm, setUseForm] = useState({
    email: "23031429@itcelaya.edu.mx",
    password: "12345678",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await signIn.email({
      email: useForm.email,
      password: useForm.password,
      callbackURL: "/",
    });

    console.log({ data, error });
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={useForm.email}
            onChange={(e) => setUseForm({ ...useForm, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={useForm.password}
            onChange={(e) =>
              setUseForm({ ...useForm, password: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="rememberMe">Remember Me:</label>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={useForm.rememberMe}
            onChange={(e) =>
              setUseForm({ ...useForm, rememberMe: e.target.checked })
            }
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <a href="/auth/register"> Don't have an account? Register here. </a>
    </div>
  );
};

export default LoginForm;
