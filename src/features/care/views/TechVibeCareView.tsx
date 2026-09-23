import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, MessageSquare, LifeBuoy } from 'lucide-react';
import { TicketsApi } from '../api/ticketsApi';
import type { Ticket, CreateTicketPayload } from '../types';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { TicketThreadModal } from '../components/TicketThreadModal';

const FAQS = [
  {
    question: 'Bagaimana cara melacak pesanan saya?',
    answer: 'Anda dapat melacak pesanan melalui menu "Pesanan Saya". Klik tombol "Lacak Pengiriman" pada pesanan yang berstatus "Dikirim" untuk melihat posisi paket secara real-time.'
  },
  {
    question: 'Berapa lama proses pengembalian dana (refund)?',
    answer: 'Proses pengembalian dana memakan waktu 1-3 hari kerja untuk pembayaran via e-wallet/Virtual Account, dan hingga 14 hari kerja untuk kartu kredit, tergantung kebijakan bank penerbit.'
  },
  {
    question: 'Bagaimana cara klaim garansi produk resmi?',
    answer: 'Untuk produk bergaransi resmi (seperti Apple, Samsung), Anda bisa membawa produk beserta invoice TechVibe langsung ke service center resmi terdekat. Jika butuh bantuan, Anda bisa membuat tiket dengan kategori "Klaim Garansi".'
  },
  {
    question: 'Apa syarat menggunakan TechVibe Later?',
    answer: 'Anda harus menyelesaikan proses verifikasi KYC (KTP & Selfie) di menu profil. Setelah diverifikasi, Anda akan mendapatkan limit yang bisa digunakan untuk cicilan.'
  }
];

export function TechVibeCareView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<string | undefined>();
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    const data = await TicketsApi.getTickets();
    setTickets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const action = searchParams.get('action');
    const category = searchParams.get('category');
    
    if (action === 'create_ticket') {
      if (category) setInitialCategory(category);
      setIsCreateModalOpen(true);
      
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCreateTicket = async (payload: CreateTicketPayload) => {
    await TicketsApi.createTicket(payload);
    await fetchTickets();
    alert('Tiket berhasil dibuat. Tim kami akan segera merespon.');
  };

  const handleReplyTicket = async (message: string) => {
    if (!selectedTicket) return;
    const updated = await TicketsApi.replyTicket(selectedTicket.id, message);
    setSelectedTicket(updated);
    
    TicketsApi.getTickets().then(setTickets);
  };

  const openThread = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsThreadModalOpen(true);
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch(status) {
      case 'open': return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Terbuka</span>;
      case 'in_progress': return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Diproses</span>;
      case 'closed': return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Selesai</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      
      {}
      <div className="bg-gradient-to-r from-orange-500 to-pumpkin rounded-3xl p-8 md:p-12 text-white mb-10 relative overflow-hidden shadow-xl shadow-pumpkin/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 md:w-10 md:h-10" /> TechVibe Care
          </h1>
          <p className="text-orange-100 mb-8 text-lg">
            Hai, ada yang bisa kami bantu hari ini? Temukan jawaban cepat atau hubungi tim support kami.
          </p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik topik bantuan, misal: 'cara klaim garansi'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-orange-200 focus:outline-none focus:bg-white/30 transition-all"
            />
            <Search className="w-5 h-5 text-orange-200 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button 
          onClick={() => { setInitialCategory('Pengiriman'); setIsCreateModalOpen(true); }}
          className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin hover:shadow-lg transition-all group text-left"
        >
          {/* <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div> */}
          <h3 className="font-bold text-lg mb-2">Masalah Pesanan & Pengiriman</h3>
          <p className="text-sm text-slate-500">Lacak paket, komplain barang tidak sesuai, atau kendala kurir.</p>
        </button>

        <button 
          onClick={() => { setInitialCategory('Garansi'); setIsCreateModalOpen(true); }}
          className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin hover:shadow-lg transition-all group text-left"
        >
          {/* <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div> */}
          <h3 className="font-bold text-lg mb-2">Klaim Garansi & Retur</h3>
          <p className="text-sm text-slate-500">Panduan klaim garansi resmi dan proses retur barang rusak.</p>
        </button>

        <button 
          onClick={() => { setInitialCategory('TLater'); setIsCreateModalOpen(true); }}
          className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-pumpkin dark:hover:border-pumpkin hover:shadow-lg transition-all group text-left"
        >
          {/* <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CreditCard className="w-6 h-6" />
          </div> */}
          <h3 className="font-bold text-lg mb-2">TechVibe Later</h3>
          <p className="text-sm text-slate-500">Pertanyaan seputar limit, pembayaran tagihan, dan denda.</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {}
        <div>
          <h2 className="text-2xl font-bold mb-6">Sering Ditanyakan (FAQ)</h2>
          <div className="space-y-4">
            {FAQS.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white dark:bg-[#1A1A1A] border ${openFaqIndex === index ? 'border-pumpkin' : 'border-slate-100 dark:border-slate-800'} rounded-2xl overflow-hidden transition-colors`}
              >
                <button
                  className="w-full p-5 text-left flex justify-between items-center"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaqIndex === index ? 'rotate-180 text-pumpkin' : ''}`} />
                </button>
                {openFaqIndex === index && (
                  <div className="p-5 pt-0 text-slate-500 leading-relaxed text-sm border-t border-slate-50 dark:border-slate-800/50 mt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tiket Saya</h2>
            <button 
              onClick={() => { setInitialCategory('Lainnya'); setIsCreateModalOpen(true); }}
              className="text-sm font-semibold text-pumpkin hover:underline"
            >
              Buat Tiket Baru
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-slate-100 dark:border-slate-800 p-2 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Memuat tiket...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Anda belum memiliki tiket pengaduan aktif.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[500px] overflow-y-auto">
                {tickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    onClick={() => openThread(ticket)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-[#141414] cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">{ticket.ticketNumber}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded uppercase font-bold">
                          {ticket.category}
                        </span>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1">{ticket.subject}</h4>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                      {ticket.messages[ticket.messages.length - 1]?.message}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Diperbarui: {new Date(ticket.updatedAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTicketModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateTicket}
        initialCategory={initialCategory}
      />

      <TicketThreadModal
        isOpen={isThreadModalOpen}
        onClose={() => setIsThreadModalOpen(false)}
        ticket={selectedTicket}
        onReply={handleReplyTicket}
      />
    </div>
  );
}
