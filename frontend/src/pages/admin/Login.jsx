import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/admin/Toast';
import { errorMessage } from '../../api/axiosInstance';
import avmlogo from '../../assets/logo-256.png';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
        <img src={avmlogo} alt="Adarsh Vidya Mandir logo" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-gold-500/30" />
        <h1 className="text-center text-xl font-bold text-navy-900">Adarsh Vidya Mandir</h1>
        <p className="mb-6 text-center text-sm text-gold-600">Admin Login</p>

        <label className="label flex items-center gap-1.5" htmlFor="u">
          <User size={14} className="text-gold-600" /> Username
        </label>
        <input
          id="u"
          className="field mb-4"
          placeholder="Enter your username"
          autoFocus
          required
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label className="label flex items-center gap-1.5" htmlFor="p">
          <Lock size={14} className="text-gold-600" /> Password
        </label>
        <div className="relative mb-6">
          <input
            id="p"
            type={showPassword ? 'text' : 'password'}
            className="field pr-11"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button className="btn-gold w-full" disabled={busy}>
          <LogIn size={16} /> {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
