
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import EmptyState from './components/EmptyState';
import { Message, MessageRole, ChatState } from './types';
import { sendMessageToGemini } from './geminiService';

const App: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: 'initial-disclaimer',
        role: MessageRole.SYSTEM_NOTICE,
        content: "This spiritual assistant is built strictly on the sermon archives of Apostle Joshua Selman and Koinonia Global. It is designed to help you locate specific teachings and explain the 'why' behind spiritual practices based on the Apostle's verified expositions. It is not a direct line to the Ministry or a place for personal prayer requests.",
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if the user has started a real conversation
  const hasConversationStarted = chatState.messages.some(
    m => m.role === MessageRole.USER || m.role === MessageRole.ASSISTANT
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatState.messages, chatState.isLoading]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendMessageToGemini(content, chatState.messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: response.text,
        sources: response.sources,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (err) {
      const errorText = "I encountered an issue accessing the Koinonia archives. Please rephrase your query to focus on specific topics like 'The mystery of divine favor' or 'Understanding the prophetic' to help us locate the verified teaching.";
      
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: errorText,
      }));

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: MessageRole.SYSTEM_NOTICE,
        content: errorText,
        timestamp: new Date(),
      };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A] text-white">
      <Header />
      
      <main className="flex-1 overflow-y-auto chat-scroll-container scroll-smooth" ref={scrollRef}>
        <div className="max-w-4xl mx-auto flex flex-col min-h-full py-12 px-6">
          <div className="flex-1">
            {chatState.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {!hasConversationStarted && (
              <EmptyState onSuggestedClick={handleSendMessage} />
            )}

            {chatState.isLoading && (
              <div className="flex justify-start mb-10 animate-in fade-in duration-300">
                <div className="flex flex-row gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-black border border-[#262626] flex items-center justify-center shadow-xl overflow-hidden shrink-0">
                    <img 
                      src="https://i.postimg.cc/vH0rN5K5/koinonia-logo.jpg" 
                      alt="Koinonia" 
                      className="w-full h-full object-cover opacity-60 grayscale animate-pulse"
                    />
                  </div>
                  <div className="px-7 py-5 rounded-[1.8rem] bg-[#212121] border border-[#2D2D2D] rounded-tl-none flex gap-3 items-center">
                    <div className="w-2.5 h-2.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
    </div>
  );
};

export default App;
