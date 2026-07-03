'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirebase } from '@/lib/firebase';
import type { Service, ServiceCategory } from '@/lib/types';
import { Loader2, TestTube2, User as UserIcon, Shield, WifiOff } from 'lucide-react';
import { auth, db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';


const Logo = () => (
  <div className="relative w-full h-[min(22rem,38vh)] md:h-[22rem]">
    <Image src="/logo-dark.png" alt="The Hasan Öngen Logo" fill style={{ objectFit: 'contain' }} priority />
  </div>
);

const registrationFormSchema = z.object({
  firstName: z.string().min(2, { message: 'Ad en az 2 karakter olmalıdır.' }),
  lastName: z.string().min(2, { message: 'Soyad en az 2 karakter olmalıdır.' }),
  phone: z.string().min(10, { message: 'Telefon numarası en az 10 karakterden oluşmalıdır.' }),
});

const otpFormSchema = z.object({
  otp: z.string().length(6, { message: 'Kod 6 haneli olmalıdır.' }),
});

const phoneSchema = z.object({
  phone: z.string().min(10, { message: 'Telefon numarası en az 10 karakterden oluşmalıdır.' }),
});

type LoginStep = 'phone' | 'otp';

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
  if (phoneNumberLength < 9) return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
  return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(
    8,
    10,
  )}`;
};

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loginWithPhoneNumber, registerUser, confirmOtp, loginAsMockUser } = useFirebase();
  const { data: services, isLoading: areServicesLoading } = useCollection<Service>('services');

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>('phone');
  const [registrationStep, setRegistrationStep] = useState<'form' | 'otp'>('form');
  const [isCustomerRegDialogOpen, setIsCustomerRegDialogOpen] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [activePhoneNumber, setActivePhoneNumber] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [priceListCategory, setPriceListCategory] = useState<ServiceCategory | null>(null);
  const [isRecaptchaRunning, setIsRecaptchaRunning] = useState(false);

  const registrationForm = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: '' },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  const filteredServices = useMemo(() => {
    if (!services || !priceListCategory) return [];
    return services.filter((s) => (s.category || 'barber') === priceListCategory);
  }, [services, priceListCategory]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      router.push('/');
    } else {
      setIsLoading(false);
    }

    return () => {
      if (typeof window === 'undefined') return;

      const verifier = (window as any).recaptchaVerifier;
      if (!verifier) return;

      setTimeout(() => {
        try {
          const container = document.getElementById('recaptcha-container');
          if (container) {
            verifier.clear?.();
          }
        } catch (e) {
          console.warn('reCAPTCHA cleanup warning:', e);
        } finally {
          delete (window as any).recaptchaVerifier;
        }
      }, 250);
    };
  }, [user, router]);

  const handlePhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    setIsProcessing(true);
    const formattedPhone = `+90${values.phone.replace(/\D/g, '')}`;
    setActivePhoneNumber(formattedPhone);

    const success = await loginWithPhoneNumber(formattedPhone);
    if (success) {
      toast({
        title: 'Doğrulama Kodu Gönderildi',
        description: `Lütfen ${formattedPhone} numarasına gelen kodu girin.`,
      });
      setLoginStep('otp');
    }

    setIsProcessing(false);
  };

  const handleLoginOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setIsProcessing(true);
    const user = await confirmOtp(values.otp, 'login');

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast({
          variant: 'destructive',
          title: 'Kayıt Bulunamadı',
          description: 'Önce kayıt olmanız gerekiyor.',
        });
        await auth.signOut();
        setLoginStep('phone');
        setIsCustomerRegDialogOpen(true);
      } else {
        toast({ title: 'Giriş Başarılı', description: 'Yönlendiriliyorsunuz...' });
        router.push('/');
      }
    }

    setIsProcessing(false);
  };

  const onRegistrationSubmit = useCallback(
    async (values: z.infer<typeof registrationFormSchema>) => {
      if (!policyAccepted) {
        toast({
          variant: 'destructive',
          title: 'Onay Gerekli',
          description: 'Lütfen gizlilik politikasını kabul edin.',
        });
        return;
      }


      /*
          
             521 lines of codes
    
      */
          <Button variant="outline" onClick={handlePriceListBack} className="mt-4 w-full">
            Geri
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
        <DialogTrigger asChild>
          <div className="absolute bottom-4 left-4">
            <Button variant="link" className="text-zinc-500 hover:text-white flex items-center gap-2">
              <TestTube2 className="h-4 w-4" />
              İncele
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>İncelemek İçin Lütfen Rol Seçin</DialogTitle>
            <DialogDescription>Fikir ve görüşlerinizi ayarlar kısmındaki maile iletebilirsiniz.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <Button onClick={() => handleDemoLogin('customer')} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <UserIcon className="mr-2 h-4 w-4" /> Müşteri
                </>
              )}
            </Button>
            <Button onClick={() => handleDemoLogin('superadmin')} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" /> Yönetici
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Firebase Recaptcha sadece login sayfası için buraya render edilecek */}
      <div id="recaptcha-container" />
    </div>
  );
}
