
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className="w-full bg-[#1A1A1A] pt-4 pb-12 px-6 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="relative bg-[#2D2D2D] rounded-[1.5rem] border border-[#3D3D3D] shadow-2xl transition-all flex items-end p-2"
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the Apostle's teachings..."
            className="flex-1 bg-transparent border-none rounded-2xl px-6 py-4 text-[16px] focus:ring-0 resize-none max-h-40 text-white placeholder-slate-400"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`flex-shrink-0 mb-2 mr-2 p-3 rounded-xl transition-all ${
              text.trim() && !isLoading
                ? 'text-white bg-[#3D3D3D] hover:bg-[#4D4D4D]'
                : 'text-slate-500'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 rotate-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
