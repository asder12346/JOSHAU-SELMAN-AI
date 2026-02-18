
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 w-full bg-[#1A1A1A] px-6 py-6 border-b border-[#262626]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black border border-[#333333] flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf0I7F1yB-f-pA1i8WnL8R3D6F-k9G9I6J-A&s" 
              alt="Koinonia Logo" 
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              Apostle Joshua Selman AI
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              SPIRITUAL WISDOM
            </p>
          </div>
        </div>
        
        <div className="hidden sm:block">
           <div className="px-4 py-1.5 bg-[#262626] text-slate-400 text-[10px] font-bold rounded-full border border-[#333333] uppercase tracking-widest">
             VERIFIED KNOWLEDGE
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
