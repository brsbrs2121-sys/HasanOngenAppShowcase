
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useUser, useCollection } from '@/lib/firebase';
import { addDocument, updateDocument, deleteDocument, writeBatchDocuments } from '@/lib/firebase/use-collection';
import type { Service, ServiceCategory } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, PlusCircle, Percent, Loader2, Scissors } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';


const serviceFormSchema = z.object({
  name: z.string().min(2, { message: 'Hizmet adı en az 2 karakter olmalıdır.' }),
  duration: z
    .number({ invalid_type_error: 'Süre bir sayı olmalıdır.' })
    .positive({ message: 'Süre pozitif bir sayı olmalıdır.' })
    .min(30, { message: 'Süre en az 30 dakika olmalıdır.' })
    .refine((val) => val % 30 === 0, {
      message: 'Süre 30 dakikanın katları olmalıdır (30, 60, 90, vb.).',
    }),
  price: z.number({ invalid_type_error: 'Fiyat bir sayı olmalıdır.' }).positive({ message: 'Fiyat 0\'dan büyük olmalıdır.' }),
  category: z.enum(['barber', 'laser', 'manicure']),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const ServiceCard = ({ service, onEdit, onDelete, isDemoMode }: { service: Service, onEdit: (s: Service) => void, onDelete: (s: Service) => void, isDemoMode: boolean }) => (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 grid grid-cols-3 items-center gap-4">
            <div className="col-span-2 sm:col-span-1">
                <p className="font-semibold truncate">{service.name}</p>
                <p className="text-sm text-muted-foreground sm:hidden">{service.duration} dk · ₺{service.price.toFixed(2)}</p>
            </div>
            <p className="hidden sm:block text-sm text-center text-muted-foreground">{service.duration} dakika</p>
            <p className="hidden sm:block text-sm font-medium text-right">₺{service.price.toFixed(2)}</p>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isDemoMode} className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menüyü aç/kapa</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={() => onEdit(service)}>Düzenle</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => onDelete(service)}
              >
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardContent>
    </Card>
);

export default function ServicesPage() {
  const { data: allServices, isLoading: areServicesLoading } = useCollection<Service>('services', undefined, 'services-cache');
  const { user: currentUser, isLoading: isAuthLoading, isDemoMode } = useUser();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = useState(false);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
  
  const [updatePercentage, setUpdatePercentage] = useState(10);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [updateType, setUpdateType] = useState<'discount' | 'increase'>('increase');
  const [activeTab, setActiveTab] = useState<ServiceCategory>('barber');
  
  const { toast } = useToast();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      duration: 30,
      price: 0,
      category: 'barber',
    }
  });
  
  const isSuperAdmin = useMemo(() => currentUser?.role === 'superadmin', [currentUser]);
  const isLoading = (areServicesLoading && !allServices?.length) || isAuthLoading;

  const services = useMemo(() => {
    if (!allServices) return { barber: [], laser: [], manicure: [] };
    return allServices.reduce((acc, service) => {
        const category = service.category || 'barber';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
    }, { barber: [] as Service[], laser: [] as Service[], manicure: [] as Service[] });
  }, [allServices]);
/*

300 lines of codes

*/
                            placeholder="Örn: 30"
                            min={30}
                            step={30}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                          />
                        </FormControl>
                         <p className="text-xs text-muted-foreground">Süre 30 dakikanın katları olmalıdır.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fiyat (₺)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Örn: 350"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? 0 : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={isDemoMode}>Kaydet</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. "{selectedService?.name}" hizmeti kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
