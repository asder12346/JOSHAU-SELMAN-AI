
import React from 'react';

interface EmptyStateProps {
  onSuggestedClick: (text: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSuggestedClick }) => {
  const suggestions = [
    { title: "KINGDOM LAWS", text: "Explain the biblical law of service and honor." },
    { title: "PERSONAL GROWTH", text: "How do I discover my God-given purpose?" },
    { title: "PRAYER LIFE", text: "Apostle Joshua Selman's teaching on effective, results-driven prayer." },
    { title: "DIVINE FAVOR", text: "Understanding the mystery of the favor of God." }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestedClick(s.text)}
            className="group relative text-left p-8 bg-[#262626] border border-[#333333] rounded-[1.5rem] transition-all hover:bg-[#2D2D2D] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-300 bg-[#1E1E1E] px-3 py-1.5 rounded-lg uppercase tracking-widest">
                {s.title}
              </span>
              <svg className="w-5 h-5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-white leading-snug pr-4">
              {s.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
