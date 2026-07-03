
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BellRing, CheckCircle, Info, Loader2, Smartphone, Zap } from 'lucide-react';
import { useState, useTransition, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { useUser, useCollection } from '@/lib/firebase';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';
import { functions } from '@/lib/firebase/firebase';
import { httpsCallable } from 'firebase/functions';
import type { User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';


const sendNotificationToAll = httpsCallable(functions, 'sendNotificationToAll');

export default function NotificationsPage() {
  const { user: currentUser, isLoading: isAuthLoading, isDemoMode } = useUser();
  const { data: allUsers, isLoading: areUsersLoading } = useCollection<User>('users');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const isSuperAdmin = useMemo(() => currentUser?.role === 'superadmin', [currentUser]);

  const totalRegisteredDevices = useMemo(() => {
    if (!areUsersLoading && allUsers) {
      return allUsers.filter(user => !!user.fcmToken).length;
    }
    return 0;
  }, [allUsers, areUsersLoading]);

  const isLoading = isAuthLoading || areUsersLoading;

  const handleSendMessage = () => {
    if (message.trim().length === 0) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Bildirim mesajı boş olamaz.',
      });
      return;
    }

    startTransition(async () => {
        try {
            const payload = {
                title: 'Hasan Öngen',
                body: message,
            };
            const result: any = await sendNotificationToAll(payload);
            const { successCount, failureCount } = result.data;

            toast({
                title: 'Bildirimler Gönderildi',
                description: `${successCount} kullanıcıya başarıyla gönderildi. ${failureCount} gönderim başarısız oldu.`,
            });
            setMessage('');
        } catch (error) {
            console.error("Failed to send notifications:", error);
            toast({
                variant: 'destructive',
                title: 'Gönderim Başarısız',
                description: 'Bildirimler gönderilirken bir hata oluştu.',
            });
        }
    });
  };
  
 /*
 91 lines of codes
 */
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-green-500" />
            <div>
              <CardTitle>Otomatik Sistem Bildirimleri</CardTitle>
              <CardDescription>Sistem tarafından otomatik olarak gönderilen bildirimler.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start justify-between rounded-lg border p-4">
                <div className="space-y-3">
                    <p className="font-medium">Randevu Hatırlatma</p>
                    <div className="text-sm text-muted-foreground space-y-3">
                        <p>
                           Müşterilere randevularından 24 saat önce ve 1 saat önce otomatik olarak hatırlatma bildirimi gönderilir. Bu sistem arka planda çalışır ve herhangi bir müdahale gerektirmez.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-green-500 shrink-0 ml-4">
                    <CheckCircle className="h-5 w-5" />
                    <span>Aktif</span>
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
