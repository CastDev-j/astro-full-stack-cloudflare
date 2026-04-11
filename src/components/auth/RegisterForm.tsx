import { signIn, signUp } from "@/lib/auth-client";
import React, { useState } from "react";

const RegisterForm = () => {
  const [useForm, setUseForm] = useState({
    email: "23031429@itcelaya.edu.mx",
    password: "12345678",
    name: "John Doe",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await signUp.email({
      email: useForm.email,
      password: useForm.password,
      name: useForm.name,
      callbackURL: "/",
    });

    console.log({ data, error });
  };

  return (
    <div>
      <h2>Register Form</h2>
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={useForm.name}
            onChange={(e) => setUseForm({ ...useForm, name: e.target.value })}
          />
        </div>
        <button type="submit">Register</button>
      </form>

      <a href="/auth/login"> Already have an account? Login here. </a>
    </div>
  );
};

export default RegisterForm;
