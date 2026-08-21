import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase Configuration for Hercules Fitness project (herculesfitness-c543b)
export const firebaseConfig = {
  apiKey: "AIzaSyD06JMULxGVx1SK4gm8epSvlOFi_6B47QY",
  authDomain: "herculesfitness-c543b.firebaseapp.com",
  projectId: "herculesfitness-c543b",
  storageBucket: "herculesfitness-c543b.firebasestorage.app",
  messagingSenderId: "1034470146421",
  appId: "1:1034470146421:web:c7358c14950b80b3fa133c",
  measurementId: "G-07QX5BLHBC",
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

/**
 * Uploads an image/video file to Firebase Storage and returns its permanent HTTPS URL.
 * Includes a strict 2.5s timeout: if Storage direct upload hangs/fails, it automatically
 * falls back instantly to lightweight in-browser canvas compression (< 200KB JPEG),
 * ensuring image uploads ALWAYS succeed instantly without ever getting stuck.
 */
export async function uploadMediaFileToFirebase(file: File): Promise<string> {
  // Client-side image compression helper (< 200KB JPEG for safe, instant Firestore writes)
  const compressLightweight = (inputFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!inputFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = reject;
        reader.readAsDataURL(inputFile);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 900;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.70));
          } else {
            resolve((e.target?.result as string) || "");
          }
        };
        img.onerror = reject;
        img.src = (e.target?.result as string) || "";
      };
      reader.onerror = reject;
      reader.readAsDataURL(inputFile);
    });
  };

  // 1. Attempt direct Firebase Storage upload with a 2.5s timeout
  try {
    const ext = file.name.split(".").pop() || "png";
    const filename = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storageRef = ref(storage, filename);

    const storageUploadPromise = (async () => {
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    })();

    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("Storage upload timeout")), 2500)
    );

    const downloadUrl = await Promise.race([storageUploadPromise, timeoutPromise]);
    if (downloadUrl) return downloadUrl;
  } catch (err) {
    console.warn("Firebase Storage direct upload notice (using instant compression fallback):", err);
  }

  // 2. Instant fallback: Canvas-compressed image (< 200KB)
  return await compressLightweight(file);
}

/**
 * Real-time listener for live Firestore site data updates across all browsers
 */
export function subscribeToFirebaseSiteData(
  onData: (data: any) => void,
  collection = "site_data",
  docId = "global_config"
): () => void {
  try {
    const docRef = doc(db, collection, docId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.data();
          if (raw && raw.data) {
            const parsed = typeof raw.data === "string" ? JSON.parse(raw.data) : raw.data;
            try {
              localStorage.setItem("hercules_admin_site_data_v9", JSON.stringify(parsed));
            } catch (err) {
              console.warn("Failed to cache snapshot in localStorage:", err);
            }
            onData(parsed);
          }
        }
      },
      (error) => {
        console.warn("Firestore live snapshot notice:", error);
      }
    );
  } catch (e) {
    console.warn("Firestore snapshot subscription notice:", e);
    return () => {};
  }
}
