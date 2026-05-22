import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/Profile';
import Trains from './pages/user/Trains'; 
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminProfile from './pages/admin/Profile';
import ManageTrainOptions from './pages/admin/ManageTrainOptions';
import AddTrainForm from './pages/admin/AddTrainForm';
import TrainList from './pages/admin/TrainList';
import EditTrainForm from './pages/admin/EditTrainForm';
import Reservation from './pages/user/reservation'; 
import BookReservation from './pages/user/BookReservation';
import CheckReservationStatus from './pages/user/CheckReservationStatus';
import CancelReservation from './pages/user/CancelReservation';
import MyBookings from './pages/user/MyBookings';
import Payments from './pages/user/Payments'; // ✅ Added this

function App() {
  return (
    <Router>
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        
        {/* User Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user/trains" element={<Trains />} /> 
        <Route path="/user/payments" element={<Payments />} /> {/* ✅ New Payments Route */}

        {/* Reservation Routes */}
        <Route path="/reservations" element={<Reservation />} />
        <Route path="/reservations/book" element={<BookReservation />} />
        <Route path="/reservations/status" element={<CheckReservationStatus />} />
        <Route path="/reservations/cancel" element={<CancelReservation />} />
        <Route path="/reservations/my-bookings" element={<MyBookings />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<ManageUsers />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin/trains" element={<ManageTrainOptions />} />
        <Route path="/admin/train/add" element={<AddTrainForm />} />
        <Route path="/admin/train/list" element={<TrainList />} />
        <Route path="/admin/trains/edit/:id" element={<EditTrainForm />} />

        {/* Fallback Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
