
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Search, Users, Loader2, Briefcase } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { useUser, useCollection } from '@/lib/firebase';
import { updateDocument } from '@/lib/firebase/use-collection';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';

const demoCustomer: User = {
    id: 'demo-baris-yildiz',
    firstName: 'Barış',
    lastName: 'Yıldız',
    phoneNumber: '555 123 45 67',
    role: 'customer',
    status: 'active',
};

const formatPhoneNumberForDisplay = (phone: string | undefined): string => {
  if (!phone) return '';
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
 /*
 62 lines of codes
 */

  const customerList = isDemoMode ? [demoCustomer] : customers;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Müşteriler</CardTitle>
        <CardDescription>Sistemde kayıtlı tüm müşterilerin listesi.</CardDescription>
        <div className="relative pt-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="İsim veya telefon ile ara..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
         {customerList && customerList.length > 0 ? (
            filteredCustomers.length > 0 ? (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id}>
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                              <div className="flex-1">
                                  <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{formatPhoneNumberForDisplay(customer.phoneNumber)}</p>
                              </div>
                          </div>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" disabled={isDemoMode} className="shrink-0 gap-2">
                                      <Briefcase className="h-4 w-4" />
                                      <span className="hidden sm:inline">İşe Al</span>
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Bu işlem, {customer.firstName} {customer.lastName} adlı kullanıcıyı "personel" rolüne yükseltecektir. Personel, randevu alabilir ve yönetici paneline erişebilir. Bu işlem geri alınamaz.
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handlePromoteToBarber(customer.id)}>Evet, Yükselt</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                      </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Search className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Müşteri Bulunamadı</h3>
                <p className="text-muted-foreground">
                  Arama kriterlerinize uygun bir müşteri bulunamadı.
                </p>
              </div>
            )
        ) : (
           <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Users className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Henüz Müşteri Yok</h3>
            <p className="text-muted-foreground">
              Sisteme henüz hiçbir müşteri kaydedilmemiş.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
