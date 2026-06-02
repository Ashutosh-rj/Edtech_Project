import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CourseCatalog } from './pages/CourseCatalog';
import { CourseDetail } from './pages/CourseDetail';
import { LecturePlayer } from './pages/LecturePlayer';
import { ManageCourses } from './pages/ManageCourses';
import { CourseForm } from './pages/CourseForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfileSettings } from './pages/ProfileSettings';
import { QuizPlayer } from './pages/QuizPlayer';
import { QuizCreator } from './pages/QuizCreator';

import React from 'react';

/** Redirects unauthenticated users to /login. */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedInUser } = useAuth();
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/** Redirects non-admin users to /. */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedInUser, role } = useAuth();
  if (!loggedInUser) return <Navigate to="/login" replace />;
  if ((role ?? '').toUpperCase() !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
};

/** Redirects users without INSTRUCTOR or ADMIN role. */
const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedInUser, role } = useAuth();
  if (!loggedInUser) return <Navigate to="/login" replace />;
  const r = (role ?? '').toUpperCase();
  if (r !== 'INSTRUCTOR' && r !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses"  element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Protected — all authenticated users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="/lectures/:courseId" element={<ProtectedRoute><LecturePlayer /></ProtectedRoute>} />
          <Route path="/quizzes/:id" element={<ProtectedRoute><QuizPlayer /></ProtectedRoute>} />

          {/* Protected — INSTRUCTOR or ADMIN only */}
          <Route path="/manage-courses"        element={<InstructorRoute><ManageCourses /></InstructorRoute>} />
          <Route path="/manage-courses/new"    element={<InstructorRoute><CourseForm /></InstructorRoute>} />
          <Route path="/manage-courses/edit/:id" element={<InstructorRoute><CourseForm /></InstructorRoute>} />
          <Route path="/manage-quizzes/new"    element={<InstructorRoute><QuizCreator /></InstructorRoute>} />

          {/* Protected — ADMIN only */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
