import { useState } from "react";

type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type ApplicationInput = {
  company: string;
  role: string;
  status: Status;
  link?: string;
  notes?: string;
};

export default function ApplicationForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<ApplicationInput>;
  onSubmit: (data: ApplicationInput) => void;
  loading: boolean;
}) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "APPLIED");
  const [link, setLink] = useState(initial?.link ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function submit() {
    onSubmit({
      company,
      role,
      status,
      link: link.trim() ? link : undefined,
      notes: notes.trim() ? notes : undefined,
    });
  }

  return (
    <div className="space-y-3">
      <input
        className="w-full p-3 rounded-xl bg-slate-800 outline-none"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        className="w-full p-3 rounded-xl bg-slate-800 outline-none"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <select
        className="w-full p-3 rounded-xl bg-slate-800 outline-none"
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
      >
        <option value="APPLIED">Applied</option>
        <option value="INTERVIEW">Interview</option>
        <option value="OFFER">Offer</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <input
        className="w-full p-3 rounded-xl bg-slate-800 outline-none"
        placeholder="Link (optional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <textarea
        className="w-full p-3 rounded-xl bg-slate-800 outline-none min-h-[90px]"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
