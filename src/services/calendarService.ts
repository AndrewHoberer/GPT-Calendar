/* written by: Ammar Akif and Andrew Hoberer
debugged by: Ammar Akif and Andrew Hoberer
tested by: Hussnain Yasir */
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
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(eventsQuery);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Event[];

    // Sort events by date in memory
    return events.sort((a, b) => a.date.localeCompare(b.date));
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
  },

  async deleteEventsByCourse(userId: string, course: string) {
    const eventsQuery = query(
      collection(db, 'events'),
      where('userId', '==', userId),
      where('course', '==', course)
    );

    const querySnapshot = await getDocs(eventsQuery);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    return querySnapshot.size;
  }
}; 