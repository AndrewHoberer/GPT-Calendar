import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, BookOpen, Tag, AlertTriangle } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { calendarService, Event } from '@/services/calendarService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Calendar = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    category: '',
    course: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });

  useEffect(() => {
    if (user && date) {
      loadEvents();
    }
  }, [user, date]);

  const loadEvents = async () => {
    if (!user || !date) return;
    
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const events = await calendarService.getEventsByDate(user.uid, formattedDate);
      setEvents(events);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setShowAddEventForm(true);
  };

  const handleCancelAddEvent = () => {
    setShowAddEventForm(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      category: '',
      course: '',
      priority: 'medium',
      description: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await calendarService.addEvent(user.uid, newEvent);
      toast.success('Event added successfully');
      setShowAddEventForm(false);
      loadEvents();
      setNewEvent({
        title: '',
        date: '',
        time: '',
        category: '',
        course: '',
        priority: 'medium',
        description: ''
      });
    } catch (error: any) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      await calendarService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Calendar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="md:col-span-2 bg-card rounded-xl shadow-sm p-4 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </div>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          
          {/* Events for selected date */}
          <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
            <h2 className="text-xl font-semibold mb-4">
              {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="p-3 bg-background rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={cn("text-sm font-medium", getPriorityColor(event.priority))}>
                          {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{event.course}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>{event.category}</span>
                      </div>
                      {event.description && (
                        <div className="mt-2 text-sm">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No events for this date</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Add Event Form */}
        {showAddEventForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl shadow-lg p-6 max-w-md w-full border border-border">
              <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
              
              <form onSubmit={handleSubmitEvent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newEvent.title} 
                    onChange={handleInputChange} 
                    placeholder="Assignment, Exam, etc." 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      name="date" 
                      type="date" 
                      value={newEvent.date} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      name="time" 
                      type="time" 
                      value={newEvent.time} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      name="category" 
                      value={newEvent.category} 
                      onChange={handleInputChange} 
                      placeholder="Assignment, Exam, etc." 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input 
                      id="course" 
                      name="course" 
                      value={newEvent.course} 
                      onChange={handleInputChange} 
                      placeholder="MATH 101, etc." 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newEvent.description} 
                    onChange={handleInputChange} 
                    placeholder="Add any additional details..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelAddEvent}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Event'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
