import LeadForm from "@/components/LeadForm";

export default function RequestServicePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-zinc-900">Request Service</h1>
      <p className="mb-6 text-sm text-zinc-600">
        Submit a service enquiry. The system will create a lead and assign providers
        automatically.
      </p>
      <LeadForm />
    </div>
  );
}
