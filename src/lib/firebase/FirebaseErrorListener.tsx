'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a real app, you might use a toast notification or a more robust logging service.
      // For this development environment, we will log a detailed error to the console.
      console.error(
        `Firestore Permission Error: Access denied on '${error.context.path}' for operation '${error.context.operation}'.`,
        {
          context: error.context
        }
      );

      // Optionally, show a generic toast to the user
      toast({
        variant: 'destructive',
        title: 'İzin Hatası',
        description: 'Bu işlemi gerçekleştirmek için yetkiniz yok.',
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
