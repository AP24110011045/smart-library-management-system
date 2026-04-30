import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Field from '../components/Field';
import { useAuth } from '../context/AuthContext';
import { getError } from '../utils/errors';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@library.com', password: 'password123' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cream p-4 font-body text-ink">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-paper p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-clay">Smart Library</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Sign in</h1>
        <div className="mt-8 space-y-4">
          <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-red-700">{error}</p>}
        <button className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 font-bold text-cream">Login</button>
        <p className="mt-5 text-center text-sm text-ink/65">New here? <Link className="font-bold text-clay" to="/register">Create account</Link></p>
      </form>
    </main>
  );
};

export default Login;
