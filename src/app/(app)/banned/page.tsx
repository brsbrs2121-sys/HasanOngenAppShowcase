
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
import { useToast } from '@/hooks/use-toast';
import { UserX, Loader2 } from 'lucide-react';
import { useMemo, useCallback } from 'react';
import { useUser, useCollection } from '@/lib/firebase';
import { writeBatchDocuments } from '@/lib/firebase/use-collection';
import type { User, Appointment } from '@/lib/types';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

const demoBannedUser: User & { noShowCount: number } = {
    id: 'demo-banned-user',
    firstName: 'Barış',
    lastName: 'Yıldız',
    phoneNumber: '555 987 65 43',
    role: 'customer',
    status: 'active',
    noShowCount: 4,
};

const formatPhoneNumberForDisplay = (phone: string | undefined): string => {
  if (!phone) return '';
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.startsWith('90')) {
    return digitsOnly.substring(2);
  }
  return digitsOnly;
};


export default function BannedPage() {
  const { user: currentUser, isLoading: isAuthLoading, isDemoMode } = useUser();
  const { toast } = useToast();
  
  const { data: allUsers, isLoading: areUsersLoading } = useCollection<User>('users', undefined, 'all-users-cache');
  const { data: rawAppointments, isLoading: areAppointmentsLoading } = useCollection<Appointment>('appointments', undefined, 'appointments-cache');

  const appointments = useMemo(() => {
    if (areAppointmentsLoading || !rawAppointments) return [];
    return rawAppointments;
  }, [rawAppointments, areAppointmentsLoading]);

  const isLoading = isAuthLoading || (!isDemoMode && (areUsersLoading || areAppointmentsLoading));

/*

58 line of codes

*/
    <Card>
      <CardHeader>
        <CardTitle>Yasaklı Müşteriler</CardTitle>
        <CardDescription>3 veya daha fazla randevusuna gelmemiş olan müşteriler.</CardDescription>
      </CardHeader>
      <CardContent>
        {bannedUsers.length > 0 ? (
          <div className="space-y-4">
            {bannedUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{formatPhoneNumberForDisplay(user.phoneNumber)}</p>
                        <p className="text-sm font-bold text-destructive mt-1">Gelmedi Sayısı: {user.noShowCount || 0}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isDemoMode} className="shrink-0">
                          Engeli Kaldır
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu işlem, müşterinin tüm "gelmedi" kayıtlarını "iptal edildi" olarak değiştirecek ve müşterinin yeniden randevu almasına olanak tanıyacaktır. Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleUnban(user)}>Evet, Engeli Kaldır</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
                 {isDemoMode && <p className="text-xs text-muted-foreground px-4 pb-2">İnceleme modunda kullanılamaz.</p>}
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <UserX className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Yasaklı Müşteri Bulunmuyor</h3>
            <p className="text-muted-foreground">
              Şu anda 3 veya daha fazla randevusuna gelmeyen müşteri yok.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
