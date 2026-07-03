
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Scissors, Clock, CalendarDays, Loader2, Users } from 'lucide-react';
import type { User, Service, StoreSettings } from '@/lib/types';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useCollection, useUser } from '@/lib/firebase';
import { updateDocument, deleteDocument } from '@/lib/firebase/use-collection';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMinutes, format, startOfDay, setHours } from 'date-fns';
import { deleteField } from 'firebase/firestore';
import { cn } from '@/lib/utils';

async function compressImageForWeb(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Canvas desteklenmiyor');

            const size = 350; // Final size of the canvas (and the circular image)
            canvas.width = size;
            canvas.height = size;
            
            ctx.fillStyle = 'rgba(0,0,0,0)'; // Use a transparent background
            ctx.fillRect(0, 0, size, size);

            // Calculate dimensions to fit the image within the canvas while maintaining aspect ratio
            let drawWidth, drawHeight, x, y;
            if (img.width > img.height) {
                drawHeight = size;
                drawWidth = (img.width / img.height) * size;
                x = (size - drawWidth) / 2;
                y = 0;
            } else {
                drawWidth = size;
                drawHeight = (img.height / img.width) * size;
                x = 0;
                y = (size - drawHeight) / 2;
            }

            // Draw the image centered on the canvas
            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            resolve(compressedBase64);
        };

        img.onerror = reject;

        reader.readAsDataURL(file);
    });
}

const daysOfWeek = [
  { id: 1, label: 'Pazartesi' },
  { id: 2, label: 'Salı' },
  { id: 3, label: 'Çarşamba' },
  { id: 4, label: 'Perşembe' },
  { id: 5, label: 'Cuma' },
  { id: 6, label: 'Cumartesi' },
  { id: 0, label: 'Pazar' },
];

export default function BarbersPage() {
  const { toast } = useToast();
  const { user: currentUser, isLoading: isAuthLoading, isDemoMode } = useUser();
  
  const { data: allUsers, isLoading: isUsersLoading } = useCollection<User>('users', 'barbers', 'barbers-cache');
  const { data: services, isLoading: isServicesLoading } = useCollection<Service>('services', undefined, 'services-cache');
  const { data: storeSettingsData, isLoading: areSettingsLoading } = useCollection<StoreSettings>('settings', 'main', 'settings-cache');

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const viewedUser = useMemo(() => {
    return allUsers?.find(u => u.id === selectedUserId);
  }, [allUsers, selectedUserId]);

  const storeSettings = useMemo(() => storeSettingsData?.[0], [storeSettingsData]);

  const timeSlots = useMemo(() => {
    const slots = [];
    let currentTime = startOfDay(new Date());
    const endDate = setHours(startOfDay(new Date()), 24);
    while (currentTime < endDate) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, 30);
    }
    return slots;
  }, []);

  useEffect(() => {
    if (viewedUser) {
      setLocalUser(JSON.parse(JSON.stringify(viewedUser)));
      setSelectedServiceIds(viewedUser.serviceIds || []);
      setSelectedDays(viewedUser.workingDays || [1, 2, 3, 4, 5, 6]);
    } else {
      setLocalUser(null);
    }
  }, [viewedUser]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(prevId => (prevId === userId ? null : userId));
  };
  
  const canEdit = useMemo(() => {
    if (!currentUser || !viewedUser) return false;
    if (currentUser.role === 'superadmin') return true;
    if (currentUser.role === 'barber' && currentUser.id === viewedUser.id) return true;
    return false;
  }, [currentUser, viewedUser]);

  const canEditSensitiveFields = useMemo(() => currentUser?.role === 'superadmin', [currentUser]);

  const canDelete = useMemo(() => {
    if (!currentUser || !viewedUser) return false;
    if (isDemoMode) return false;
  /*
  200 lines of codes
  */
                        <Switch id="status" checked={localUser.status === 'active'} onCheckedChange={handleStatusChange} />
                      </div>
                    </div>

                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <div className='flex items-center gap-2'><Clock className="h-5 w-5 text-muted-foreground" /><h3 className="text-lg font-medium">Çalışma Saatleri</h3></div>
                      <CardDescription>Personele özel çalışma saatleri atayın.</CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Başlangıç Saati</Label><Select value={localUser.workingStartTime || storeSettings.openingTime} onValueChange={(value) => handleSelectChange('workingStartTime', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{timeSlots.map(time => (<SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Bitiş Saati</Label><Select value={localUser.workingEndTime || storeSettings.closingTime} onValueChange={(value) => handleSelectChange('workingEndTime', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{timeSlots.map(time => (<SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>))}</SelectContent></Select></div>
                      </div>
                    </div>

                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <div className='flex items-center gap-2'><CalendarDays className="h-5 w-5 text-muted-foreground" /><h3 className="text-lg font-medium">Çalışma Günleri</h3></div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 rounded-lg border p-4 mt-2">
                        {daysOfWeek.map((day) => (<div key={day.id} className="flex items-center space-x-2"><Checkbox id={`day-${day.id}`} checked={selectedDays.includes(day.id)} onCheckedChange={(checked) => handleDaySelectionChange(day.id, checked as boolean)} /><label htmlFor={`day-${day.id}`} className="text-sm font-medium leading-none">{day.label}</label></div>))}
                      </div>
                    </div>

                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <div className='flex items-center gap-2'><Scissors className="h-5 w-5 text-muted-foreground" /><h3 className="text-lg font-medium">Hizmet Yetkinlikleri</h3></div>
                      <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 mt-2">
                        {services?.map((service) => (<div key={service.id} className="flex items-center space-x-2"><Checkbox id={`service-${service.id}`} checked={selectedServiceIds.includes(service.id)} onCheckedChange={(checked) => handleServiceSelectionChange(service.id, checked as boolean)} /><label htmlFor={`service-${service.id}`} className="text-sm font-medium leading-none">{service.name}</label></div>))}
                      </div>
                    </div>
                  </>
                )}
              </fieldset>

              <div className="flex justify-between items-start pt-6 border-t mt-6">
                {canDelete ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" type="button" size="sm" disabled={isSaving || isDemoMode}><Trash2 className="mr-0 sm:mr-2 h-4 w-4" /><span className="sr-only sm:not-sr-only">Personeli Sil</span></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>Bu işlem geri alınamaz. {localUser.firstName} {localUser.lastName} kalıcı olarak silinecektir.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Evet, Sil</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent>
                  </AlertDialog>
                ) : <div />}
                {canEdit && (<Button type="submit" disabled={isSaving || isDemoMode}>{isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</> : 'Değişiklikleri Kaydet'}</Button>)}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    
