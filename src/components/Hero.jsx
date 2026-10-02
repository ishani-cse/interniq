import './styles/Hero.css'

export default function Hero({ onGetStartedClick }) {
  const handleChipClick = (chipText) => {
    console.log('Clicked chip:', chipText)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search submitted')
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        {/* LEFT SIDE */}
        <div className="hero-left">
          <div className="hero-badge">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12.5c-3 0-5.5-2.5-5.5-5.5S5 2.5 8 2.5s5.5 2.5 5.5 5.5S11 13.5 8 13.5z" fill="#3b82f6"/>
              <path d="M8 5v3l2.5 1.5" stroke="#3b82f6" strokeWidth="1" fill="none"/>
            </svg>
            <span>LAUNCHING SOON</span>
          </div>

          <h1 className="hero-h1">
            Find Your Perfect <span className="accent">Internship</span>
          </h1>

          <p className="hero-sub">
            AI-powered matching engine analyzes your skills and finds the perfect internship opportunities. Join thousands of students already using InternIQ.
          </p>

          <form className="search-wrap" onSubmit={handleSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Search internships, companies, roles..." />
          </form>

          <div className="chips">
            <div className="chip" onClick={() => handleChipClick('Tech')}>💻 Tech & Software</div>
            <div className="chip" onClick={() => handleChipClick('Design')}>🎨 Design & UX</div>
            <div className="chip" onClick={() => handleChipClick('Business')}>📊 Business & Finance</div>
          </div>

          <div className="social-proof">
            <div className="avatars">
              <div className="avatar" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}></div>
              <div className="avatar" style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}></div>
              <div className="avatar" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}></div>
              <div className="avatar" style={{background: 'linear-gradient(135deg, #43e97b, #38f9d7)'}}></div>
            </div>
            <p><strong>2,340+ students</strong> <span className="bl">found their dream internship</span> this month</p>
          </div>
        </div>

        {/* RIGHT SIDE - PREVIEW CARD */}
        <div className="preview-card">
          <div className="pcard">
            <div className="pcard-head">
              <div className="pcard-head-text">
                <p>AI Match Score</p>
                <h3>Google</h3>
              </div>

              {/* 87% RING (fixed: white on blue so it's visible) */}
              <div
                className="ring"
                style={{
                  position: 'relative',
                  width: 52,
                  height: 52,
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  width="52"
                  height="52"
                  style={{ transform: 'rotate(-90deg)', display: 'block' }}
                >
                  {/* background track */}
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="8"
                  />
                  {/* 87% progress: circumference ≈ 264, offset = 264 * (1 - 0.87) ≈ 34 */}
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset="34"
                  />
                </svg>
                <div
                  className="ring-inner"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    background: 'none',
                  }}
                >
                  87%
                </div>
              </div>
            </div>

            <div className="pcard-row">
              <div className="co-icon" style={{background: '#eff6ff'}}>🔹</div>
              <div className="pcard-row-info">
                <p>Python Skills</p>
                <div className="bar-row">
                  <div className="bar-track"><div className="bar-fill" style={{width: '92%'}}></div></div>
                  <div className="bar-pct">92%</div>
                </div>
              </div>
            </div>

            <div className="pcard-row">
              <div className="co-icon" style={{background: '#fef3c7'}}>⚙️</div>
              <div className="pcard-row-info">
                <p>React Experience</p>
                <div className="bar-row">
                  <div className="bar-track"><div className="bar-fill" style={{width: '78%'}}></div></div>
                  <div className="bar-pct">78%</div>
                </div>
              </div>
            </div>

            <div className="pcard-row blur-row">
              <div className="co-icon">📊</div>
              <div className="pcard-row-info">
                <p>Data Analysis</p>
                <div className="bar-row">
                  <div className="bar-track"><div className="bar-fill" style={{width: '45%'}}></div></div>
                  <div className="bar-pct">45%</div>
                </div>
              </div>
            </div>

            <div className="pcard-unlock">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="12" height="8" rx="1"/>
                <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
              </svg>
              <p>2 more skills locked</p>
              <button className="btn-xs" onClick={onGetStartedClick}>Unlock</button>
            </div>

            <div className="float-badge">
              <div className="green-dot"></div>
              <span>✨ AI Analyzing Your Profile</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}