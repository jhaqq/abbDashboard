"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import { runMigration } from './hooks/productMigrations'

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const now = new Date();
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const day = now.getDate();
  const year = now.getFullYear();
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const getTimeZone = () => {
    const date = new Date();
    const timeZoneString = date.toLocaleString("en-US", {
      timeZoneName: "short",
    });
    return timeZoneString.split(" ").pop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success && result.user) {
        const { userType } = result.user;

        switch (userType) {
          case "warehouse":
            router.push("/warehouse");
            break;
          case "manager":
            router.push("/manager");
            break;
          case "customerService":
            router.push("/customer-service");
            break;
          case "printer":
            router.push("/printer");
            break;
          default:
            console.error("Unknown user type:", userType);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="px-10 py-5 rounded-3xl bg-container flex flex-col items-center justify-center">
        <Image
          src="/abbLogo.png"
          width={256}
          height={256}
          alt="American Bubble Boy Logo"
          className="mb-8 w-64 h-64"
        />

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-2 mb-6 w-full">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div>
              <p className="text-lg mb-1">USERNAME</p>
              <input
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white rounded-sm h-7 text-black text-sm pl-2 w-full mb-2"
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            <div>
              <p className="text-lg mb-1">PASSWORD</p>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white rounded-sm h-7 text-black text-sm p-2 w-full mb-2"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#73B3F2] px-4 py-2 min-w-25 rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            <h1 className="font-semibold text-black text-lg">
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </h1>
          </button>
        </form>

        <p className="text-sm mt-5">
          {dayOfWeek}, {month} {day} {year}
        </p>
        <p className="text-sm">
          {time} {getTimeZone()}
        </p>
      </div>
    </div>
  );
}