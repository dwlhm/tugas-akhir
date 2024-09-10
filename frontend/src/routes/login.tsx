import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import React, { useState } from "react";
import { z } from "zod";
import { useAuth } from "../auth/context";

const loginSchema = z.object({
  redirect: z.string().optional().catch(""),
});

const formSchema = z.object({
  username: z.string(),
  password: z.string().min(3),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSchema,
  beforeLoad: ({ context, search }) => {
    console.log(context.auth)
    if (context.auth.user?.isAuthenticated) {
      throw redirect({
        to: search.redirect || "/dashboard"
      })
    }
  },
  component: Login,
});

function Login() {
  const auth = useAuth();
  const navigate = Route.useNavigate()
  const { redirect: redirect_url } = Route.useSearch();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<JSX.Element[]>([]);

  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      const formData = new FormData(e.currentTarget);
      const rawData = {
        username: formData.get("username"),
        password: formData.get("password"),
      };
      const data = formSchema.parse(rawData);
      const response = await auth.login(data.username, data.password);
      console.log("response", response);

      if (response.code >= 400 && response.error) {
        const err_list = response.error.map((item, index) => (
          <p
            className="capitalize bg-red-300 px-3 py-1 rounded border border-solid border-red-900 text-red-900 text-base text-center my-2 w-full mb-5"
            key={`err.msg.login.${index}`}
          >
            {item}
          </p>
        ));
        setErrorMessage(err_list);
      }

      if (response.code == 202) {
        setErrorMessage([]);
        navigate({
          to: "/dashboard",
        });
        console.log("DJKDJK")
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="flex items-center flex-col justify-center h-screen bg-gray-200">
      <form onSubmit={doLogin} className="max-w-xs">
        <h2 className="font-medium text-3xl mb-5">Akses Masuk</h2>
        {redirect_url && (
          <p className="bg-red-300 px-3 py-1 rounded border border-solid border-red-900 text-red-900 text-sm w-full mb-5">
            Kamu perlu masuk terlebih dahulu.
          </p>
        )}
        <div className="mb-2">
          <label htmlFor="username-input" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username-input"
            name="username"
            placeholder="Enter your name"
            type="text"
            className="bg-gray-100 border border-gray-400 text-sm rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password-input" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password-input"
            name="password"
            placeholder="Enter your password"
            type="password"
            className="bg-gray-100 border border-gray-400 text-sm rounded-md p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isSubmitted ? `Memproses...` : `Masuk`}
        </button>
        {errorMessage}
      </form>
    </div>
  );
}
