import './styles/Features.css'

export default function Features() {
  const features = [
    {
      id: 1,
      title: "AI Match Scoring",
      badge: { text: "Core AI", bg: "#dbeafe", color: "#1d4ed8" },
      desc: "Proprietary ML model analyzes 50+ signals to give each role a precise compatibility percentage.",
      icon: "📋"
    },
    {
      id: 2,
      title: "Skill Gap Analysis",
      badge: { text: "Smart Insights", bg: "#ede9fe", color: "#5b21b6" },
      desc: "Instantly see what skills you're missing for top roles, with curated learning paths to close gaps fast.",
      icon: "📈"
    },
    {
      id: 3,
      title: "Application Tracking",
      badge: { text: "Workflow", bg: "#ecfeff", color: "#0e7490" },
      desc: "All your applications, status updates, and recruiter notes in one beautifully organized hub.",
      icon: "✓"
    }
  ]

  return (
    <section id="features" className="section section-gray features-section">
      <p className="section-label">Features</p>
      <h2 className="section-h2">Everything you need to get hired</h2>
      
      <div className="feat-grid">
        {features.map(feature => (
          <div key={feature.id} className="feat-card">
            <div className="feat-icon-wrap">
              <span style={{fontSize: '24px'}}>{feature.icon}</span>
            </div>
            <div>
              <p className="feat-title">
                {feature.title}
                <span className="feat-badge" style={{background: feature.badge.bg, color: feature.badge.color}}>
                  {feature.badge.text}
                </span>
              </p>
              <p className="feat-desc">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
