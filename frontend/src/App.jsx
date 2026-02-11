import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import AIAssistant from './components/AIAssistant';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Survey from './pages/Survey';
import Recommendations from './pages/Recommendations';
import Community from './pages/Community';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';


function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [userData, setUserData] = useState(null);

  return (
    <AuthProvider>
      <NotificationProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-hero-pattern">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/community" element={<Community />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Login - redirect to dashboard if already logged in */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />

              {/* Protected routes - require authentication */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/project/:projectId"
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                }
              />

              {/* Survey can be accessed without auth */}
              <Route
                path="/survey"
                element={
                  <Survey
                    setRecommendations={setRecommendations}
                    setUserData={setUserData}
                  />
                }
              />

              {/* Recommendations - keep accessible after survey */}
              <Route
                path="/recommendations"
                element={
                  <Recommendations
                    recommendations={recommendations}
                    userData={userData}
                  />
                }
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Settings */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Global AI Assistant */}
            <AIAssistant />
          </div>
        </Router>
      </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
