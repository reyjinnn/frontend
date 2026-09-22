import { useState, useRef, useEffect } from 'react';
import { X, Send, User, ShieldCheck } from 'lucide-react';
import type { Ticket } from '../types';

interface TicketThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onReply: (message: string) => Promise<void>;
}

export function TicketThreadModal({ isOpen, onClose, ticket, onReply }: TicketThreadModalProps) {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, ticket?.messages]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    await onReply(replyText);
    setReplyText('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                {ticket.ticketNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                  ticket.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'}`}
              >
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold line-clamp-1">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-[#141414]/50">
          {ticket.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
              
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white shadow-sm
                  ${msg.isAdmin ? 'bg-gradient-to-br from-pumpkin to-orange-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  {msg.isAdmin ? <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] md:max-w-[70%] ${msg.isAdmin ? 'items-start' : 'items-end'} flex flex-col`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {msg.senderName} {msg.isAdmin && <span className="text-pumpkin">(Admin)</span>}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                  </span>
                </div>
                
                <div className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                  ${msg.isAdmin 
                    ? 'bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-tl-sm text-slate-800 dark:text-slate-200' 
                    : 'bg-pumpkin text-white rounded-tr-sm'}`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {}
        {ticket.status !== 'closed' ? (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1A1A1A]">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan Anda di sini..."
                className="flex-1 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-pumpkin focus:border-transparent outline-none resize-none max-h-32"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !replyText.trim()}
                className="p-3 bg-pumpkin hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-pumpkin text-white rounded-2xl transition-colors shadow-sm flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Tekan Enter untuk mengirim, Shift + Enter untuk baris baru.</p>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#141414] text-center text-sm text-slate-500">
            Tiket ini telah ditutup. Anda tidak dapat membalas pesan lagi.
          </div>
        )}
      </div>
    </div>
  );
}
