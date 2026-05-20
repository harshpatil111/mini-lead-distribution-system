import Link from "next/link";

const pages = [
  {
    href: "/request-service",
    title: "Request Service",
    description: "Public form to submit a service enquiry and create a lead.",
  },
  {
    href: "/dashboard",
    title: "Provider Dashboard",
    description: "Live provider quotas and assigned leads (auto-refreshing).",
  },
  {
    href: "/test-tools",
    title: "Test Tools",
    description: "Webhook quota reset, idempotency, and bulk lead generation.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">
        Mini Lead Distribution System
      </h1>
      <p className="mt-2 text-zinc-600">
        Simple functional frontend connected to the Django backend APIs.
      </p>

      <div className="mt-8 grid gap-4">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md no-underline"
          >
            <h2 className="text-lg font-semibold text-zinc-900">{page.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
