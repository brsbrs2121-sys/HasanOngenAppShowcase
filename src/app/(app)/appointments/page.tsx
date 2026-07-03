
'use client';

import {
  addDoc,
  collection,
  query,
  where,
  Timestamp,
  getDocs,
  orderBy,
  doc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, functions } from '@/lib/firebase/firebase';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useCollection, useUser, addDocument, updateDocument } from '@/lib/firebase';
import type { Appointment, Service, User, StoreSettings, BlockedSlot, ServiceCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { add, addMinutes, format, getDay, isBefore, isEqual, isPast, parse, startOfDay, isFuture, endOfDay, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  PlusCircle,
  Clock,
  Loader2,
  Users,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Info
} from 'lucide-react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { httpsCallable } from 'firebase/functions';

const sendAppointmentNotification = httpsCallable(functions, 'sendAppointmentNotification');

type BookingStep = 'category' | 'service' | 'barber' | 'date';
type AppointmentStatusFilter = 'all' | Appointment['status'];

const getStatusVariant = (status: Appointment['status']) => {
  switch (status) {
    case 'confirmed': return 'success';
    case 'completed': return 'secondary';
    case 'pending': return 'outline';
    case 'canceled': return 'destructive';
    case 'no-show': return 'destructive';
    default: return 'default';
  }
};

const getStatusText = (status: Appointment['status']) => {
  const map = {
      'pending': 'Onay Bekliyor',
      'confirmed': 'Onaylandı',
      'completed': 'Tamamlandı',
      'canceled': 'İptal Edildi',
      'no-show': 'Gelmedi',
      'blocked': 'Bloke Edildi'
  }
  return map[status] || status;
}

export default function AppointmentsPage() {
  const { user: currentUser, isLoading: isAuthLoading, isDemoMode } = useUser();
  const { data: services, isLoading: areServicesLoading } = useCollection<Service>('services', undefined, 'services-cache');
  const { data: barbers, isLoading: areBarbersLoading } = useCollection<User>('users', 'barbers', 'barbers-cache');
  const { data: allUsers, isLoading: areAllUsersLoading } = useCollection<User>('users', undefined, 'all-users-cache');
  const { data: settings, isLoading: areSettingsLoading } = useCollection<StoreSettings>('settings', 'main', 'settings-cache');
  
  const { data: rawAppointments, isLoading: areAppointmentsLoading } = useCollection<Appointment>('appointments', undefined, 'appointments-cache');

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('category');
  const [selectedBookingCategory, setSelectedBookingCategory] = useState<ServiceCategory | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AppointmentStatusFilter>('all');
  
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

/*
517 lines of codes...
*/
                        </PopoverContent>
                    </Popover>
                    <ScrollArea className="h-48">
                        <div className="grid grid-cols-3 gap-2">
                           {availableTimeSlots && availableTimeSlots.length > 0 ? (
                              availableTimeSlots.map(time => (
                                  <Button
                                      key={time}
                                      variant={selectedTime === time ? 'default' : 'outline'}
                                      onClick={() => setSelectedTime(time)}
                                  >
                                      {time}
                                  </Button>
                              ))
                          ) : (
                              <p className="text-muted-foreground col-span-3 text-sm text-center py-4">Bu tarih için uygun saat bulunmuyor.</p>
                          )}
                        </div>
                    </ScrollArea>
                  </div>
              )}


              <DialogFooter className="p-6 pt-4 flex justify-between w-full">
                {bookingStep !== 'category' ? (
                  <Button variant="ghost" onClick={handlePrevStep}><ChevronLeft className="h-4 w-4 mr-2" />Geri</Button>
                ) : <div />}

                {bookingStep !== 'date' ? (
                     <Button 
                        onClick={handleNextStep} 
                        disabled={(bookingStep === 'service' && !selectedServiceId) || (bookingStep === 'barber' && !selectedBarberId)}
                        className={cn(bookingStep === 'category' && 'hidden')}
                     >
                        İleri<ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleCreateAppointment} disabled={!selectedTime || isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                        Randevuyu Onayla
                    </Button>
                )}
              </DialogFooter>
               <DialogClose ref={dialogCloseRef} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {customerActiveAppointment && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-start gap-4">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                    <CardTitle className="text-base text-blue-800 dark:text-blue-300">Aktif Bir Randevunuz Var</CardTitle>
                    <CardDescription className="text-blue-700 dark:text-blue-400/80">
                        Yeni bir randevu alabilmek için mevcut randevunuzun tamamlanması veya iptal edilmesi gerekmektedir.
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
      )}

      {currentUser?.role !== 'customer' && (
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as AppointmentStatusFilter)}>
          <TabsList className="grid w-full grid-cols-3 h-auto sm:w-auto sm:inline-grid sm:grid-cols-6">
            {filterTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {userAppointments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userAppointments.map(appointment => {
            const service = services?.find(s => s.id === appointment.serviceId);
            const customer = currentUser?.role !== 'customer' ? (allUsers?.find(u => u.id === appointment.userId)) : currentUser;

            const apptDate = new Date(appointment.date);
            const canCancel = currentUser?.role === 'customer' && 
                              (appointment.status === 'pending' || appointment.status === 'confirmed') && 
                              isFuture(apptDate);
            const canManage = currentUser?.role === 'superadmin' || 
                              (currentUser?.role === 'barber' && currentUser.id === appointment.barber.id);
            
            const barberForAppt = barbers?.find(b => b.id === appointment.barber.id);

            return (
              <Card key={appointment.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service?.name || 'Bilinmeyen Hizmet'}</CardTitle>
                    <Badge variant={getStatusVariant(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                  </div>
                  <CardDescription>{format(apptDate, "dd MMMM yyyy, EEEE HH:mm", { locale: tr })}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={barberForAppt?.photoUrl} />
                        <AvatarFallback>{appointment.barber.firstName?.[0]}{appointment.barber.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{appointment.barber.firstName} {appointment.barber.lastName}</p>
                        <p className="text-sm text-muted-foreground">Berber</p>
                    </div>
                  </div>
                  {customer && currentUser?.role !== 'customer' && (
                     <div className="flex items-center gap-3">
                        <Avatar>
                            {!customer.photoUrl ? (
                                <AvatarFallback>{customer.firstName?.[0]}{customer.lastName?.[0]}</AvatarFallback>
                            ) : (
                                <AvatarImage src={customer.photoUrl} alt={`${customer.firstName} ${customer.lastName}`} />
                            )}
                        </Avatar>
                        <div>
                            <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
                            <p className="text-sm text-muted-foreground">Müşteri</p>
                        </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {canManage && appointment.status === 'pending' && (
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="w-full" onClick={() => handleUpdateStatus(appointment, 'canceled')} disabled={isLoading}>
                        <X className="mr-2 h-4 w-4" /> Reddet
                      </Button>
                      <Button className="w-full" onClick={() => handleUpdateStatus(appointment, 'confirmed')} disabled={isLoading}>
                        <Check className="mr-2 h-4 w-4" /> Onayla
                      </Button>
                    </div>
                  )}
                   {canManage && appointment.status === 'confirmed' && (
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="w-full" onClick={() => handleUpdateStatus(appointment, 'no-show')} disabled={isLoading}>Gelmedi</Button>
                      <Button className="w-full" onClick={() => handleUpdateStatus(appointment, 'completed')} disabled={isLoading}>Tamamlandı</Button>
                    </div>
                  )}
                  {canCancel && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            <X className="mr-2 h-4 w-4" />
                            Randevuyu İptal Et
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Randevuyu iptal etmek istiyor musunuz?</AlertDialogTitle>
                          <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleUpdateStatus(appointment, 'canceled')} disabled={isLoading}>
                            Evet, İptal Et
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center rounded-lg border-2 border-dashed">
          <Users className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">
            {(currentUser?.role !== 'customer' && activeFilter === 'all') || currentUser?.role === 'customer'
              ? 'Henüz Randevu Yok' 
              : 'Randevu Bulunamadı'
            }
          </h3>
          <p className="text-muted-foreground">
            { (currentUser?.role !== 'customer' && activeFilter === 'all') || currentUser?.role === 'customer'
              ? (currentUser?.role === 'customer' ? 'Yeni bir randevu oluşturarak başlayabilirsiniz.' : 'Sistemde henüz hiç randevu oluşturulmamış.')
              : `"${getStatusText(activeFilter as Appointment['status'])}" durumunda randevu bulunmuyor.`
            }
          </p>
        </div>
      )}
    </div>
  );
}

    

    

