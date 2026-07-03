// A simple event emitter for cross-component communication.
// This is used to decouple error reporting from the components that generate them.

type Listener<T> = (payload: T) => void;

class EventEmitter<TEventMap extends Record<string, any>> {
  private listeners: { [K in keyof TEventMap]?: Listener<TEventMap[K]>[] } = {};

  on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach(listener => listener(payload));
  }
}

// Define the event map for our application
interface AppEvents {
  'permission-error': import('./errors').FirestorePermissionError;
}

// Create and export a singleton instance of the event emitter
export const errorEmitter = new EventEmitter<AppEvents>();
