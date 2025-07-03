import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration - Replace with your Firebase project config
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "innovhub-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "innovhub-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "innovhub-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789"
};

export class FirebaseClient {
  private app: any;
  private auth: Auth | null = null;
  private firestore: Firestore | null = null;
  private storage: FirebaseStorage | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.firestore = getFirestore(this.app);
      this.storage = getStorage(this.app);
    } catch (error) {
      console.warn('Firebase initialization failed - using mock mode:', error);
      this.app = null;
    }
  }

  getAuth(): Auth | null {
    return this.auth;
  }

  getFirestore(): Firestore | null {
    return this.firestore;
  }

  getStorage(): FirebaseStorage | null {
    return this.storage;
  }

  subscribeToActivities(callback: (activity: any) => void): () => void {
    const activityListeners = this.listeners.get('activities') || [];
    activityListeners.push(callback);
    this.listeners.set('activities', activityListeners);

    // Simulate real-time updates when Firebase is not configured
    if (!this.app) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          callback({
            id: Date.now(),
            type: 'activity',
            message: 'New activity update',
            timestamp: new Date()
          });
        }
      }, 30000);

      return () => {
        clearInterval(interval);
        const listeners = this.listeners.get('activities') || [];
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }

    // TODO: Implement real Firestore listeners when Firebase is configured
    return () => {
      const listeners = this.listeners.get('activities') || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  notifyActivityUpdate(activity: any) {
    const listeners = this.listeners.get('activities') || [];
    listeners.forEach(callback => callback(activity));
  }

  isInitialized(): boolean {
    return this.app !== null;
  }
}

export const firebaseClient = new FirebaseClient();
