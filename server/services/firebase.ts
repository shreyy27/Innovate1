import admin from 'firebase-admin';

export interface FirebaseService {
  sendNotification(userId: number, message: string): Promise<void>;
  subscribeToActivities(callback: (activity: any) => void): () => void;
}

class FirebaseAdminService implements FirebaseService {
  private app: admin.app.App | null = null;
  private initialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Initialize Firebase Admin SDK
      if (!admin.apps.length) {
        // Try to initialize with service account key
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        
        if (serviceAccount) {
          this.app = admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
        } else {
          // Try default credentials (works in Google Cloud environments)
          this.app = admin.initializeApp();
        }
        
        this.initialized = true;
        console.log('[Firebase] Admin SDK initialized successfully');
      } else {
        this.app = admin.apps[0];
        this.initialized = true;
      }
    } catch (error) {
      console.warn('[Firebase] Admin SDK initialization failed:', error);
      this.initialized = false;
    }
  }

  async sendNotification(userId: number, message: string): Promise<void> {
    if (!this.initialized || !this.app) {
      console.log(`[Firebase Mock] Sending notification to user ${userId}: ${message}`);
      return;
    }

    try {
      // In a real implementation, you would:
      // 1. Get user's FCM token from database
      // 2. Send notification using Firebase Cloud Messaging
      
      const messaging = admin.messaging();
      
      // Example notification payload
      const payload = {
        notification: {
          title: 'InnovHub Notification',
          body: message
        },
        // You would need to store and retrieve user FCM tokens
        // token: userFCMToken
      };

      console.log(`[Firebase] Preparing notification for user ${userId}: ${message}`);
      // await messaging.send(payload);
      
    } catch (error) {
      console.error('[Firebase] Error sending notification:', error);
    }
  }

  subscribeToActivities(callback: (activity: any) => void): () => void {
    if (!this.initialized || !this.app) {
      console.log('[Firebase Mock] Subscribing to activity updates');
      return () => console.log('[Firebase Mock] Unsubscribing from activity updates');
    }

    try {
      const firestore = admin.firestore();
      
      // Example: Listen to activities collection
      const unsubscribe = firestore.collection('activities')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              callback(change.doc.data());
            }
          });
        });

      console.log('[Firebase] Subscribed to activity updates');
      return unsubscribe;
      
    } catch (error) {
      console.error('[Firebase] Error subscribing to activities:', error);
      return () => {};
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const firebaseService = new FirebaseAdminService();
