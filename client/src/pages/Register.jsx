import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Field from '../components/Field';
import { useAuth } from '../context/AuthContext';
import { getError } from '../utils/errors';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cream p-4 font-body text-ink">
      <form onSubmit={submit} className="w-full max-w-lg rounded-[2rem] border border-ink/10 bg-paper p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-clay">Join the stacks</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Create account</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Field label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-red-700">{error}</p>}
        <button className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 font-bold text-cream">Register</button>
        <p className="mt-5 text-center text-sm text-ink/65">Already registered? <Link className="font-bold text-clay" to="/login">Sign in</Link></p>
      </form>
    </main>
  );
};

export default Register;
