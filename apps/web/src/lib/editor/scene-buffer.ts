const DB_NAME = "manuscript-scene-buffer";
const STORE = "scenes";

export type SceneBufferRecord = {
  sceneId: string;
  contentJson: Record<string, unknown>;
  plainText: string;
  updatedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "sceneId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readSceneBuffer(sceneId: string): Promise<SceneBufferRecord | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(sceneId);
    request.onsuccess = () => resolve((request.result as SceneBufferRecord | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function writeSceneBuffer(record: SceneBufferRecord): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearSceneBuffer(sceneId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(sceneId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
