import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import AdminPanel from './pages/AdminPanel';
import AdminUsers from './pages/AdminUsers';
import BookDetails from './pages/BookDetails';
import BookForm from './pages/BookForm';
import BooksList from './pages/BooksList';
import Dashboard from './pages/Dashboard';
import IssueBook from './pages/IssueBook';
import Login from './pages/Login';
import MyHistory from './pages/MyHistory';
import Register from './pages/Register';
import ReturnBook from './pages/ReturnBook';

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route element={<ProtectedRoute roles={['student']} />}>
          <Route path="/issue-book" element={<IssueBook />} />
          <Route path="/return-book" element={<ReturnBook />} />
          <Route path="/my-history" element={<MyHistory />} />
        </Route>
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/add-book" element={<BookForm />} />
          <Route path="/edit-book/:id" element={<BookForm edit />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default App;
