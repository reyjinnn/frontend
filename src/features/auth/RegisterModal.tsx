import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Phone, Lock, User, Mail } from 'lucide-react';
import { useToast } from '../../stores/useToastStore';

const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor HP tidak valid').regex(/^\+62/, 'Harus diawali +62'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const RegisterModal = ({ isOpen, onClose, onOpenLogin }: RegisterModalProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phone: '+62' }
  });
  const { toast } = useToast();

  const onSubmit = async (_data: RegisterForm) => {
    try {
<<<<<<< HEAD

=======
      // MOCK API call
      // await api.post('/api/v1/auth/register', data);
      
      // Simulate network request
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast({ title: 'Registrasi Berhasil', message: 'Silakan login menggunakan nomor HP Anda.', type: 'success' });
      onClose();
      onOpenLogin();
    } catch (error: any) {
      toast({ 
        title: 'Registrasi Gagal', 
        message: error.response?.data?.message || 'Terjadi kesalahan pada server', 
        type: 'error' 
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen className="md:max-w-md">
      <div className="flex flex-col h-full items-center justify-center py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-logo text-slate-900 dark:text-white mb-2">Buat Akun</h2>
          <p className="text-slate-500 dark:text-slate-400">Bergabunglah dengan ekosistem Tech Vibe</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <Input 
            {...register('name')} 
            type="text" 
            placeholder="Nama Lengkap" 
            icon={<User className="h-5 w-5" />} 
            error={errors.name?.message} 
          />
          <Input 
            {...register('email')} 
            type="email" 
            placeholder="Email (Opsional)" 
            icon={<Mail className="h-5 w-5" />} 
            error={errors.email?.message} 
          />
          <Input 
            {...register('phone')} 
            type="tel" 
            placeholder="+62 8xx xxx xxx" 
            icon={<Phone className="h-5 w-5" />} 
            error={errors.phone?.message} 
          />
          <Input 
            {...register('password')} 
            type="password" 
            placeholder="Password (Min. 8 karakter)" 
            icon={<Lock className="h-5 w-5" />} 
            error={errors.password?.message} 
          />
          
          <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
            Daftar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Sudah punya akun?{' '}
          <button 
            type="button" 
            onClick={() => { onClose(); onOpenLogin(); }} 
            className="font-semibold text-tlater hover:text-tlater-light transition-colors"
          >
            Masuk di sini
          </button>
        </div>
      </div>
    </Modal>
  );
};
