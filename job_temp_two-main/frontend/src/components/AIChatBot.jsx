import axios from 'axios';
import { Bot, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:4000/api/v1/aichat/chat', { message: input });
      const botMessage = { from: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { from: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatWindow = isOpen ? createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-end bg-slate-950/55 p-4 sm:p-6" onClick={() => setIsOpen(false)}>
      <div
        className="surface-strong relative flex h-[min(78vh,46rem)] w-[min(92vw,38rem)] flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-400/15 to-indigo-500/15 px-4 py-4 text-white sm:px-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan-200"><Sparkles className="h-3 w-3" /> AI assistant</div>
            <h3 className="mt-1 text-lg font-bold sm:text-xl">Gemini AI Helper</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          {messages.length === 0 ? (
            <div className="surface-soft p-5 text-slate-300">
              Ask for resume tips, job suggestions, or help with applications. The assistant will respond in this panel.
            </div>
          ) : null}
          {messages.map((msg, index) => (
            <div key={index} className={`max-w-[85%] rounded-3xl px-4 py-3 ${msg.from === 'user' ? 'ml-auto bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-100'}`}>
              <p className="text-sm leading-6">{msg.text}</p>
            </div>
          ))}
          {isLoading && <div className="max-w-[85%] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100"><p className="text-sm">Thinking...</p></div>}
        </div>

        <div className="border-t border-white/10 bg-slate-950/95 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="field flex-1"
            />
            <button onClick={handleSend} className="primary-button h-12 w-12 shrink-0 p-0" disabled={isLoading} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      {chatWindow}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 z-[150] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open AI assistant"
      >
        <Bot className="h-8 w-8" />
      </button>
    </>
  );
};

export default AIChatBot; 