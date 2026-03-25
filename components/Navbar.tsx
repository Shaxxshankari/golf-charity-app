"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white/5 backdrop-blur border-b border-white/10 text-white">
      <h1 className="font-semibold">🎯 Charity App</h1>

      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </div>
  );
}
