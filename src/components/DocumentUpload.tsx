/* written by: Ammar Akif and Andrew Hoberer
debugged by: Ammar Akif and Andrew Hoberer
tested by: Hussnain Yasir */
import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, Loader2, Edit2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documentService } from '@/services/documentService';
import { calendarService, Event } from '@/services/calendarService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export const DocumentUpload = () => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState<{ name: string; progress: number } | null>(null);
  const [processedEvents, setProcessedEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [collapsedSyllabi, setCollapsedSyllabi] = useState<Set<string>>(new Set());
  const [webGPUError, setWebGPUError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
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
      loadProcessedEvents();
    }
  }, [user]);

  const loadProcessedEvents = async () => {
    if (!user) return;
    try {
      const events = await calendarService.getEvents(user.uid);
      const importedEvents = events.filter(event => 
        event.category === 'Document Import' && 
        event.userId === user.uid
      );
      // Sort events by course (syllabus name) and then by date
      const sortedEvents = importedEvents.sort((a, b) => {
        if (a.course === b.course) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return a.course.localeCompare(b.course);
      });
      setProcessedEvents(sortedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files?.length) return;

    const file = event.target.files[0];

    try {
      setProcessing({ name: file.name, progress: 0 });
      setWebGPUError(null);
      
      // Create a progress callback
      const onProgress = (progress: number) => {
        setProcessing(prev => prev ? { ...prev, progress } : null);
      };

      await documentService.processDocument(file, user.uid, onProgress);
      setProcessing(null);
      toast.success('Document processed successfully');
      loadProcessedEvents();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      if (error.message && error.message.includes('WebGPU')) {
        setWebGPUError(error.message);
      } else {
        toast.error('Failed to upload document');
      }
      setProcessing(null);
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
      loadProcessedEvents();
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
      loadProcessedEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleDeleteAllEvents = async (course: string) => {
    if (!user) return;
    try {
      const count = await calendarService.deleteEventsByCourse(user.uid, course);
      toast.success(`Deleted ${count} events from ${course}`);
      loadProcessedEvents();
    } catch (error) {
      console.error('Error deleting events:', error);
      toast.error('Failed to delete events');
    }
  };

  const toggleSyllabusCollapse = (course: string) => {
    setCollapsedSyllabi(prev => {
      const newSet = new Set(prev);
      if (newSet.has(course)) {
        newSet.delete(course);
      } else {
        newSet.add(course);
      }
      return newSet;
    });
  };

  // Group events by course
  const eventsByCourse = processedEvents.reduce((acc, event) => {
    if (!acc[event.course]) {
      acc[event.course] = [];
    }
    acc[event.course].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6">
      {webGPUError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">{webGPUError}</p>
        </div>
      )}
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt"
          />
          <Button
            asChild
            className="relative"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing {processing.name}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </label>
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {processing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Processing {processing.name}</span>
            <span>{Math.round(processing.progress)}%</span>
          </div>
          <Progress value={processing.progress} className="h-2" />
        </div>
      )}

      {/* Processed Events List */}
      {processedEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Processed Events</h3>
          <div className="space-y-4">
            {Object.entries(eventsByCourse).map(([course, events]) => (
              <div key={course} className="bg-card rounded-lg border">
                <div className="flex items-center justify-between p-4 border-b">
                  <button
                    onClick={() => toggleSyllabusCollapse(course)}
                    className="flex items-center space-x-2 hover:text-primary"
                  >
                    {collapsedSyllabi.has(course) ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">{course}</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAllEvents(course)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                </div>
                {!collapsedSyllabi.has(course) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex flex-col p-4 bg-background rounded-lg border">
                        <div className="flex-grow">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(() => {
                              const date = new Date(event.date);
                              date.setDate(date.getDate() + 1);
                              return date.toLocaleDateString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric'
                              });
                            })()}
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
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
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Title</label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Date</label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label>Time</label>
                <Input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Category</label>
                <Input
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label>Course</label>
                <Input
                  value={editForm.course}
                  onChange={(e) => setEditForm(prev => ({ ...prev, course: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label>Priority</label>
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
    </div>
  );
}; 