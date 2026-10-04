import api from '../../../lib/axios';
import type { Ticket, CreateTicketPayload } from '../types';
import { readDemoDB, requireDemoUser, transactDemoDB, nextDemoId } from '../../../lib/demoRepository';
import { DEMO_MODE } from '../../../lib/demoMode';

export const TicketsApi = {
  getTickets: async (): Promise<Ticket[]> => {
    if (!DEMO_MODE) return (await api.get('/api/v1/tickets')).data;
    const user = requireDemoUser();
    const list = readDemoDB().tickets;
    if (user.role === 'admin') return list.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    return list.filter(t => t.userId === user.id).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  createTicket: async (payload: CreateTicketPayload): Promise<Ticket> => {
    if (!DEMO_MODE) return (await api.post('/api/v1/tickets', payload)).data;
    const user = requireDemoUser('customer');
    const uInfo = readDemoDB().customers.find(c => c.id === user.id)!;
    return transactDemoDB(db => {
      const now = new Date().toISOString();
      const id = String(nextDemoId(db));
      const ticket: Ticket & { userId: string } = {
        id,
        userId: user.id,
        ticketNumber: `TVC-${now.slice(0, 10).replace(/-/g, '')}-${id}`,
        subject: payload.subject,
        category: payload.category,
        status: 'open',
        priority: payload.priority,
        createdAt: now,
        updatedAt: now,
        messages: [{
          id: `m-${nextDemoId(db)}`,
          senderId: user.id,
          senderName: uInfo.name,
          isAdmin: false,
          message: payload.message,
          timestamp: now
        }]
      };
      db.tickets.unshift(ticket);
      return ticket;
    });
  },

  replyTicket: async (ticketId: string, message: string): Promise<Ticket> => {
    if (!DEMO_MODE) return (await api.post(`/api/v1/tickets/${ticketId}/reply`, { message })).data;
    const user = requireDemoUser();
    const uInfo = readDemoDB().customers.find(c => c.id === user.id)!;
    return transactDemoDB(db => {
      const ticket = db.tickets.find(t => t.id === ticketId);
      if (!ticket) throw new Error('Ticket not found');
      if (user.role === 'customer' && ticket.userId !== user.id) throw new Error('Ticket not found');
      const now = new Date().toISOString();
      ticket.messages.push({
        id: `m-${nextDemoId(db)}`,
        senderId: user.id,
        senderName: user.role === 'admin' ? 'Customer Success TechVibe' : uInfo.name,
        isAdmin: user.role === 'admin',
        message,
        timestamp: now
      });
      ticket.updatedAt = now;
      if (user.role === 'admin') ticket.status = 'in_progress';
      return ticket;
    });
  },

  resolveTicket: async (ticketId: string): Promise<void> => {
    if (!DEMO_MODE) { await api.patch(`/api/v1/tickets/${ticketId}/resolve`); return; }
    const user = requireDemoUser();
    await transactDemoDB(db => {
      const ticket = db.tickets.find(t => t.id === ticketId);
      if (!ticket) throw new Error('Ticket not found');
      if (user.role === 'customer' && ticket.userId !== user.id) throw new Error('Ticket not found');
      ticket.status = 'closed';
      ticket.updatedAt = new Date().toISOString();
    });
  }
};
