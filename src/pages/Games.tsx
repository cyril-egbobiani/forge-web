import React, { useState, useEffect } from "react";
import { gamesApi } from "../services/api";
import {
  TrophyIcon,
  BoltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Games: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await gamesApi.getLeaderboard();
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spiritual Games Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor player engagement in scripture maze games, score rankings, and progression.
          </p>
        </div>
        <button
          onClick={fetchLeaderboard}
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
            <TrophyIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Players</p>
            <p className="text-xl font-bold text-gray-900">{leaderboard.length}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
            <BoltIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Featured Game</p>
            <p className="text-xl font-bold text-gray-900">Light & Path</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score Rate</p>
            <p className="text-xl font-bold text-gray-900">88.5%</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Top Spiritual Game Players</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading player leaderboards...</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No game sessions recorded yet. Players in the mobile app will rank here upon playing Light & Path.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Best Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Games Played</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm">
                {leaderboard.map((item, idx) => (
                  <tr key={item._id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">#{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.username || "Player"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-indigo-600 font-semibold">{item.bestScore} XP</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.gamesPlayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-600 font-medium">{Math.round(item.averageScore || 0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
