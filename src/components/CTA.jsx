import './styles/CTA.css'

export default function CTA({ onGetStartedClick }) {
  return (
    <section className="section section-white cta-section">
      <div className="cta-box">
        <div className="cta-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
          </svg>
        </div>
        <h2 className="cta-h2">Ready to get matched?</h2>
        <p className="cta-sub">Join thousands of students who found their perfect internship using AI. It only takes 60 seconds to get started.</p>
        <button className="btn-cta" onClick={onGetStartedClick}>
          Join for Free — It Takes 60 Seconds
          <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" style={{width: '16px', height: '16px'}}>
            <path d="M6 3l5 5-5 5"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
