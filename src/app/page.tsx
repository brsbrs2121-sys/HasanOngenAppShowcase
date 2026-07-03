'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role === 'customer') {
          router.replace('/appointments');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div
      className="
        flex 
        flex-col
        items-center 
        justify-center 
        h-[100svh] 
        w-full 
        bg-background 
        gap-4 
        pt-0 
      "
      style={{
        paddingTop: '0',
        paddingBottom: '0',
      }}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-xl text-muted-foreground">Hoşgeldiniz...</p>
    </div>
  );
}
