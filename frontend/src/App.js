import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Error404 from './pages/Error404';

// Private Route
import PrivateRoute from './components/Common/PrivateRoute';

// Styles
import './styles/App.css';
import './styles/Auth.css';
import './styles/Dashboard.css';
import './styles/Components.css';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <div className="page-container">
            <Header />
            <div className="main-content flex">
              <Sidebar />
              <div className="flex-1">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/notifications" 
                    element={
                      <PrivateRoute>
                        <Notifications />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="*" element={<Error404 />} />
                </Routes>
              </div>
            </div>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;