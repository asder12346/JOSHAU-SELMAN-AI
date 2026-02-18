
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

  const youtubeSource = message.sources?.find(s => s.uri.includes('youtube') || s.uri.includes('youtu.be'));
  const audioSource = message.sources?.find(s => !s.uri.includes('youtube') && !s.uri.includes('youtu.be'));

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
              src="https://i.postimg.cc/vH0rN5K5/koinonia-logo.jpg" 
              alt="Koinonia" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-7 py-7 rounded-[2rem] transition-all shadow-2xl ${
            isUser 
              ? 'bg-[#2D2D2D] text-white border border-[#3D3D3D] rounded-tr-none' 
              : 'bg-[#212121] text-[#E2E8F0] rounded-tl-none border border-[#2D2D2D]'
          }`}>
            {/* Exposition Text */}
            <div className="whitespace-pre-wrap leading-[1.8] text-[17px] tracking-tight font-normal text-slate-200">
              {message.content}
            </div>
            
            {/* Sermon Resource Section - Only shown if real data exists */}
            {!isUser && youtubeSource && (
              <div className="mt-8 pt-8 border-t border-[#333333]">
                <div className="bg-[#1A1A1A] rounded-[1.5rem] border border-[#333333] p-6 group hover:border-red-600/30 transition-all">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-4">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-1 block">Verified Resource</span>
                        <h4 className="text-[15px] font-bold text-white leading-tight uppercase tracking-tight">{youtubeSource.title}</h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href={youtubeSource.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg active:scale-95 overflow-hidden relative"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        <span className="text-[12px] font-black uppercase tracking-widest">Watch on YouTube</span>
                      </a>

                      {audioSource && (
                        <a 
                          href={audioSource.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 py-4 px-6 bg-[#333333] hover:bg-[#444444] text-white rounded-xl transition-all active:scale-95"
                        >
                          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          <span className="text-[12px] font-black uppercase tracking-widest">Audio</span>
                        </a>
                      )}
                   </div>
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
