import { readDemoDB, requireDemoUser, transactDemoDB, nextDemoId } from '../lib/demoRepository';

export interface Address { id: string; label: string; recipientName: string; phone: string; fullAddress: string; city: string; postalCode: string; isPrimary: boolean }
export const addressService = {
  async getAddresses(): Promise<Address[]> { const u = requireDemoUser('customer'); return readDemoDB().addresses[u.id] ?? []; },
  async addAddress(data: Omit<Address, 'id' | 'isPrimary'>): Promise<Address> {
    const u = requireDemoUser('customer');
    if (!data.recipientName.trim() || !data.fullAddress.trim() || !data.city.trim() || !data.phone.trim()) throw new Error('Address incomplete');
    return transactDemoDB(db => { const addresses = db.addresses[u.id] ??= []; const result = { ...data, id: `addr_${nextDemoId(db)}`, isPrimary: addresses.length === 0 }; addresses.push(result); return result; });
  },
  async setPrimary(id: string): Promise<void> { const u = requireDemoUser('customer'); await transactDemoDB(db => { const addresses = db.addresses[u.id] ?? []; if (!addresses.some(a => a.id === id)) throw new Error('Address not found'); addresses.forEach(a => { a.isPrimary = a.id === id; }); }); },
  async deleteAddress(id: string): Promise<void> { const u = requireDemoUser('customer'); await transactDemoDB(db => { const addresses = db.addresses[u.id] ?? []; const index = addresses.findIndex(a => a.id === id); if (index < 0) throw new Error('Address not found'); const [removed] = addresses.splice(index, 1); if (removed.isPrimary && addresses.length) addresses[0].isPrimary = true; }); }
};
