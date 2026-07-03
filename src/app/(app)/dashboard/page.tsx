
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser, useCollection } from '@/lib/firebase';
import { Calendar, Users, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartTooltipContent, ChartTooltip, ChartContainer } from '@/components/ui/chart';
import { useMemo, useEffect } from 'react';
import { subDays, format as formatDate, startOfMonth, eachMonthOfInterval, getMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { AccessDeniedCard } from '@/components/ui/access-denied-card';
import type { Appointment } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const DashboardStats = () => {
  const { data: totalAppointments, isLoading: totalAppointmentsLoading } = useCollection('appointments', undefined, 'appointments-cache');
  const { data: totalCustomers, isLoading: totalCustomersLoading } = useCollection('users', 'customers', 'customers-cache');

  const newAppointmentsCount = 0;
  const newCustomersCount = 0;

  const isLoading = (totalAppointmentsLoading && !totalAppointments?.length) || (totalCustomersLoading && !totalCustomers?.length);

  if (isLoading) {
      return (
          <>
              {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Yükleniyor...</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">...</div>
                      </CardContent>
                  </Card>
              ))}
          </>
      );
  }

  return (
      <>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Randevu</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{totalAppointments?.length ?? 0}</div>
                  <p className="text-xs text-muted-foreground">
                      +{newAppointmentsCount} son 30 gün
                  </p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers?.length ?? 0}</div>
                  <p className="text-xs text-muted-foreground">
                      +{newCustomersCount} son 30 gün
                  </p>
              </CardContent>
          </Card>
      </>
  );
};

/*

63 lines of codes

*/
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <DashboardStats />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Randevulara Genel Bakış</CardTitle>
                        <CardDescription>Son 6 aydaki randevuların özeti.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-72 w-full">
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="appointments" fill="var(--color-appointments)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
