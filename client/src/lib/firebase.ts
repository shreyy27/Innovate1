// Firebase client configuration and utilities
// This would integrate with Firebase SDK for real-time features

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Mock Firebase service for real-time notifications
export class FirebaseClient {
  private listeners: Map<string, Function[]> = new Map();

  subscribeToActivities(callback: (activity: any) => void): () => void {
    const listeners = this.listeners.get('activities') || [];
    listeners.push(callback);
    this.listeners.set('activities', listeners);

    // Return unsubscribe function
    return () => {
      const updatedListeners = this.listeners.get('activities')?.filter(l => l !== callback) || [];
      this.listeners.set('activities', updatedListeners);
    };
  }

  notifyActivityUpdate(activity: any) {
    const listeners = this.listeners.get('activities') || [];
    listeners.forEach(callback => callback(activity));
  }
}

export const firebaseClient = new FirebaseClient();
