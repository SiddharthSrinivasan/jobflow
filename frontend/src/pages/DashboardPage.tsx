import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../api";
import Modal from "../components/Modal";
import ApplicationForm, { type ApplicationInput } from "../components/ApplicationForm";
import AnalyticsCard from "../components/AnalyticsCard";

type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: Status;
  link?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

type Analytics = {
  APPLIED: number;
  INTERVIEW: number;
  OFFER: number;
  REJECTED: number;
};

export default function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<JobApplication | null>(null);

  const loadApps = useCallback(async () => {
  const params = new URLSearchParams();
  if (statusFilter) params.set("status", statusFilter);
  if (search) params.set("search", search);

  const data = await apiFetch(`/applications?${params.toString()}`);
    setApps(data);
    }, [statusFilter, search]);

  const loadAnalytics = useCallback(async () => {
        const data = await apiFetch("/applications/analytics");

        if (data.byStatus) {
            setAnalytics(data.byStatus);
        } else {
            setAnalytics(data);
        }
    }, []);

  const loadAll = useCallback(async () => {
  setErr(null);
  setLoading(true);

  try {
    await Promise.all([loadApps(), loadAnalytics()]);
  } catch (e: unknown) {
    if(e instanceof Error) {
      setErr(e.message);
    } else {
      setErr("An error occurred");
    }
  } finally {
    setLoading(false);
  }
}, [loadApps, loadAnalytics]);

  function logout() {
    localStorage.removeItem("token");
    onLogout();
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(app: JobApplication) {
    setEditing(app);
    setModalOpen(true);
  }

  async function submitForm(data: ApplicationInput) {
    setSaving(true);
    setErr(null);

    try {
      if (editing) {
        await apiFetch(`/applications/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        await apiFetch("/applications", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }

      setModalOpen(false);
      setEditing(null);

      await loadAll();
    } catch (e: unknown) {
        if(e instanceof Error) {
            setErr(e.message);
        } else {
            setErr("An error occurred");
        }
    } finally {
      setSaving(false);
    }
  }

  async function deleteApp(app: JobApplication) {
    const ok = confirm(`Delete application for ${app.company} - ${app.role}?`);
    if (!ok) return;

    try {
      await apiFetch(`/applications/${app.id}`, { method: "DELETE" });
      await loadAll();
    } catch (e: unknown) {
        if(e instanceof Error) {
            setErr(e.message);
        } else {
            setErr("An error occurred");
        }
    }
  }

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">JobFlow</h1>

          <div className="flex gap-2">
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500"
            >
              + Add
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Analytics */}
        <AnalyticsCard data={analytics} />

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input
            className="p-3 rounded-xl bg-slate-800 outline-none flex-1 min-w-[220px]"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={loadAll}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500"
          >
            Search
          </button>

          <select
            className="p-3 rounded-xl bg-slate-800 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {err && <div className="text-red-400">{err}</div>}

        {/* List */}
        {loading ? (
          <div className="text-slate-400">Loading...</div>
        ) : (
          <div className="space-y-3">
            {apps.map((a) => (
              <div
                key={a.id}
                className="bg-slate-900 p-4 rounded-2xl flex justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">{a.company}</div>
                  <div className="text-slate-300 truncate">{a.role}</div>
                  <div className="text-slate-500 text-sm">{a.status}</div>

                  {(a.link || a.notes) && (
                    <div className="text-slate-400 text-sm mt-2 space-y-1">
                      {a.link && (
                        <a
                          className="underline"
                          href={a.link}
                          target="_blank"
                        >
                          Link
                        </a>
                      )}
                      {a.notes && <div className="truncate">{a.notes}</div>}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteApp(a)}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {apps.length === 0 && (
              <div className="text-slate-500">No applications yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        title={editing ? "Edit Application" : "Add Application"}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <ApplicationForm
          initial={
            editing
              ? {
                  company: editing.company,
                  role: editing.role,
                  status: editing.status,
                  link: editing.link ?? "",
                  notes: editing.notes ?? "",
                }
              : undefined
          }
          onSubmit={submitForm}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
