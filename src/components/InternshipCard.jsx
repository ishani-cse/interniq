
import React from 'react';
import { MapPin, Banknote, Bookmark } from 'lucide-react';

const InternshipCard = ({ title, company, match, location, stipend, tags }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
            🏢
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-blue-100">
          {match}% Match
        </span>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
          <MapPin size={14} className="text-gray-400" /> {location}
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
          <Banknote size={14} className="text-gray-400" /> ₹ {stipend}/month
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold rounded-md border border-gray-100">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
          Apply Now
        </button>
        <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Bookmark size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;