import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ResumeProvider } from './context/ResumeContext'
import RequireResume from './components/RequireResume'
import './components/styles/global-dark-mode.css'
import './components/styles/tailwind-dark-overrides.css'
// Landing Page Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Steps from './components/Steps'
import Stats from './components/Stats'
import CTA from './components/CTA'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
// Dashboard Page
import Dashboard from './pages/Dashboard' 
import ResumeUploadPage from './pages/ResumeUpload'
import InternshipsRecommended from './pages/InternshipsRecommended'
import AppliedInternships from './pages/AppliedInternships'
import SavedInternships from './pages/SavedInternships'
import Profile from './components/Profile'
import Settings from './components/Settings'
import { SavedProvider } from './context/SavedContext'
import './styles/App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const openLogin = () => { setShowLogin(true); setShowSignup(false); }
  const openSignup = () => { setShowSignup(true); setShowLogin(false); }
  const closeLogin = () => setShowLogin(false)
  const closeSignup = () => setShowSignup(false)
  const toggleForm = () => { setShowLogin(!showLogin); setShowSignup(!showSignup); }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal')) {
        setShowLogin(false); setShowSignup(false);
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <ThemeProvider>
      <ResumeProvider>
         <SavedProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* --- LANDING PAGE ROUTE --- */}
              <Route path="/" element={
                <>
                  <Navbar onLoginClick={openLogin} onSignupClick={openSignup} />
                  <Hero onGetStartedClick={openLogin} />
                  <Features />
                  <Steps />
                  <Stats />
                  <CTA onGetStartedClick={openLogin} />
                  <Footer />
                  
                  {showLogin && (
                    <LoginModal onClose={closeLogin} onToggle={toggleForm} />
                  )}
                  {showSignup && (
                    <SignupModal onClose={closeSignup} onToggle={toggleForm} />
                  )}
                </>
              } />

              {/* --- DASHBOARD ROUTE --- */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/resume" element={<ResumeUploadPage />} />

              {/* Sirf Recommended locked hai: resume upload hone tak /resume pe redirect */}
              <Route path="/internships" element={
                <RequireResume><InternshipsRecommended /></RequireResume>
              } />

              <Route path="/applied" element={<AppliedInternships />} />
              <Route path="/saved" element={<SavedInternships />} />
            </Routes>
          </div>
        </Router>
        </SavedProvider>
      </ResumeProvider>
    </ThemeProvider>
  )
}

export default App