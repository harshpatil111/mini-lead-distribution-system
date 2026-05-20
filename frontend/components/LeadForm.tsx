"use client";

import { FormEvent, useEffect, useState } from "react";
import { createLead, getServices, LeadPayload, Service } from "@/services/api";

const initialForm: LeadPayload = {
  customer_name: "",
  phone: "",
  city: "",
  service: 0,
  description: "",
};

export default function LeadForm() {
  const [form, setForm] = useState<LeadPayload>(initialForm);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, service: data[0].id }));
        }
      })
      .catch((err: Error) =>
        setMessage({ type: "error", text: err.message || "Failed to load services" })
      );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await createLead(form);
      setMessage({ type: "success", text: result.message });
      setForm((prev) => ({
        ...initialForm,
        service: prev.service || services[0]?.id || 0,
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to submit lead",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-zinc-700">
          Customer Name
          <input
            required
            type="text"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Phone Number
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          City
          <input
            required
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Service Type
          <select
            required
            value={form.service || ""}
            onChange={(e) => setForm({ ...form, service: Number(e.target.value) })}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {services.length === 0 && <option value="">Loading services...</option>}
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-zinc-700">
        Description
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={loading || services.length === 0}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>

      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
