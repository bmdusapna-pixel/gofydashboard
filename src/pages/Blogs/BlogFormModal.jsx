import React, { useEffect, useMemo, useState } from "react";

const defaultValues = {
  title: "",
  content: "",
  author: "",
  tags: [],
  imageUrl: "",
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const BlogFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [values, setValues] = useState(defaultValues);

  const titleText = useMemo(() => (initialData ? "Edit Blog" : "New Blog"), [initialData]);

  useEffect(() => {
    if (initialData) {
      setValues({
        title: initialData.title || "",
        content: initialData.content || "",
        author: initialData.author || "",
        tags: initialData.tags || [],
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{titleText}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ ...values, tags: toArray(values.tags) });
          }}
          className="p-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={values.title}
                onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="Post title"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                value={values.author}
                onChange={(e) => setValues((v) => ({ ...v, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="Author name"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              rows={6}
              value={values.content}
              onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
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
                value={Array.isArray(values.tags) ? values.tags.join(", ") : values.tags}
                onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="e.g. toys, sale"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={values.imageUrl}
                onChange={(e) => setValues((v) => ({ ...v, imageUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                placeholder="https://"
              />
            </div>
          </div>
          {values.imageUrl && (
            <div className="pt-2">
              <div className="text-xs text-gray-500 mb-2">Preview</div>
              <img src={values.imageUrl} alt="Preview" className="h-32 w-full object-cover rounded border border-gray-200" />
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white">
              {initialData ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
