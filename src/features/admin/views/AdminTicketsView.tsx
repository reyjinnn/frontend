import { useState, useEffect } from 'react';
import { TicketsApi } from '../../care/api/ticketsApi';
import type { Ticket } from '../../care/types';
import { Button } from '../../../components/ui/Button';
import { 
  Search, 
  MessageCircle, 
  X,
  CheckCircle2,
  Clock,
  User,
  Send
} from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';

export function AdminTicketsView() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await TicketsApi.getTickets();
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplySuccess = (updatedTicket: Ticket) => {
    if (selectedTicket) {
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    }
  };

  const handleResolveSuccess = () => {
    if (selectedTicket) {
      const updatedTicket = { ...selectedTicket, status: 'closed' as const };
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-space">TechVibe Care (Admin)</h2>
          <p className="text-slate-500 text-sm mt-1">Bantu selesaikan kendala pelanggan dan klaim garansi.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Filters */}
        <div className="p-4 bg-slate-50 dark:bg-[#141414] flex flex-col sm:flex-row gap-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nomor tiket atau subjek..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <select className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="">Semua Status</option>
            <option value="open">Open (Perlu Balasan)</option>
            <option value="closed">Closed (Selesai)</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">Memuat tiket bantuan...</div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <MessageCircle className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
              <p>Tidak ada tiket bantuan.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-[#111] text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Nomor Tiket & Subjek</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Prioritas</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium text-primary mb-1">{ticket.ticketNumber}</div>
                      <p className="font-semibold truncate max-w-[300px]">{ticket.subject}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(ticket.createdAt).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{ticket.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-600' : 
                        ticket.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant={ticket.status === 'open' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        {ticket.status === 'open' ? 'Balas Tiket' : 'Lihat Detail'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTicket && (
        <AdminReplyTicketModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)}
          onReplySuccess={handleReplySuccess}
          onResolveSuccess={handleResolveSuccess}
        />
      )}
    </div>
  );
}

function AdminReplyTicketModal({ 
  ticket, 
  onClose, 
  onReplySuccess,
  onResolveSuccess 
}: { 
  ticket: Ticket, 
  onClose: () => void,
  onReplySuccess: (r: Ticket) => void,
  onResolveSuccess: () => void
}) {
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const { user } = useAuthStore();

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      const reply = await TicketsApi.replyTicket(ticket.id, replyMessage);
      onReplySuccess(reply);
      setReplyMessage('');
    } catch (e) {
      alert('Gagal mengirim balasan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (confirm('Tandai tiket ini sebagai selesai?')) {
      setIsResolving(true);
      try {
        await TicketsApi.resolveTicket(ticket.id);
        onResolveSuccess();
      } catch (e) {
        alert('Gagal menutup tiket');
      } finally {
        setIsResolving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-50 dark:bg-[#0a0a0a] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-[10px] font-bold uppercase tracking-wider">{ticket.status}</span>
              <span className="font-mono text-slate-500 font-medium text-sm">{ticket.ticketNumber}</span>
            </div>
            <h2 className="text-xl font-bold font-space">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Conversation */}
          {ticket.messages?.map(reply => (
            <div key={reply.id} className={`flex gap-4 ${reply.isAdmin ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${reply.isAdmin ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                {reply.isAdmin ? <span className="font-bold font-space text-sm">TV</span> : <User className="w-5 h-5" />}
              </div>
              <div className={`flex-1 flex flex-col ${reply.isAdmin ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm">{reply.isAdmin ? reply.senderName : 'Pelanggan'}</span>
                  <span className="text-xs text-slate-500">{new Date(reply.timestamp).toLocaleString('id-ID')}</span>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap max-w-[85%] ${
                  reply.isAdmin 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}>
                  {reply.message}
                </div>
              </div>
            </div>
          ))}

          {ticket.status === 'closed' && (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500 py-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium text-sm">Tiket ini telah diselesaikan.</span>
            </div>
          )}
        </div>

        {/* Reply Box */}
        {ticket.status === 'open' && (
          <div className="p-4 bg-white dark:bg-[#111] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form onSubmit={handleSendReply}>
              <div className="relative">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Ketik balasan Anda (Mendukung markdown sederhana)..."
                  className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-2xl pl-4 pr-16 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-y"
                  required
                />
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting || !replyMessage.trim()}
                    className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-600 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-slate-500">Balas sebagai <strong className="text-primary">{user?.name}</strong></span>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  onClick={handleResolve}
                  isLoading={isResolving}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Selesai
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
