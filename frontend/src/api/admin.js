import api from './axiosInstance';

const A = '/backend/api/admin';
const data = (p) => p.then((r) => r.data.data);

export const login = (username, password) => data(api.post(`${A}/login.php`, { username, password }));
export const logout = () => data(api.get(`${A}/logout.php`));
export const getStats = () => data(api.get(`${A}/stats.php`));

export const getAdmissions = () => data(api.get(`${A}/admissions.php`));
export const deleteAdmission = (id) => data(api.delete(`${A}/admissions.php`, { params: { id } }));

// Generic CRUD helpers for gallery / testimonials / notices
const crud = (name) => ({
  list: () => data(api.get(`${A}/${name}.php`)),
  create: (body) => data(api.post(`${A}/${name}.php`, body)),
  update: (id, body) => data(api.put(`${A}/${name}.php`, body, { params: { id } })),
  remove: (id) => data(api.delete(`${A}/${name}.php`, { params: { id } })),
  removeMany: (ids) => data(api.delete(`${A}/${name}.php`, { params: { ids: ids.join(',') } })),
});

export const galleryApi = crud('gallery');
export const testimonialsApi = crud('testimonials');
export const noticesApi = crud('notices');

export const getAdminSettings = () => data(api.get(`${A}/settings.php`));
export const updateSettings = (body) => data(api.put(`${A}/settings.php`, body));

export const getPages = () => data(api.get(`${A}/pages.php`));
export const getPage = (slug) => data(api.get(`${A}/pages.php`, { params: { slug } }));
export const updatePage = (slug, body) => data(api.put(`${A}/pages.php`, body, { params: { slug } }));
export const pageItemsApi = {
  list: (slug) => data(api.get(`${A}/page_items.php`, { params: { page_slug: slug } })),
  create: (body) => data(api.post(`${A}/page_items.php`, body)),
  update: (id, body) => data(api.put(`${A}/page_items.php`, body, { params: { id } })),
  remove: (id) => data(api.delete(`${A}/page_items.php`, { params: { id } })),
};
export const getMessages = () => data(api.get(`${A}/contact_messages.php`));
export const deleteMessage = (id) => data(api.delete(`${A}/contact_messages.php`, { params: { id } }));

export const uploadImage = (file) => {
  const body = new FormData();
  body.append('image', file);
  return data(api.post(`${A}/upload.php`, body, { headers: { 'Content-Type': 'multipart/form-data' } }));
};

export const uploadVideo = (file, onProgress) => {
  const body = new FormData();
  body.append('video', file);
  return data(api.post(`${A}/upload_video.php`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
  }));
};

export const uploadFile = (file) => {
  const body = new FormData();
  body.append('file', file);
  return data(api.post(`${A}/upload_file.php`, body, { headers: { 'Content-Type': 'multipart/form-data' } }));
};

export const eventsApi = crud('events');
export const eventMediaApi = {
  list: (event_id) => data(api.get(`${A}/event_media.php`, { params: { event_id } })),
  create: (body) => data(api.post(`${A}/event_media.php`, body)),
  update: (id, body) => data(api.put(`${A}/event_media.php`, body, { params: { id } })),
  remove: (id) => data(api.delete(`${A}/event_media.php`, { params: { id } })),
};
