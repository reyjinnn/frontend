export interface Address {
  id: string;
  label: string; 
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
}

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    
    return [
      {
        id: 'addr_1',
        label: 'Rumah',
        recipientName: 'Budi Santoso',
        phone: '+6281234567890',
        fullAddress: 'Jl. Merdeka No. 45, RT 01/RW 02, Kel. Sukamaju, Kec. Maju Jaya',
        city: 'Jakarta Selatan',
        postalCode: '12345',
        isPrimary: true,
      },
      {
        id: 'addr_2',
        label: 'Kantor',
        recipientName: 'Budi Santoso',
        phone: '+6281234567890',
        fullAddress: 'Gedung Tech Tower Lt. 12, Jl. Sudirman Kav. 1',
        city: 'Jakarta Pusat',
        postalCode: '10220',
        isPrimary: false,
      }
    ];

  },

  addAddress: async (data: Omit<Address, 'id' | 'isPrimary'>): Promise<Address> => {

    return {
      ...data,
      id: `addr_${Math.random().toString(36).substr(2, 9)}`,
      isPrimary: false,
    };
  },

  setPrimary: async (_id: string): Promise<void> => {
    
    return Promise.resolve();
  },
  
  deleteAddress: async (_id: string): Promise<void> => {
    
    return Promise.resolve();
  }
};
