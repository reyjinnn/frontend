import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Phone, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToast } from '../../stores/useToastStore';
import { AuthService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
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
    defaultValues: { email: 'raihan@example.com', password: 'Demo123!' }
  });
  const { syncSession, intendedAction, setIntendedAction } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await AuthService.login(data.email, data.password);
      syncSession();
      toast({ title: 'Login Berhasil', type: 'success' });
      onClose();
      if (intendedAction) {
        const dest = intendedAction;
        setIntendedAction(null);
        navigate(dest);
      }
    } catch (error: any) {
      toast({ 
        title: 'Login Gagal', 
        message: error.message || 'Email atau password salah', 
        type: 'error' 
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen className="md:max-w-md">
      <div className="flex flex-col min-h-full items-center justify-center py-4 sm:py-10 my-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold font-logo text-slate-900 dark:text-white mb-2">Selamat Datang!</h2>
          <p className="text-slate-500 dark:text-slate-400">Masuk untuk melanjutkan belanja di Tech Vibe</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <Input 
            {...register('email')} 
            type="email" 
            placeholder="Email" 
            icon={<Phone className="h-5 w-5" />} 
            error={errors.email?.message} 
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
