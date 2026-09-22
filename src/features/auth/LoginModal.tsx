import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Phone, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToast } from '../../stores/useToastStore';

const loginSchema = z.object({
  phone: z.string().min(10, 'Nomor HP tidak valid').regex(/^\+62/, 'Harus diawali +62'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const LoginModal = ({ isOpen, onClose, onOpenRegister }: LoginModalProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '+62' }
  });
  const { login } = useAuthStore();
  const { toast } = useToast();

  const onSubmit = async (data: LoginForm) => {
    try {
<<<<<<< HEAD

=======
      // API call (Mocking for now as per instructions)
      // const res = await api.post('/api/v1/auth/login', data);
      // const { user, accessToken, refreshToken } = res.data;
      
      // MOCK DATA for local testing fallback
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
      const mockResponse = {
        user: { id: 'usr_1', name: 'TechVibe User', email: 'user@techvibe.id', phone: data.phone },
        accessToken: 'mock_jwt_access_token',
        refreshToken: 'mock_jwt_refresh_token',
      };
      
      login(mockResponse.user, mockResponse.accessToken, mockResponse.refreshToken);
      toast({ title: 'Login Berhasil', type: 'success' });
      onClose();
    } catch (error: any) {
      toast({ 
        title: 'Login Gagal', 
        message: error.response?.data?.message || 'Nomor HP atau password salah', 
        type: 'error' 
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen className="md:max-w-md">
      <div className="flex flex-col h-full items-center justify-center py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-logo text-slate-900 dark:text-white mb-2">Selamat Datang!</h2>
          <p className="text-slate-500 dark:text-slate-400">Masuk untuk melanjutkan belanja di Tech Vibe</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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
            placeholder="Password" 
            icon={<Lock className="h-5 w-5" />} 
            error={errors.password?.message} 
          />
          
          <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
            Masuk
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Belum punya akun?{' '}
          <button 
            type="button" 
            onClick={() => { onClose(); onOpenRegister(); }} 
            className="font-semibold text-pumpkin hover:text-pumpkin-hover transition-colors"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </Modal>
  );
};
