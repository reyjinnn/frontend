export interface Address {
  id: string;
<<<<<<< HEAD
  label: string; 
=======
  label: string; // e.g. Rumah, Kantor
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
}

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
<<<<<<< HEAD
    
=======
    // MOCK DATA for Sprint 1 Local Testing
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
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
<<<<<<< HEAD

  },

  addAddress: async (data: Omit<Address, 'id' | 'isPrimary'>): Promise<Address> => {

=======
    // const response = await api.get('/api/v1/user/addresses');
    // return response.data;
  },

  addAddress: async (data: Omit<Address, 'id' | 'isPrimary'>): Promise<Address> => {
    // const response = await api.post('/api/v1/user/addresses', data);
    // return response.data;
    
    // MOCK RESPONSE
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
    return {
      ...data,
      id: `addr_${Math.random().toString(36).substr(2, 9)}`,
      isPrimary: false,
    };
  },

  setPrimary: async (_id: string): Promise<void> => {
<<<<<<< HEAD
    
=======
    // await api.patch(`/api/v1/user/addresses/${id}/primary`);
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
    return Promise.resolve();
  },
  
  deleteAddress: async (_id: string): Promise<void> => {
<<<<<<< HEAD
    
=======
    // await api.delete(`/api/v1/user/addresses/${id}`);
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
    return Promise.resolve();
  }
};
