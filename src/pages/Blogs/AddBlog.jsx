import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../api/blogApi";
import { toast } from "react-toastify";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const AddBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [mode, setMode] = useState("upload"); // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const baseUrlMissing = useMemo(() => !import.meta.env.VITE_BASE_URL, []);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (mode === "upload" && imageFile) {
        const form = new FormData();
        form.append("title", title);
        form.append("content", content);
        form.append("author", author);
        toArray(tags).forEach((t) => form.append("tags", t));
        form.append("image", imageFile);
        await createBlog(form);
      } else {
        await createBlog({ title, content, author, tags: toArray(tags), imageUrl });
      }
      toast.success("Blog created");
      navigate("/blogs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
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
            <h1 className="text-lg font-semibold text-gray-800">Add Blog</h1>
            <p className="text-xs text-gray-500">Create a new blog post</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="Post title"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
              placeholder="Write your content here..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="e.g. toys, sale"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-2">
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`px-3 py-1.5 text-xs rounded-full border ${mode === "upload" ? "bg-primary-100 text-primary-700 border-primary-200" : "border-gray-200 text-gray-700"}`}
              >
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`px-3 py-1.5 text-xs rounded-full border ${mode === "url" ? "bg-primary-100 text-primary-700 border-primary-200" : "border-gray-200 text-gray-700"}`}
              >
                Use Image URL
              </button>
            </div>

            {mode === "upload" ? (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                />
                {preview && (
                  <img src={preview} alt="Preview" className="mt-3 h-40 w-full object-cover rounded border border-gray-200" />
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                  placeholder="https://"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-3 h-40 w-full object-cover rounded border border-gray-200" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white">
              {submitting ? "Saving..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddBlog;
