// Firebase Configuration & Helper Services for Hercules Fitness
import { db, firebaseConfig as LIB_FIREBASE_CONFIG } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL?: string;
  firestoreCollection?: string;
  firestoreDocumentId?: string;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  ...LIB_FIREBASE_CONFIG,
  firestoreCollection: "site_data",
  firestoreDocumentId: "global_config",
};

export function loadFirebaseConfig(): FirebaseConfig {
  try {
    const saved = localStorage.getItem("hercules_firebase_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_FIREBASE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load Firebase config from localStorage:", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  try {
    localStorage.setItem("hercules_firebase_config", JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save Firebase config to localStorage:", e);
  }
}

/**
 * Fetch site data from Firebase Firestore
 */
export async function fetchFirebaseSiteData(config?: FirebaseConfig): Promise<any | null> {
  const cfg = config || loadFirebaseConfig();
  const collection = cfg.firestoreCollection || "site_data";
  const docId = cfg.firestoreDocumentId || "global_config";

  // Attempt using Firebase JS SDK
  try {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.data) {
        return typeof data.data === "string" ? JSON.parse(data.data) : data.data;
      }
    }
  } catch (e) {
    console.warn("Firestore SDK fetch fallback notice:", e);
  }

  // REST Fallback if SDK fetch fails
  if (cfg.projectId && cfg.apiKey) {
    const url = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/(default)/documents/${collection}/${docId}?key=${cfg.apiKey}`;
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) {
        const docRes = await res.json();
        if (docRes.fields && docRes.fields.data && docRes.fields.data.stringValue) {
          return JSON.parse(docRes.fields.data.stringValue);
        }
      }
    } catch (e) {
      console.error("Firebase Firestore REST Fetch Error:", e);
    }
  }

  return null;
}

/**
 * Push site data to Firebase Firestore and return explicit status object
 */
export async function pushToFirebase(
  data: any,
  config?: FirebaseConfig
): Promise<{ success: boolean; error?: string }> {
  const cfg = config || loadFirebaseConfig();
  const collection = cfg.firestoreCollection || "site_data";
  const docId = cfg.firestoreDocumentId || "global_config";

  // 1. Attempt using Firebase JS SDK
  try {
    const docRef = doc(db, collection, docId);
    await setDoc(
      docRef,
      {
        data: JSON.stringify(data),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (e: any) {
    console.warn("Firestore SDK push error:", e);
    const sdkErrorMsg = e?.message || e?.code || String(e);

    // 2. REST Fallback if SDK push fails
    if (cfg.projectId && cfg.apiKey) {
      const url = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/(default)/documents/${collection}/${docId}?key=${cfg.apiKey}`;
      const payload = {
        fields: {
          data: { stringValue: JSON.stringify(data) },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      };

      try {
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return { success: true };
        const errJson = await res.json().catch(() => ({}));
        const restErrorMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        return { success: false, error: restErrorMsg };
      } catch (restErr: any) {
        return { success: false, error: restErr?.message || sdkErrorMsg };
      }
    }

    return { success: false, error: sdkErrorMsg };
  }
}
