
import React from 'react';
import { Message, MessageRole } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isSystem = message.role === MessageRole.SYSTEM_NOTICE;

  if (isSystem) {
    return (
      <div className="flex justify-center my-8">
        <div className="px-6 py-4 text-[13px] font-medium text-slate-400 bg-[#2D2D2D]/30 rounded-2xl border border-[#3D3D3D] shadow-lg max-w-xl text-center leading-relaxed backdrop-blur-md">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">OFFICIAL ARCHIVE NOTICE</div>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-10 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-5`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border-2 ${
          isUser 
            ? 'bg-[#333333] border-transparent text-slate-300' 
            : 'bg-black border-[#262626]'
        }`}>
          {isUser ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          ) : (
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf0I7F1yB-f-pA1i8WnL8R3D6F-k9G9I6J-A&s" 
              alt="Koinonia" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-7 py-6 rounded-[1.8rem] transition-all shadow-2xl ${
            isUser 
              ? 'bg-[#2D2D2D] text-white border border-[#3D3D3D] rounded-tr-none' 
              : 'bg-[#212121] text-[#E2E8F0] rounded-tl-none border border-[#2D2D2D]'
          }`}>
            <div className="whitespace-pre-wrap leading-[1.8] text-[17px] tracking-tight font-normal">
              {message.content}
            </div>
            
            {/* Clickable Source References */}
            {!isUser && message.sources && message.sources.length > 0 && (
              <div className="mt-8 pt-7 border-t border-[#333333]/50 w-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
                    CLICK TO WATCH SERMON ON YOUTUBE
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {message.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-5 py-4 bg-[#1A1A1A] border border-[#333333] rounded-2xl text-[13px] font-bold text-slate-200 transition-all hover:bg-[#262626] hover:border-[#444] hover:shadow-lg active:scale-[0.99] group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate uppercase tracking-widest text-[11px] text-slate-400 group-hover:text-white transition-colors">{source.title}</span>
                      </div>
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-[10px] font-bold text-slate-600 px-3 uppercase tracking-widest mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
