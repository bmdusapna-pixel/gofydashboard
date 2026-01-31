import api from './axios';

export const settingsAPI = {
  // Get all settings
  getSettings: () => api.get('/admin/settings'),
  
  // Update settings
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // Add new blog entry
  addBlog: (data) => api.post('/admin/settings/blog', data)
};


