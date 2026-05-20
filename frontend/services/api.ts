const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach backend at ${API_BASE}. Start Django: python manage.py runserver`
    );
  }

  const text = await res.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error(
        res.ok
          ? "Invalid JSON from server"
          : `Server error (${res.status}): ${text.slice(0, 120)}`
      );
    }
  }

  if (!res.ok) {
    throw new Error(formatApiError(data) || `Request failed (${res.status})`);
  }

  return data as T;
}

function formatApiError(data: Record<string, unknown>): string {
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;
  if (data.non_field_errors) {
    const errs = data.non_field_errors;
    if (Array.isArray(errs)) return errs.join(", ");
    return String(errs);
  }
  const parts: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) parts.push(`${key}: ${value.join(", ")}`);
    else parts.push(`${key}: ${String(value)}`);
  }
  return parts.join(" | ");
}

export type Service = { id: number; name: string };

export type AssignedLead = {
  lead_id: number;
  customer: string;
  phone: string;
  service: string;
};

export type Provider = {
  id: number;
  name: string;
  monthly_quota: number;
  used_quota: number;
  remaining_quota: number;
  leads_received: number;
  assigned_leads: AssignedLead[];
};

export type LeadPayload = {
  customer_name: string;
  phone: string;
  city: string;
  service: number;
  description: string;
};

export function getServices() {
  return request<Service[]>("/api/services/");
}

export function getDashboard() {
  return request<Provider[]>("/api/dashboard/");
}

export function createLead(payload: LeadPayload) {
  return request<{ message: string; data: LeadPayload & { id: number } }>(
    "/api/request-service/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function resetQuotaWebhook(eventId: string) {
  return request<{
    message: string;
    event_id: string;
    already_processed: boolean;
  }>("/api/webhook/quota-reset/", {
    method: "POST",
    body: JSON.stringify({ event_id: eventId }),
  });
}
