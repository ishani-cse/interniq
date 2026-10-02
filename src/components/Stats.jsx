import React from 'react';

const StatsCard = ({ title, value, subtitle, linkText, icon, iconBg }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
      
      <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
        {linkText} →
      </button>
    </div>
  );
};

export default StatsCard;