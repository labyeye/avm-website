import api from './axiosInstance';

const P = '/backend/api/public';
const data = (p) => p.then((r) => r.data.data);

export const getGallery = () => data(api.get(`${P}/gallery.php`));
export const getTestimonials = () => data(api.get(`${P}/testimonials.php`));
export const getNotices = () => data(api.get(`${P}/notices.php`));
export const getSettings = () => data(api.get(`${P}/settings.php`));
export const submitAdmission = (body) => data(api.post(`${P}/admissions.php`, body));
export const downloadUrl = (id) => `${api.defaults.baseURL}${P}/download.php?id=${id}`;
export const downloadPageUrl = (slug) => `${api.defaults.baseURL}${P}/download.php?page=${encodeURIComponent(slug)}`;
export const getPage = (slug) => data(api.get(`${P}/pages.php`, { params: { slug } }));
export const sendContact = (body) => data(api.post(`${P}/contact.php`, body));
