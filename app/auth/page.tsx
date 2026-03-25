"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
 
  // 🔐 LOGIN
  const login = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard"); // ✅ redirect
    }
  };
  

  // 🆕 SIGNUP
  const signUp = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/dashboard",
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Check your email to confirm!");
    }

    setLoading(false);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* 🔥 MAIN CARD */}
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-80 border border-white/20">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          🎯 Golf Charity
        </h1>
        <p className="text-center text-gray-300 text-sm mb-6">
          Login or create your account
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full mb-3 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <p className="text-red-400 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg mb-2 transition"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        {/* SIGNUP BUTTON */}
        <button
          onClick={signUp}
          disabled={loading}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg transition"
        >
          {loading ? "Please wait..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
