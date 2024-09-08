import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { z } from "zod";

const loginSchema = z.object({
  redirect: z.string().optional().catch(""),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSchema,
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();

  const doLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center flex-col justify-center h-screen bg-gray-200">

      <form onSubmit={doLogin} className="max-w-xs">
      <h2 className="font-medium text-3xl mb-5">Akses Masuk</h2>
      {redirect && <p className="bg-red-300 px-3 py-1 rounded border border-solid border-red-900 text-red-900 text-sm w-full mb-5">Kamu perlu masuk terlebih dahulu.</p>}
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
          Masuk
        </button>
      </form>
    </div>
  );
}
