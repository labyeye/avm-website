import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/admin/Toast';
import { errorMessage } from '../../api/axiosInstance';
import { asset, withFallback } from '../../api/assets';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.username, form.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(errorMessage(err, 'Login failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-950 to-navy-700 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 text-slate-800 shadow-2xl">
        <img src={asset('logo.png')} onError={withFallback(96, 96, 'AVM')} alt="AVM logo" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />
        <h1 className="text-center text-xl font-bold text-navy-900">Adarsh Vidya Mandir</h1>
        <p className="mb-6 text-center text-sm text-gold-600">Admin Login</p>
        <label className="label" htmlFor="u">Username</label>
        <input id="u" className="field mb-4" autoFocus required autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <label className="label" htmlFor="p">Password</label>
        <input id="p" type="password" className="field mb-6" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-gold w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  );
}
