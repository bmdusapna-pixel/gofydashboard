import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "../../api/blogApi";
import BlogFormModal from "./BlogFormModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-gray-200">
    <div className="text-6xl mb-4">📝</div>
    <h3 className="text-lg font-semibold text-gray-800">No blog posts yet</h3>
    <p className="text-gray-600 mt-1 text-sm">Create your first blog post to get started.</p>
    <button onClick={onCreate} className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm">
      New Post
    </button>
  </div>
);

const BlogRow = ({ blog, onEdit, onDelete }) => (
  <tr className="border-b border-gray-100">
    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{blog.title}</td>
    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[320px]">{blog.content}</td>
    <td className="px-4 py-3 text-sm text-gray-700">{blog.author || "-"}</td>
    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{blog.date ? new Date(blog.date).toLocaleDateString() : "-"}</td>
    <td className="px-4 py-3 text-xs text-gray-700">
      <div className="flex flex-wrap gap-1">
        {(blog.tags || []).map((t, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{t}</span>
        ))}
      </div>
    </td>
    <td className="px-4 py-3">
      {blog.imageUrl ? (
        <img src={blog.imageUrl} alt={blog.title} className="h-10 w-16 object-cover rounded border border-gray-200" />
      ) : (
        <span className="text-xs text-gray-400">No Image</span>
      )}
    </td>
    <td className="px-4 py-3 text-right whitespace-nowrap">
      <button onClick={() => onEdit(blog)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 mr-2">Edit</button>
      <button onClick={() => onDelete(blog)} className="px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
    </td>
  </tr>
);

const BlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const baseUrlMissing = useMemo(() => !import.meta.env.VITE_BASE_URL, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const created = await createBlog(payload);
      setBlogs((prev) => [created, ...prev]);
      toast.success("Blog created");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
      throw err;
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const updated = await updateBlog(id, payload);
      setBlogs((prev) => prev.map((b) => (b._id === id ? updated : b)));
      toast.success("Blog updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
      throw err;
    }
  };

  const handleDelete = async (blog) => {
    if (!confirm(`Delete \"${blog.title}\"?`)) return;
    try {
      await deleteBlog(blog._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      toast.success("Blog deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 bg-primary-50">
      {baseUrlMissing && (
        <div className="mb-4 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm">
          API base URL is not configured. Set VITE_BASE_URL to enable blog management.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-primary-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Blog Management</h1>
            <p className="text-xs text-gray-500">Create, edit, and remove blog posts</p>
          </div>
          <button
            onClick={() => navigate("/blogs/add-new")}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
          >
            New Post
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-sm">Loading...</div>
          ) : blogs.length === 0 ? (
            <EmptyState onCreate={() => navigate("/blogs/add-new")} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {blogs.map((b) => (
                    <BlogRow key={b._id} blog={b} onEdit={(blog) => { setEditing(blog); setIsModalOpen(true); }} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <BlogFormModal
        isOpen={isModalOpen}
        initialData={editing}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (values) => {
          if (editing?._id) {
            await handleUpdate(editing._id, values);
          } else {
            await handleCreate(values);
          }
          setIsModalOpen(false);
        }}
      />

    </main>
  );
};

export default BlogsPage;
