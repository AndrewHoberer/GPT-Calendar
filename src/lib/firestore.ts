import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Generic function to get a document by ID
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
}

// Generic function to get all documents from a collection
export async function getCollection<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to add a document to a collection
export async function addDocument<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}

// Generic function to update a document
export async function updateDocument(collectionName: string, docId: string, data: Partial<DocumentData>): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
}

// Generic function to delete a document
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

// Generic function to query documents
export async function queryDocuments<T>(
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<T[]> {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// User-specific functions
export async function createUserProfile(userId: string, userData: {
  email: string;
  displayName?: string;
  photoURL?: string;
}) {
  return addDocument('users', {
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

export async function getUserProfile(userId: string) {
  return getDocument('users', userId);
}

export async function updateUserProfile(userId: string, userData: Partial<{
  displayName: string;
  photoURL: string;
}>) {
  return updateDocument('users', userId, {
    ...userData,
    updatedAt: new Date().toISOString()
  });
} 