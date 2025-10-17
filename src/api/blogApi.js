import api from './axios';

const getAllBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};

const createBlog = async (blogData) => {
  const isForm = typeof FormData !== 'undefined' && blogData instanceof FormData;
  const response = await api.post('/blogs', blogData, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return response.data;
};

const updateBlog = async (blogId, blogData) => {
  const isForm = typeof FormData !== 'undefined' && blogData instanceof FormData;
  const response = await api.put(`/blogs/${blogId}`, blogData, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return response.data;
};

const deleteBlog = async (blogId) => {
  const response = await api.delete(`/blogs/${blogId}`);
  return response.data;
};

export { getAllBlogs, createBlog, updateBlog, deleteBlog };
