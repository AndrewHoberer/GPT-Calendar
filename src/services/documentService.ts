import { storage, db } from '@/lib/firebase';
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { 
  ref, 
  uploadBytes, 
  getBlob,
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
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
let chat, messages = [];

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
      if (!chat) {
        chat = await CreateMLCEngine("SmolLM2-360M-Instruct-q4f16_1-MLC");
      }
      messages = [
        { role: "system", content: "Given split up input data from a user, parse all the important dates and deadlines from it, combining information from previous messages if neccesary, and format them with a new line between each event as follows: Brief description of event, date of event in format mm/dd/yy" },
      ];

      // Update document status to processing
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, { status: 'processing' });

      // Fetch the document metadata from Firestore
      const documentSnapshot = await getDoc(docRef);
      const documentData = documentSnapshot.data() as Document;

      // Download the file from Firebase Storage
      const storageRef = ref(storage, documentData.fileUrl);
      const fileBlob = await getBlob(storageRef);

      let fileText;
      // Convert the file to text
      if (documentData.fileType === 'application/pdf' || documentData.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const fs = require('fs');
        const path = require('path');
        // Save the file locally
        const localFilePath = path.join(__dirname, 'temp', documentData.fileName);
        fs.writeFileSync(localFilePath, Buffer.from(await fileBlob.arrayBuffer()));
        if (documentData.fileType === 'application/pdf'){
          const pdf = require('pdf-parse');
          let dataBuffer = fs.readFileSync(localFilePath);
          const pdfData = await pdf(dataBuffer);
          fileText = pdfData.text; 
          console.log("pdf translated"); // temporary for testing
        }
        else{
          const mammoth = require('mammoth');
          const mammothData = await mammoth.extractRawText({ path: localFilePath });
          fileText =  mammothData.value; 
        }
        // Clean up: Delete the local file after processing
        fs.unlinkSync(localFilePath);
      }
      else{
        fileText = await fileBlob.text();
      }

      // The ai can only process 4096 tokens at a time so splitting into chunks of 2500 words
      const words = fileText.split(/\s+/); // Split text into words
      let processed = "";
      for (let i = 0; i < words.length; i += 2500) {
        const chunk = (words.slice(i, i + 2500).join(" ")); // Create a chunk
        messages.push({ role: "user", content: chunk });
        console.log(chunk); // temporary for testing
        const reply = await chat.chat.completions.create({ messages, });
        messages.push({ role: "assistant", content: reply.choices[0].message.content });
        console.log(reply.choices[0].message.content); // temporary for testing
        processed += reply.choices[0].message.content + '\n';
      } 
      /*
        Possible additions to increase efficiency and user experience:
         - Add a progress bar to show the user how far along the processing is
         - gzip compression, Set proper HTTP caching headers, worker script, turn on webgpu,
           add chat capability to ask when certain deadlines are, ad hour to ai date
      */
      console.log(processed); // temporary for testing
      await updateDoc(docRef, {
        status: 'completed',
        processedContent: processed
      });
    } catch (error) {
      console.error('Error processing document:', error);
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, { status: 'error' });
      throw error;
    }
  }
}; 