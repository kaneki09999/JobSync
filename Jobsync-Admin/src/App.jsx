import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AdminLogin from './Pages/Admin/AdminLogin';
import { AuthProvider } from './AuthContext';
import AdminApplicants from './Pages/Admin/adminapplicants';
import Dashboard from './Pages/Admin/AdminDashboard';
import AdminEmployers from './Pages/Admin/adminemployers';
import ApplicantPreviewPage from './Pages/Admin/applicantdetailspreview';
import EmployerPreviewPage from './Pages/Admin/employerdetailspreview';
import { useAuth } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './loader.css';

function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

function Layout({userId, setUserId}) {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path='/' element={<AdminLogin setUserId={setUserId} />} />
      <Route path='/admindashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
      <Route path='/adminapplicants' element={<ProtectedRoute> <AdminApplicants /> </ProtectedRoute>  } />
      <Route path='/adminemployers' element={<ProtectedRoute> <AdminEmployers /> </ProtectedRoute>} />
      <Route path='/adminapplicants/applicantdetailspreview' element={<ProtectedRoute> <ApplicantPreviewPage /> </ProtectedRoute>} />
      <Route path='/adminemployers/employerdetailspreview' element={<ProtectedRoute> <EmployerPreviewPage /> </ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
