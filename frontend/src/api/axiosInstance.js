import axios from 'axios';

const axiosInstance = axios.create({
  // Empty = same origin: Vite's dev proxy / Vercel's rewrite forward /backend/* to the PHP server.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Session expired → let AuthContext clear local state.
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    if (err.response?.status === 401 && url.includes('/admin/') && !url.includes('login.php')) {
      window.dispatchEvent(new Event('avm:unauthorized'));
    }
    return Promise.reject(err);
  }
);

// Pull a readable message out of an axios error.
export const errorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || (err?.code === 'ERR_NETWORK' ? 'Cannot reach the server' : fallback);

export default axiosInstance;
