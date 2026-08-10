import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import AIChatBot from './components/AIChatBot';
import Navbar from './components/layouts/Navbar';
import { ApplicationProvider } from './contexts/applicationContext';
import { AuthProvider, useAuth } from './contexts/authContext';
import { SocketProvider } from './contexts/chatContext';
import { JobProvider } from './contexts/jobContext';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import JobsPage from './pages/JobsPage';
import LoginPage from './pages/LoginPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MyJobsPage from './pages/MyJobsPage';
import NotFoundPage from './pages/NotFoundPage';
import PostJobPage from './pages/PostJobPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ViewApplicantsPage from './pages/ViewApplicantsPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <ApplicationProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </ApplicationProvider>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const showChatBot = isAuthenticated && !['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-shell">
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: '18px',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            boxShadow: '0 20px 60px rgba(2, 6, 23, 0.35)',
          },
        }}
      />
      <main className="page-width relative z-10 w-full px-4 py-8 pb-24 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/my-jobs" element={<MyJobsPage />} />
          <Route path="/job/applicants/:jobId" element={<ViewApplicantsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat/:applicationId" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {showChatBot && <AIChatBot />}
    </div>
  );
};

export default App;
