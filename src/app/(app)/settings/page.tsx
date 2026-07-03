
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirebase } from '@/lib/firebase';
import { updateDocument } from '@/lib/firebase/use-collection';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { serverTimestamp } from 'firebase/firestore';


export default function SettingsPage() {
  const { user: userData, isLoading, isDemoMode } = useUser();
  const { firebaseUser, logout } = useFirebase();
  const router = useRouter();

  const handleScheduleDeletion = useCallback(async () => {
    if (isDemoMode) {
        toast({
            variant: 'default',
            title: 'Demo Modu',
            description: 'Bu özellik demo modunda devre dışıdır.',
        });
        return;
    }
      
    if (!firebaseUser) {
        toast({
            variant: 'destructive',
            title: 'Hata',
            description: 'Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.',
        });
        return;
    }

    try {
        // Mark user for deletion in Firestore instead of deleting immediately
        await updateDocument('users', firebaseUser.uid, {
            status: 'pending-deletion',
            deletionScheduledAt: serverTimestamp()
        });

        toast({
            title: 'Hesap Silme Talebi Alındı',
            description: 'Hesabınız silinmek üzere işaretlendi. Bir sonraki girişinizde veya 24 saat içinde kalıcı olarak silinecektir.',
            duration: 8000,
        });
        
      /*
      
      85 lines of codes
      
      */
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                        {isDemoMode && (
                            <div className="mt-2">
                                <p className="text-xs text-muted-foreground">Hesap silme özelliği İnceleme modunda devre dışıdır.</p>
                                <p className="text-xs text-muted-foreground mt-2">Uygulama hakkında bilgi almak, fikir ve görüşleriniz için brsbrs2121@gmail.com mail atabilirsiniz.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
             </>
            )}
             {isDemoMode && userData.role === 'superadmin' && (
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                    Uygulama hakkında bilgi almak, fikir ve görüşleriniz için brsbrs2121@gmail.com mail atabilirsiniz
                    </p>
                </CardContent>
            )}
        </Card>
      </div>
  );
}
