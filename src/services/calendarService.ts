import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  course: string;
  priority: "low" | "medium" | "high";
  description?: string;
  userId: string;
  createdAt: Date;
}

export const calendarService = {
  async addEvent(userId: string, event: Omit<Event, 'id' | 'userId' | 'createdAt'>) {
    const eventData = {
      ...event,
      userId,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'events'), eventData);
    return { id: docRef.id, ...eventData };
  },

  async getEvents(userId: string) {
    const eventsQuery = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(eventsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Event[];
  },

  async getEventsByDate(userId: string, date: string) {
    const eventsQuery = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      where('date', '==', date)
    );

    const querySnapshot = await getDocs(eventsQuery);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Event[];

    // Sort events by time in memory
    return events.sort((a, b) => a.time.localeCompare(b.time));
  },

  async updateEvent(eventId: string, updates: Partial<Event>) {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, updates);
    return { id: eventId, ...updates };
  },

  async deleteEvent(eventId: string) {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    return eventId;
  }
}; 