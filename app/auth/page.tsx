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

  const login = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("Invalid email or password ❌");
    } else {
      router.push("/dashboard");
    }
  };

  const signUp = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg("Signup successful 🎉 You can login now");
    }
  };
<h1 className="text-3xl font-bold text-center mb-2 text-white">
  🎯 Golf Charity Platform
</h1>;
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-80 border border-white/20">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Golf Charity 🎯
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-red-400 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        <button
          onClick={login}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg mb-2 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          onClick={signUp}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
