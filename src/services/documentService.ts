import { storage, db } from '@/lib/firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  processedContent?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export const documentService = {
  async uploadDocument(userId: string, file: File): Promise<Document> {
    try {
      // Create a unique file name
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // Create document record in Firestore
      const documentData = {
        userId,
        fileName: file.name,
        fileUrl: downloadUrl,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: Timestamp.now(),
        status: 'pending' as const
      };

      const docRef = await addDoc(collection(db, 'documents'), documentData);
      return { id: docRef.id, ...documentData, uploadDate: documentData.uploadDate.toDate() };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  async getDocuments(userId: string): Promise<Document[]> {
    const documentsQuery = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(documentsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadDate: doc.data().uploadDate.toDate()
    })) as Document[];
  },

  async deleteDocument(documentId: string, fileUrl: string): Promise<void> {
    try {
      // Delete from Storage
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);

      // Delete from Firestore
      const docRef = doc(db, 'documents', documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  async processDocument(documentId: string): Promise<void> {
    try {
      // Update document status to processing
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, { status: 'processing' });

      // TODO: Implement AI processing logic here
      // This could involve:
      // 1. Downloading the document from Storage
      // 2. Using an AI service to process the document
      // 3. Storing the processed content back in Firestore

      // For now, we'll simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateDoc(docRef, {
        status: 'completed',
        processedContent: 'Sample processed content'
      });
    } catch (error) {
      console.error('Error processing document:', error);
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, { status: 'error' });
      throw error;
    }
  }
}; 