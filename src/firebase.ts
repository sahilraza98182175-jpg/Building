import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { Worker, WorkerActivity, SlideItem } from './types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// --- Realtime Workers Sync ---
export function subscribeWorkers(
  onUpdate: (workers: Worker[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'workers';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Worker[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: Number(docSnap.id) || (typeof data.id === 'number' ? data.id : Number(data.id)) || Date.now(),
          name: data.name || '',
          role: data.role || '',
          password: data.password || '',
          dp: data.dp || '',
          attendance: data.attendance || '-',
          leave: data.leave ?? '0',
          expWeek: data.expWeek || '0',
          expense: data.expense || '0',
          total: data.total || '0',
          phone: data.phone || '',
          badgeNumber: data.badgeNumber || '',
          siteLocation: data.siteLocation || '',
          joiningDate: data.joiningDate || '',
          excelRows: data.excelRows || {},
        });
      });
      // Sort newest or by id
      list.sort((a, b) => b.id - a.id);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      if (onError) onError(err);
    }
  );
}

export async function saveWorkerToFirestore(worker: Worker): Promise<void> {
  const path = 'workers';
  const docId = String(worker.id);
  try {
    const payload: Record<string, unknown> = {
      id: worker.id,
      name: worker.name || '',
      role: worker.role || '',
      password: worker.password || '',
      dp: worker.dp || '',
      attendance: worker.attendance || '-',
      leave: String(worker.leave ?? '0'),
      expWeek: worker.expWeek || '0',
      expense: worker.expense || '0',
      total: worker.total || '0',
      excelRows: worker.excelRows || {},
      updatedAt: new Date().toISOString(),
    };
    if (worker.phone) payload.phone = worker.phone;
    if (worker.badgeNumber) payload.badgeNumber = worker.badgeNumber;
    if (worker.siteLocation) payload.siteLocation = worker.siteLocation;
    if (worker.joiningDate) payload.joiningDate = worker.joiningDate;

    await setDoc(doc(db, path, docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${docId}`);
    throw error;
  }
}

export async function deleteWorkerFromFirestore(workerId: number | string): Promise<void> {
  const path = 'workers';
  const docId = String(workerId);
  try {
    await deleteDoc(doc(db, path, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${docId}`);
    throw error;
  }
}

// --- Realtime Activities Sync ---
export function subscribeActivities(
  onUpdate: (activities: WorkerActivity[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'activities';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: WorkerActivity[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: Number(docSnap.id) || (typeof data.id === 'number' ? data.id : Number(data.id)) || Date.now(),
          workerId: Number(data.workerId) || 0,
          workerName: data.workerName || '',
          description: data.description || '',
          date: data.date || '',
        });
      });
      list.sort((a, b) => (b.date > a.date ? 1 : -1));
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      if (onError) onError(err);
    }
  );
}

export async function saveActivityToFirestore(act: WorkerActivity): Promise<void> {
  const path = 'activities';
  const docId = String(act.id);
  try {
    await setDoc(doc(db, path, docId), {
      id: act.id,
      workerId: String(act.workerId),
      workerName: act.workerName || '',
      description: act.description || '',
      date: act.date || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${docId}`);
    throw error;
  }
}

export async function deleteActivityFromFirestore(actId: number | string): Promise<void> {
  const path = 'activities';
  const docId = String(actId);
  try {
    await deleteDoc(doc(db, path, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${docId}`);
    throw error;
  }
}

// --- Realtime Slides Sync ---
export function subscribeSlides(
  onUpdate: (slides: SlideItem[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'slides';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: SlideItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: Number(docSnap.id) || (typeof data.id === 'number' ? data.id : Number(data.id)) || Date.now(),
          title: data.title || '',
          subtitle: data.subtitle || '',
          mediaType: data.mediaType === 'video' ? 'video' : 'image',
          mediaUrl: data.mediaUrl || '',
          posterUrl: data.posterUrl || '',
          tag: data.tag || '',
        });
      });
      list.sort((a, b) => a.id - b.id);
      onUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
      if (onError) onError(err);
    }
  );
}

export async function saveSlideToFirestore(slide: SlideItem): Promise<void> {
  const path = 'slides';
  const docId = String(slide.id);
  try {
    await setDoc(doc(db, path, docId), {
      id: slide.id,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      mediaType: slide.mediaType,
      mediaUrl: slide.mediaUrl,
      posterUrl: slide.posterUrl || '',
      tag: slide.tag || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${docId}`);
    throw error;
  }
}

export async function deleteSlideFromFirestore(slideId: number | string): Promise<void> {
  const path = 'slides';
  const docId = String(slideId);
  try {
    await deleteDoc(doc(db, path, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${docId}`);
    throw error;
  }
}
