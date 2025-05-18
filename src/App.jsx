
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage'
import MatchPage from './pages/MatchPage'
import TestPage from './pages/TestPage'
import ProfilePage from './pages/ProfilePage'

import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/personality" element={<TestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
