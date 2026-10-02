import './styles/Navbar.css'

export default function Navbar({ onLoginClick, onSignupClick }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <div className="nav-logo-icon">
                <svg viewBox="0 0 16 16" fill="none" style={{width: '14px', height: '14px'}}>
                  <path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9l-3 1.5.5-3.5L3 4.5 6.5 4 8 1z" fill="white"/>
                </svg>
              </div>
        <span className="nav-brand">InternIQ</span>
      </div>

      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
      </div>

      <div className="nav-btns">
        <button className="btn-blue" onClick={onSignupClick}>Sign Up</button>
      </div>
    </nav>
  )
}
