
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
      if (isListening) stopListening();
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

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setText(prev => (prev.trim() === '' ? finalTranscript : prev + ' ' + finalTranscript));
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="w-full bg-[#1A1A1A] pt-4 pb-12 px-6 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className={`relative bg-[#2D2D2D] rounded-[1.5rem] border transition-all duration-300 flex items-end p-2 ${
            isListening ? 'border-red-600 ring-2 ring-red-600/20 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-[#3D3D3D] shadow-2xl'
          }`}
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`flex-shrink-0 mb-2 ml-2 p-3 rounded-xl transition-all relative group ${
              isListening 
                ? 'text-red-500 bg-red-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-[#3D3D3D]'
            }`}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
          >
            {isListening && (
              <span className="absolute inset-0 bg-red-500/20 animate-ping rounded-xl"></span>
            )}
            <svg className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening... Speak now" : "Ask anything about the Apostle's teachings..."}
            className={`flex-1 bg-transparent border-none rounded-2xl px-4 py-4 text-[16px] focus:ring-0 resize-none max-h-40 text-white placeholder-slate-400 transition-all ${
              isListening ? 'placeholder-red-400' : ''
            }`}
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
        {isListening && (
          <div className="mt-3 flex justify-center items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-1">
              {[0, 150, 300, 450].map((delay) => (
                <div 
                  key={delay}
                  className="w-1 h-3 bg-red-600 rounded-full animate-bounce" 
                  style={{ animationDelay: `${delay}ms` }}
                ></div>
              ))}
            </div>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] ml-2">Recording Wisdom</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
