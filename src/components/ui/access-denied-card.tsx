"use client";

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ban } from 'lucide-react';

export function AccessDeniedCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Ban className="h-8 w-8 text-destructive" />
        <div>
          <CardTitle>Erişim Engellendi</CardTitle>
          <CardDescription>Bu sayfayı görüntüleme yetkiniz yok.</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
