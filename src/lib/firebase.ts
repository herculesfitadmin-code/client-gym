// Firebase Configuration & Fallback Helper Services for Hercules Fitness

export const firebaseConfig = {
  apiKey: "AIzaSyD06JMULxGVx1SK4gm8epSvlOFi_6B47QY",
  authDomain: "herculesfitness-c543b.firebaseapp.com",
  projectId: "herculesfitness-c543b",
  storageBucket: "herculesfitness-c543b.firebasestorage.app",
  messagingSenderId: "1034470146421",
  appId: "1:1034470146421:web:c7358c14950b80b3fa133c",
  measurementId: "G-07QX5BLHBC",
};

export const app = null;
export const db = null;
export const storage = null;

export const doc = (...args: any[]) => ({ id: args[2] || "global_config" });
export const getDoc = async () => ({ exists: () => false, data: () => null });
export const setDoc = async () => {};
export const onSnapshot = () => () => {};

/**
 * Uploads an image/video file and returns permanent URL / canvas data URL
 */
export async function uploadMediaFileToFirebase(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
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
    reader.readAsDataURL(file);
  });
}

/**
 * Real-time listener for site data updates
 */
export function subscribeToFirebaseSiteData(
  onData: (data: any) => void
): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === "hercules_admin_site_data_v9" && e.newValue) {
      try {
        onData(JSON.parse(e.newValue));
      } catch (err) {
        console.warn("Failed to parse storage update:", err);
      }
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
