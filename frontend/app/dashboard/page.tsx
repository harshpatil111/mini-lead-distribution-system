"use client";

import { useCallback, useEffect, useState } from "react";
import ProviderCard from "@/components/ProviderCard";
import { getDashboard, Provider } from "@/services/api";

const POLL_INTERVAL_MS = 3000;

export default function DashboardPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboard();
      setProviders(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Provider Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Auto-refreshes every {POLL_INTERVAL_MS / 1000}s — open another tab to submit
            leads and watch this update.
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-zinc-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {loading && providers.length === 0 && (
        <p className="text-sm text-zinc-600">Loading dashboard...</p>
      )}

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      <div className="grid gap-4">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {!loading && providers.length === 0 && !error && (
        <p className="text-sm text-zinc-600">No providers found.</p>
      )}
    </div>
  );
}
