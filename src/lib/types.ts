
import type { Timestamp } from "firebase/firestore";

export type UserRole = 'customer' | 'barber' | 'superadmin';

export type User = {
  id: string; // Corresponds to Firebase Auth UID
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photoUrl?: string;
  role: UserRole;
  status?: 'active' | 'inactive' | 'pending-deletion';
  fcmToken?: string; // For push notifications
  hasAcceptedPrivacyPolicy?: boolean;
  serviceIds?: string[]; // For barbers
  workingStartTime?: string; // "HH:mm" format for barber's specific start time
  workingEndTime?: string; // "HH:mm" format for barber's specific end time
  workingDays?: number[]; // Array of numbers [0-6] where 0 is Sunday
  createdAt?: Timestamp; // To track new users
  deletionScheduledAt?: Timestamp;
};

export type ServiceCategory = 'barber' | 'laser' | 'manicure';

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: ServiceCategory; // 'barber' or 'laser' or 'manicure'
};

// Represents the structure of the barber object nested within an appointment
export type AppointmentBarber = {
    id: string;
    firstName: string;
    lastName:string;
};

export type Appointment = {
  id:string;
  userId: string; // Reference to the user (customer)
  barber: AppointmentBarber; // Nested object for barber info
  serviceId: string;
  date: string; // ISO 8601 string format
  status: 'pending' | 'confirmed' | 'completed' | 'canceled' | 'no-show' | 'blocked';
  createdAt: Timestamp;
};

export type BlockedSlot = {
  id: string;
  date: string; // ISO string format
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export type StoreSettings = {
    id: string;
    bookingAvailabilityDays: number;
    openingTime: string; // e.g., "09:00"
    closingTime: string; // e.g., "21:00"
    blockedSlots?: BlockedSlot[];
};
