import api from '../../../lib/axios';
import type { Ticket, CreateTicketPayload } from '../types';
import { useAuthStore } from '../../../stores/useAuthStore';

let mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TVC-20260901-001',
    subject: 'Klaim Garansi Layar iPhone 15 Pro Max',
    category: 'Garansi',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    messages: [
      {
        id: 'm1',
        senderId: '101',
        senderName: 'Budi Santoso',
        isAdmin: false,
        message: 'Halo min, layar iPhone 15 Pro Max saya tiba-tiba bergaris hijau padahal tidak pernah jatuh. Order ID: TVB-20260910-002.',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'm2',
        senderId: 'admin1',
        senderName: 'Customer Success TechVibe',
        isAdmin: true,
        message: 'Halo Kak Budi, mohon maaf atas ketidaknyamanan yang dialami. Untuk klaim garansi layar bergaris (green screen) iPhone 15 Pro Max, silakan bawa perangkat beserta invoice pembelian ke service center resmi Apple terdekat. Kakak juga bisa mengirimkan perangkat ke alamat retur kami untuk kami bantu teruskan klaim garansinya.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  {
    id: '2',
    ticketNumber: 'TVC-20260815-089',
    subject: 'Paket Belum Diterima',
    category: 'Pengiriman',
    status: 'closed',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    messages: [
      {
        id: 'm3',
        senderId: '101',
        senderName: 'Budi Santoso',
        isAdmin: false,
        message: 'Status di tracking sudah delivered tapi saya belum terima paketnya.',
        timestamp: new Date(Date.now() - 86400000 * 15).toISOString()
      },
      {
        id: 'm4',
        senderId: 'admin2',
        senderName: 'Customer Success TechVibe',
        isAdmin: true,
        message: 'Halo Kak Budi, setelah kami cek ke kurir JNE, paket dititipkan di pos satpam perumahan atas nama Bapak Yanto. Mohon dicek kembali ya Kak.',
        timestamp: new Date(Date.now() - 86400000 * 14.5).toISOString()
      },
      {
        id: 'm5',
        senderId: '101',
        senderName: 'Budi Santoso',
        isAdmin: false,
        message: 'Oh iya betul sudah ada di satpam. Terima kasih infonya.',
        timestamp: new Date(Date.now() - 86400000 * 14).toISOString()
      }
    ]
  }
];

export const TicketsApi = {
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const res = await api.get('localhost:3000/api/v1/tickets');
      return res.data;
    } catch (e) {
      return new Promise(resolve => setTimeout(() => resolve([...mockTickets]), 500));
    }
  },

  createTicket: async (payload: CreateTicketPayload): Promise<Ticket> => {
    try {
      const res = await api.post('localhost:3000/api/v1/tickets', payload);
      return res.data;
    } catch (e) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = useAuthStore.getState().user;
          const newTicket: Ticket = {
            id: Date.now().toString(),
            ticketNumber: `TVC-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
            subject: payload.subject,
            category: payload.category,
            status: 'open',
            priority: payload.priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
              {
                id: `m-${Date.now()}`,
                senderId: user?.id || '101',
                senderName: user?.name || 'Customer',
                isAdmin: false,
                message: payload.message,
                timestamp: new Date().toISOString()
              }
            ]
          };
          mockTickets.unshift(newTicket);
          resolve(newTicket);
        }, 600);
      });
    }
  },

  replyTicket: async (ticketId: string, message: string): Promise<Ticket> => {
    try {
      const res = await api.post(`localhost:3000/api/v1/tickets/${ticketId}/reply`, { message });
      return res.data;
    } catch (e) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = mockTickets.findIndex(t => t.id === ticketId);
          if (idx !== -1) {
            const user = useAuthStore.getState().user;
            mockTickets[idx].messages.push({
              id: `m-${Date.now()}`,
              senderId: user?.id || '101',
              senderName: user?.name || 'Customer',
              isAdmin: false,
              message,
              timestamp: new Date().toISOString()
            });
            mockTickets[idx].updatedAt = new Date().toISOString();

            setTimeout(() => {
               mockTickets[idx].messages.push({
                 id: `m-${Date.now()+1}`,
                 senderId: 'system',
                 senderName: 'CS Bot',
                 isAdmin: true,
                 message: 'Pesan Anda telah kami terima dan sedang dalam antrean pengecekan oleh tim terkait. Mohon kesediaannya menunggu balasan kami.',
                 timestamp: new Date().toISOString()
               });
               mockTickets[idx].updatedAt = new Date().toISOString();
            }, 2000);

            resolve({ ...mockTickets[idx] });
          } else {
            reject(new Error('Ticket not found'));
          }
        }, 500);
      });
    }
  },

  resolveTicket: async (ticketId: string): Promise<void> => {
    try {
      await api.patch(`localhost:3000/api/v1/tickets/${ticketId}/resolve`);
    } catch (e) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = mockTickets.findIndex(t => t.id === ticketId);
          if (idx !== -1) {
            mockTickets[idx].status = 'closed';
            mockTickets[idx].updatedAt = new Date().toISOString();
            resolve();
          } else {
            reject(new Error('Ticket not found'));
          }
        }, 500);
      });
    }
  }
};
