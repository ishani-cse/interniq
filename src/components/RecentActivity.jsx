import React from 'react';

const RecentActivity = () => {
  const activities = [
    { text: "You applied to Data Science Intern at TechCorp Solutions", time: "2 hours ago", type: "applied" },
    { text: "New internship recommendation: ML Engineer at AI Innovations", time: "5 hours ago", type: "recommendation" },
    { text: "Your profile was viewed by WebDev Studios", time: "Yesterday", type: "view" },
    { text: "Application deadline approaching: Frontend Developer at StartUp Hub", time: "Yesterday", type: "deadline" }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'applied':
        return (
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        );
      case 'recommendation':
        return (
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        );
      case 'view':
        return (
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        );
      case 'deadline':
        return (
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">Recent Activity</h3>
      
      <div className="space-y-6 relative">
        {activities.map((activity, index) => (
          <div key={index} className="relative flex items-center gap-4">
            {getIcon(activity.type)}
            <div>
              <p className="text-sm font-medium text-gray-800">{activity.text}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;