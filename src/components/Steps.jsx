import './styles/Steps.css'

export default function Steps() {
  const steps = [
    {
      id: 1,
      num: "01",
      title: "Create Your Profile",
      desc: "Answer 5 quick questions about your skills, experience, and what you're looking for."
    },
    {
      id: 2,
      num: "02",
      title: "AI Analyzes You",
      desc: "Our system runs 50+ compatibility checks to understand your unique profile."
    },
    {
      id: 3,
      num: "03",
      title: "Get Matched",
      desc: "Receive a curated list of internships ranked by compatibility, from highest to lowest."
    },
    {
      id: 4,
      num: "04",
      title: "Apply with Confidence",
      desc: "Use our templates and AI suggestions to craft a tailored application that stands out."
    }
  ]

  return (
    <section id="how-it-works" className="section section-white steps-section">
      <p className="section-label">How It Works</p>
      <h2 className="section-h2">4 steps to your dream internship</h2>
      <p className="section-sub">From profile to placement in minutes</p>
      
      <div className="steps-grid">
        {steps.map(step => (
          <div key={step.id} className="step-card">
            <div className="step-top">
              <div className="step-icon" style={{background: '#f0f4ff'}}>
                <span style={{fontSize: '20px'}}>
                  {step.id === 1 && '👤'}
                  {step.id === 2 && '🤖'}
                  {step.id === 3 && '🎯'}
                  {step.id === 4 && '📝'}
                </span>
              </div>
              <div className="step-num">{step.num}</div>
            </div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
