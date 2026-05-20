"use client";

import { useState } from "react";
import { createLead, getServices, resetQuotaWebhook } from "@/services/api";

export default function TestToolsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [idempotencyEventId] = useState(() => crypto.randomUUID());

  const setStatus = (text: string) => setMessage(text);

  const handleResetQuota = async () => {
    setLoading("reset");
    setMessage(null);
    try {
      const eventId = crypto.randomUUID();
      const result = await resetQuotaWebhook(eventId);
      setStatus(
        `${result.message} (event: ${result.event_id}, already_processed: ${result.already_processed})`
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(null);
    }
  };

  const handleWebhookMultiple = async () => {
    setLoading("webhook");
    setMessage(null);
    try {
      const results = await Promise.all([
        resetQuotaWebhook(idempotencyEventId),
        resetQuotaWebhook(idempotencyEventId),
        resetQuotaWebhook(idempotencyEventId),
      ]);
      const processed = results.filter((r) => !r.already_processed).length;
      setStatus(
        `Sent 3 webhook calls with same event_id. New resets: ${processed}. ` +
          `Idempotent skips: ${3 - processed}. Event: ${idempotencyEventId}`
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Webhook test failed");
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateLeads = async () => {
    setLoading("leads");
    setMessage(null);
    try {
      const services = await getServices();
      const serviceId = services[0]?.id ?? 1;
      const timestamp = Date.now();

      const requests = Array.from({ length: 10 }, (_, i) =>
        createLead({
          customer_name: `Test Customer ${i + 1}`,
          phone: `99${timestamp}${i}`.slice(0, 15),
          city: "Test City",
          service: serviceId,
          description: `Bulk test lead ${i + 1}`,
        })
      );

      const results = await Promise.allSettled(requests);
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - succeeded;

      setStatus(`Generated leads: ${succeeded} succeeded, ${failed} failed.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Bulk lead generation failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-zinc-900">Test Tools</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Internal panel for webhook and concurrency testing. Actions call backend APIs only.
      </p>

      <div className="space-y-3">
        <ToolButton
          label="Reset Provider Quota"
          description="Calls POST /api/webhook/quota-reset/ with a new event_id"
          onClick={handleResetQuota}
          disabled={loading !== null}
          busy={loading === "reset"}
        />
        <ToolButton
          label="Call Webhook Multiple Times"
          description="Sends the same event_id 3 times to test idempotency"
          onClick={handleWebhookMultiple}
          disabled={loading !== null}
          busy={loading === "webhook"}
        />
        <ToolButton
          label="Generate 10 Leads Instantly"
          description="Fires 10 parallel POST /api/request-service/ requests"
          onClick={handleGenerateLeads}
          disabled={loading !== null}
          busy={loading === "leads"}
        />
      </div>

      {message && (
        <p className="mt-6 rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-800">{message}</p>
      )}
    </div>
  );
}

function ToolButton({
  label,
  description,
  onClick,
  disabled,
  busy,
}: {
  label: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
  busy: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm hover:bg-zinc-50 disabled:opacity-50"
    >
      <p className="font-medium text-zinc-900">{busy ? `${label}...` : label}</p>
      <p className="mt-1 text-xs text-zinc-500">{description}</p>
    </button>
  );
}
