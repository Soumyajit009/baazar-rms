import { useState, useEffect } from "react";
import { Plus, Trash2, ShieldCheck, Eye, EyeOff, Pencil, X } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminsSection({ showToast }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editShowPassword, setEditShowPassword] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const loadAdmins = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("admins")
      .select("*")
      .order("created_at", { ascending: true });
    if (fetchError) {
      console.error("Failed to load admins:", fetchError);
    } else {
      setAdmins(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password || !name.trim()) {
      setError("Fill in all fields.");
      return;
    }

    setSubmitting(true);
    const { data, error: fnError } = await supabase.functions.invoke("create-admin", {
      body: { username: username.trim(), password, name: name.trim() },
    });
    setSubmitting(false);

    if (fnError || data?.error) {
      setError(data?.error || fnError.message || "Failed to create admin.");
      return;
    }

    showToast("Admin created successfully");
    setUsername("");
    setPassword("");
    setName("");
    setShowForm(false);
    loadAdmins();
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Remove admin access for ${admin.name}?`)) return;

    const { data, error: fnError } = await supabase.functions.invoke("delete-admin", {
      body: { targetId: admin.id },
    });

    if (fnError || data?.error) {
      showToast(data?.error || fnError.message || "Failed to delete admin");
      return;
    }

    showToast("Admin removed");
    loadAdmins();
  };

  const openEdit = (admin) => {
    setEditingId(admin.id);
    setEditName(admin.name);
    setEditPassword("");
    setEditError("");
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPassword("");
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editName.trim()) {
      setEditError("Name can't be empty.");
      return;
    }

    setEditSubmitting(true);
    const { data, error: fnError } = await supabase.functions.invoke("update-admin", {
      body: {
        targetId: editingId,
        name: editName.trim(),
        password: editPassword || undefined,
      },
    });
    setEditSubmitting(false);

    if (fnError || data?.error) {
      setEditError(data?.error || fnError.message || "Failed to update admin.");
      return;
    }

    showToast("Admin updated");
    closeEdit();
    loadAdmins();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Admins</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-950 px-3 py-1.5 rounded-lg"
        >
          <Plus size={15} /> Add Admin
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddAdmin} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
              Username <span className="text-slate-400">(just the username, e.g. "hrname1")</span>
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. hrname1"
              className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Admin"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading...</p>
      ) : (
        <div className="space-y-2">
          {admins.map((admin, i) => (
            <div key={admin.id}>
              <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      {admin.name}
                      {admin.email.endsWith("@admin.mis") && (
                        <ShieldCheck size={13} className="text-blue-500" />
                      )}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Username: {admin.email.replace(/@admin\.(mis|hr)$/, "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                {!admin.email.endsWith("@admin.mis") && (
                  <button
                    onClick={() => openEdit(admin)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Pencil size={15} className="text-slate-400" />
                  </button>
                )}
                  {!admin.email.endsWith("@admin.mis") && (
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 size={15} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>

              {editingId === admin.id && (
                <form onSubmit={handleSaveEdit} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 mt-2 space-y-3 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Editing {admin.name}</p>
                    <button type="button" onClick={closeEdit} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                      <X size={14} className="text-slate-400" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                      New Password <span className="text-slate-400">(leave blank to keep current)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={editShowPassword ? "text" : "password"}
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => setEditShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {editShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {editError && <p className="text-xs text-red-500">{editError}</p>}

                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                  >
                    {editSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}