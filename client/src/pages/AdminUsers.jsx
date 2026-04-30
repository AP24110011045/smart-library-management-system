import { useEffect, useState } from 'react';
import api from '../services/api';
import { getError } from '../utils/errors';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-[2rem] bg-paper p-6 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Admin</p>
      <h1 className="font-display text-4xl font-bold">User Management</h1>
      {loading && <p className="mt-6 rounded-2xl bg-white p-4 font-bold text-ink/70">Loading users...</p>}
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active Books</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && users.length === 0 && <tr><td className="p-3 text-ink/60" colSpan="5">No users found.</td></tr>}
            {users.map((item) => (
              <tr key={item._id} className="border-b border-ink/5">
                <td className="p-3 font-bold">{item.name}</td>
                <td>{item.email}</td>
                <td className="capitalize">{item.role}</td>
                <td>{item.borrowedBooks?.length || 0}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
