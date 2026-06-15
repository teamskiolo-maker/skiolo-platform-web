"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Workshop {
  id: string;
  title: string;
  description: string;
  pricePaise: number;
  capacity: number;
  mode: "ONLINE" | "OFFLINE";
  startsAt: string;
  endsAt: string;
  venue: string | null;
  isPublished: boolean;
}

function toDateTimeLocal(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function WorkshopsPage() {
  const { getToken } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for Create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [pricePaise, setPricePaise] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [venue, setVenue] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit state
  const [editWorkshop, setEditWorkshop] = useState<Workshop | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const data = await apiFetch<Workshop[]>("/admin/workshops", { method: "GET", token });
      setWorkshops(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setFormError(null);
      const token = await getToken();
      
      const payload: any = {
        title,
        description,
        mode,
        pricePaise: Number(pricePaise),
        capacity: Number(capacity),
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        isPublished,
      };

      if (mode === "OFFLINE" && venue) {
        payload.venue = venue;
      }

      await apiFetch("/admin/workshops", { method: "POST", token, body: payload });
      
      // Reset form
      setTitle("");
      setDescription("");
      setMode("ONLINE");
      setPricePaise("");
      setCapacity("");
      setStartsAt("");
      setEndsAt("");
      setVenue("");
      setIsPublished(false);
      
      // Refresh list
      await fetchWorkshops();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      await apiFetch(`/admin/workshops/${id}`, {
        method: "PATCH",
        token,
        body: { isPublished: !currentStatus }
      });
      fetchWorkshops();
    } catch (err) {
      alert("Failed to toggle publish status");
    }
  };

  const handleEditSave = async () => {
    if (!editWorkshop) return;
    try {
      setEditSubmitting(true);
      setEditError(null);
      const token = await getToken();
      
      const payload: any = {
        title: editWorkshop.title,
        description: editWorkshop.description,
        mode: editWorkshop.mode,
        pricePaise: Number(editWorkshop.pricePaise),
        capacity: Number(editWorkshop.capacity),
        startsAt: new Date(editWorkshop.startsAt).toISOString(),
        endsAt: new Date(editWorkshop.endsAt).toISOString(),
        isPublished: editWorkshop.isPublished
      };

      if (editWorkshop.mode === "OFFLINE" && editWorkshop.venue) {
        payload.venue = editWorkshop.venue;
      }

      await apiFetch(`/admin/workshops/${editWorkshop.id}`, {
        method: "PATCH",
        token,
        body: payload
      });
      
      setEditWorkshop(null);
      fetchWorkshops();
    } catch (err: any) {
      setEditError(err.message || "Failed to update workshop");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* List Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Workshops</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading workshops...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : workshops.length === 0 ? (
          <p className="text-sm text-gray-500">No workshops yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Starts At</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((w) => (
                  <tr key={w.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{w.title}</td>
                    <td className="px-4 py-3">{w.mode}</td>
                    <td className="px-4 py-3">{new Date(w.startsAt).toLocaleString()}</td>
                    <td className="px-4 py-3">₹{(w.pricePaise / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {w.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditWorkshop({...w, startsAt: toDateTimeLocal(w.startsAt), endsAt: toDateTimeLocal(w.endsAt)})}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handlePublishToggle(w.id, w.isPublished)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          {w.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">New Workshop</h2>
        {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as "ONLINE" | "OFFLINE")} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input 
              type="number" 
              value={capacity} 
              onChange={(e) => setCapacity(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price in paise (e.g. 199900 = ₹1999)</label>
            <input 
              type="number" 
              value={pricePaise} 
              onChange={(e) => setPricePaise(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {mode === "OFFLINE" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input 
                type="text" 
                value={venue} 
                onChange={(e) => setVenue(e.target.value)} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
            <input 
              type="datetime-local" 
              value={startsAt} 
              onChange={(e) => setStartsAt(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ends At</label>
            <input 
              type="datetime-local" 
              value={endsAt} 
              onChange={(e) => setEndsAt(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="isPublishedW"
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="isPublishedW" className="text-sm font-medium text-gray-700">Published</label>
          </div>
          <div className="md:col-span-2">
            <button 
              onClick={handleCreate}
              disabled={submitting}
              className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Workshop"}
            </button>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Workshop</h2>
            {editError && <p className="text-sm text-red-600 mb-4">{editError}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editWorkshop.title} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, title: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editWorkshop.description} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, description: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <select 
                  value={editWorkshop.mode} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, mode: e.target.value as "ONLINE" | "OFFLINE" })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  value={editWorkshop.capacity} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, capacity: Number(e.target.value) })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price in paise</label>
                <input 
                  type="number" 
                  value={editWorkshop.pricePaise} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, pricePaise: Number(e.target.value) })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              {editWorkshop.mode === "OFFLINE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input 
                    type="text" 
                    value={editWorkshop.venue || ""} 
                    onChange={(e) => setEditWorkshop({ ...editWorkshop, venue: e.target.value })} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
                <input 
                  type="datetime-local" 
                  value={editWorkshop.startsAt} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, startsAt: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ends At</label>
                <input 
                  type="datetime-local" 
                  value={editWorkshop.endsAt} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, endsAt: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="editIsPublishedW"
                  checked={editWorkshop.isPublished} 
                  onChange={(e) => setEditWorkshop({ ...editWorkshop, isPublished: e.target.checked })} 
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="editIsPublishedW" className="text-sm font-medium text-gray-700">Published</label>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setEditWorkshop(null)}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditSave}
                  disabled={editSubmitting}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 disabled:opacity-50"
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
