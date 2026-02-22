import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import AIAssistant from './components/AIAssistant';
import OnboardingTour from './components/OnboardingTour';
import ErrorBoundary from './components/ErrorBoundary';
import PageSkeleton from './components/PageSkeleton';
import CommandPalette from './components/CommandPalette';

// Lazy-loaded pages — code-split for faster initial load
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Survey = lazy(() => import('./pages/Survey'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Community = lazy(() => import('./pages/Community'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AISession = lazy(() => import('./pages/AISession'));
const Tasks = lazy(() => import('./pages/Tasks'));
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'));
const SkillsMap = lazy(() => import('./pages/SkillsMap'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Goals = lazy(() => import('./pages/Goals'));
const WeeklyCheckin = lazy(() => import('./pages/WeeklyCheckin'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const GenerateProject = lazy(() => import('./pages/GenerateProject'));


function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [userData, setUserData] = useState(null);

  return (
    <AuthProvider>
      <ThemeProvider>
      <NotificationProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-hero-pattern">
          <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
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
                path="/generate-project"
                element={
                  <ProtectedRoute>
                    <GenerateProject />
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

              {/* Leaderboard */}
              <Route path="/leaderboard" element={<Leaderboard />} />

              {/* AI Session */}
              <Route path="/ai-session" element={<ProtectedRoute><AISession /></ProtectedRoute>} />

              {/* Tasks */}
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />

              {/* Roadmap */}
              <Route path="/roadmap" element={<ProtectedRoute><RoadmapDetail /></ProtectedRoute>} />

              {/* Skills Map */}
              <Route path="/skills" element={<ProtectedRoute><SkillsMap /></ProtectedRoute>} />

              {/* Portfolio */}
              <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />

              {/* Goals & Settings */}
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />

              {/* Weekly Check-in */}
              <Route path="/weekly-checkin" element={<ProtectedRoute><WeeklyCheckin /></ProtectedRoute>} />

              {/* About */}
              <Route path="/about" element={<About />} />

              {/* Contact */}
              <Route path="/contact" element={<Contact />} />

              {/* Legal */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>

            {/* Global AI Assistant */}
            <AIAssistant />
            
            {/* Command Palette (Ctrl+K) */}
            <CommandPalette />
            
            {/* Onboarding Tour for new users */}
            <OnboardingTour />
          </div>
        </Router>
      </ToastProvider>
      </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
