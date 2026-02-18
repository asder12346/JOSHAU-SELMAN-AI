
import React from 'react';
import { Message, MessageRole } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isSystem = message.role === MessageRole.SYSTEM_NOTICE;

  // Make links clickable within text and ensure no asterisks are rendered
  const renderContent = (text: string) => {
    // Sanitize text to remove any accidental asterisks the model might have sent
    const sanitizedText = text.replace(/\*/g, '');
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = sanitizedText.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-red-400 font-bold underline break-all hover:text-red-300 transition-colors">
            {part}
          </a>
        );
      }
      return part;
    });
  };

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
              {renderContent(message.content)}
            </div>
            
            {/* YouTube Clickable Source Buttons */}
            {!isUser && message.sources && message.sources.length > 0 && (
              <div className="mt-8 pt-7 border-t border-[#333333]/50 w-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">
                    CLICK BELOW TO WATCH SERMON ON YOUTUBE
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {message.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-6 py-5 bg-[#1A1A1A] border-2 border-red-600/20 rounded-[1.2rem] text-slate-200 transition-all hover:bg-black hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-[0.98] group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate font-bold text-[15px] text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">{source.title}</span>
                        <span className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Sermon Archive • YouTube</span>
                      </div>
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
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
