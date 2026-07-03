
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useUser, useCollection } from '@/lib/firebase';
import { updateDocument } from '@/lib/firebase/use-collection';
import type { StoreSettings, BlockedSlot } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, setHours, startOfDay, addMinutes, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon, Clock, Lock, Store as StoreIcon, X, Info, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';

const timeBlockFormSchema = z.object({
  date: z.date({ required_error: 'Lütfen bir tarih seçin.' }),
  startTime: z.string({ required_error: 'Lütfen bir başlangıç saati seçin.' }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçerli bir saat girin (SS:DD)."),
  endTime: z.string({ required_error: 'Lütfen bir bitiş saati seçin.' }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçerli bir saat girin (SS:DD)."),
}).refine(data => data.startTime < data.endTime, {
    message: "Bitiş saati başlangıç saatinden sonra olmalıdır.",
    path: ["endTime"],
});

export default function StorePage() {
  const { user: currentUser, isLoading: isAuthLoading, isDemoMode } = useUser();
  const { data: settings, isLoading: areSettingsLoading, mutate } = useCollection<StoreSettings>('settings', 'main', 'settings-cache');
  
  const [localSettings, setLocalSettings] = useState<StoreSettings | null>(null);
  const { toast } = useToast();

  const blockForm = useForm<z.infer<typeof timeBlockFormSchema>>({
    resolver: zodResolver(timeBlockFormSchema),
  });
  
  const timeSlots = useMemo(() => {
    const slots = [];
    let currentTime = startOfDay(new Date());
    const endDate = setHours(startOfDay(new Date()), 24);
   /*

    300 lines of codes
   
   */
                                    ))}
                                </SelectContent>
                            </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isDemoMode}>Zaman Aralığını Bloke Et</Button>
                  {isDemoMode && <p className="text-xs text-muted-foreground mt-2">Bu özellik üyeliksiz deneme modunda devre dışıdır.</p>}
               </fieldset>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <div className='flex items-center gap-2'>
                <Lock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Bloke Edilen Zamanlar</h3>
             </div>
          <CardDescription>
            Randevuya kapatılmış olan tarih ve saat aralıkları.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {localSettings.blockedSlots && localSettings.blockedSlots.length > 0 ? (
                <ul className="space-y-2">
                    {localSettings.blockedSlots.map(slot => (
                        <li key={slot.id} className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <p className="font-medium">{format(parseISO(slot.date), "PPP", { locale: tr })}</p>
                                <p className="text-sm text-muted-foreground">{slot.startTime} - {slot.endTime}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeBlockedSlot(slot.id)} aria-label="Blokajı kaldır" disabled={isDemoMode}>
                                <X className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
                    <Info className="h-8 w-8" />
                    <p>Henüz bloke edilmiş bir zaman aralığı yok.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

    

    
