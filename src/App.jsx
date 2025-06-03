import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-movie"
          element={
            <ProtectedRoute>
              <AddMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-movie/:id"
          element={
            <ProtectedRoute>
              <EditMovie />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;