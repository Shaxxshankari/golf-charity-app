"use client";

import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();

  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [score, setScore] = useState("");
  const [scores, setScores] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [charities, setCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/auth");
        return;
      }

      setUser(data.user);
      fetchScores(data.user.id);
      fetchCharities();
      setLoading(false);
    };

    getUser();
  }, [router]);

  // 📥 Fetch scores
  const fetchScores = async (userId: string) => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    setScores(data || []);
  };

  // 📥 Fetch charities
  const fetchCharities = async () => {
    const { data } = await supabase.from("charities").select("*");
    setCharities(data || []);
  };

  // ➕ Add score
  const addScore = async () => {
    if (!score || !user?.id) return;

    if (Number(score) < 1 || Number(score) > 45) {
      alert("Score must be between 1 and 45");
      return;
    }

    await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: Number(score),
        date: new Date().toISOString(),
      },
    ]);

    setScore("");
    fetchScores(user.id);
  };

  // 💾 Save charity
  const saveCharity = async () => {
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ charity_id: selectedCharity })
      .eq("id", user.id);

    alert("Charity saved!");
  };

  // 🎲 Generate draw
  const generateDraw = () => {
    let nums: number[] = [];

    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }

    return nums;
  };

  // 🧠 Match logic
  const checkMatches = (userScores: any[], draw: number[]) => {
    const values = userScores.map((s) => s.score);
    return values.filter((n) => draw.includes(n)).length;
  };

  // 🎯 Run draw
  const runDraw = async () => {
    const numbers = generateDraw();
    setDrawNumbers(numbers);

    const { data: drawData } = await supabase
      .from("draws")
      .insert([{ numbers }])
      .select()
      .single();

    const matchCount = checkMatches(scores, numbers);

    if (matchCount >= 3) {
      alert(`🎉 You got ${matchCount} matches!`);

      await supabase.from("winners").insert([
        {
          user_id: user.id,
          draw_id: drawData?.id,
          match_count: matchCount,
        },
      ]);
    } else {
      alert(`You got ${matchCount} matches`);
    }
  };

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center text-white px-4">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-3xl font-semibold text-center mb-2 tracking-wide">
            Performance Dashboard
          </h1>

          <p className="text-center text-sm text-gray-400 mb-6">
            Logged in as: {user?.email}
          </p>

          {/* Add Score */}
          <div className="mb-6">
            <h2 className="text-sm text-gray-300 mb-2">Add Score</h2>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 p-2 rounded text-white"
              />

              <button
                onClick={addScore}
                className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>

          {/* Charity */}
          <div className="mb-6">
            <h2 className="text-sm text-gray-300 mb-2">Select Charity</h2>

            <div className="flex gap-2">
              <select
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 p-2 rounded text-white"
              >
                <option value="">Choose</option>
                {charities.map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={saveCharity}
                className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>

          {/* 🎲 Run Draw */}
          <div className="mt-6">
            <button
              onClick={runDraw}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Run Draw 🎲
            </button>

            {drawNumbers.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-300 mb-1">Draw Results</p>
                <p className="text-lg font-bold">{drawNumbers.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
