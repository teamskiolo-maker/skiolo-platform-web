"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Course {
  id: string;
  title: string;
  description: string;
  pricePaise: number;
  thumbnail: string | null;
  accessUrl: string | null;
  isPublished: boolean;
}

export default function CoursesPage() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for Create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePaise, setPricePaise] = useState("");
  const [accessUrl, setAccessUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit state
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const data = await apiFetch<Course[]>("/admin/courses", { method: "GET", token });
      setCourses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
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
        pricePaise: Number(pricePaise),
        isPublished,
      };

      if (accessUrl) payload.accessUrl = accessUrl;

      await apiFetch("/admin/courses", { method: "POST", token, body: payload });
      
      // Reset form
      setTitle("");
      setDescription("");
      setPricePaise("");
      setAccessUrl("");
      setIsPublished(false);
      
      // Refresh list
      await fetchCourses();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishToggle = async (courseId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      await apiFetch(`/admin/courses/${courseId}`, {
        method: "PATCH",
        token,
        body: { isPublished: !currentStatus }
      });
      fetchCourses();
    } catch (err) {
      alert("Failed to toggle publish status");
    }
  };

  const handleEditSave = async () => {
    if (!editCourse) return;
    try {
      setEditSubmitting(true);
      setEditError(null);
      const token = await getToken();
      const payload: any = {
        title: editCourse.title,
        description: editCourse.description,
        pricePaise: Number(editCourse.pricePaise),
        isPublished: editCourse.isPublished
      };

      if (editCourse.thumbnail) payload.thumbnail = editCourse.thumbnail;
      if (editCourse.accessUrl) payload.accessUrl = editCourse.accessUrl;

      await apiFetch(`/admin/courses/${editCourse.id}`, {
        method: "PATCH",
        token,
        body: payload
      });
      setEditCourse(null);
      fetchCourses();
    } catch (err: any) {
      setEditError(err.message || "Failed to update course");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* List Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading courses...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                    <td className="px-4 py-3">₹{(c.pricePaise / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditCourse({...c})}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handlePublishToggle(c.id, c.isPublished)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          {c.isPublished ? "Unpublish" : "Publish"}
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
        <h2 className="text-xl font-semibold mb-4">New Course</h2>
        {formError && <p className="text-sm text-red-600 mb-4">{formError}</p>}
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              rows={3}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course access link (e.g. external LMS URL)</label>
            <input 
              type="url" 
              value={accessUrl} 
              onChange={(e) => setAccessUrl(e.target.value)} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPublished"
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Published</label>
          </div>
          <button 
            onClick={handleCreate}
            disabled={submitting}
            className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </section>

      {/* Edit Modal */}
      {editCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
            {editError && <p className="text-sm text-red-600 mb-4">{editError}</p>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editCourse.title} 
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editCourse.description} 
                  onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price in paise</label>
                <input 
                  type="number" 
                  value={editCourse.pricePaise} 
                  onChange={(e) => setEditCourse({ ...editCourse, pricePaise: Number(e.target.value) })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course access link</label>
                <input 
                  type="url" 
                  value={editCourse.accessUrl || ""} 
                  onChange={(e) => setEditCourse({ ...editCourse, accessUrl: e.target.value })} 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="editIsPublished"
                  checked={editCourse.isPublished} 
                  onChange={(e) => setEditCourse({ ...editCourse, isPublished: e.target.checked })} 
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="editIsPublished" className="text-sm font-medium text-gray-700">Published</label>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setEditCourse(null)}
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
