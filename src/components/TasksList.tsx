// written by: Andrew Hoberer
// debugged by: Andrew Hoberer
// tested by: Hussnain Yasir 
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Clock, BookOpen, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { calendarService, Event } from '@/services/calendarService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const TasksList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    date: '',
    time: '',
    category: '',
    course: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });
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
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const allEvents = await calendarService.getEvents(user.uid);
      const today = new Date().toISOString().split('T')[0];
      const upcomingEvents = allEvents
        .filter(event => event.date >= today)
        .sort((a, b) => {
          if (a.date === b.date) {
            return a.time.localeCompare(b.time);
          }
          return a.date.localeCompare(b.date);
        });
      setEvents(upcomingEvents);
      setAllEvents(allEvents.sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      }));
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      date: event.date,
      time: event.time,
      category: event.category,
      course: event.course,
      priority: event.priority,
      description: event.description || ''
    });
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !user) return;
    try {
      await calendarService.updateEvent(editingEvent.id, editForm);
      toast.success('Event updated successfully');
      setEditingEvent(null);
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;
    try {
      await calendarService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
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

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await calendarService.addEvent(user.uid, newEvent);
      toast.success('Event added successfully');
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
      loadEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="space-y-8">
      {/* Upcoming Tasks Section */}
      <div className="glass rounded-xl p-6 border animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Upcoming Tasks</h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddEventForm(true)}>
            Add Task
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming tasks
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div key={event.id} className="p-4 bg-card rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{new Date(new Date(event.date).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{event.course}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>{event.category}</span>
                      </div>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-sm font-medium", getPriorityColor(event.priority))}>
                      {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Tasks Section */}
      <div className="glass rounded-xl p-6 border animate-scale-in animation-delay-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">All Tasks</h2>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : allEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allEvents.map(event => (
              <div key={event.id} className="p-4 bg-card rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{new Date(new Date(event.date).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{event.course}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>{event.category}</span>
                      </div>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-sm font-medium", getPriorityColor(event.priority))}>
                      {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course">Course</Label>
                <Input
                  id="edit-course"
                  value={editForm.course}
                  onChange={(e) => setEditForm(prev => ({ ...prev, course: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <select
                id="edit-priority"
                value={editForm.priority}
                onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={showAddEventForm} onOpenChange={setShowAddEventForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancelAddEvent}>
                Cancel
              </Button>
              <Button type="submit">
                Add Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 