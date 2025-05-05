/* written by: Ammar Akif and Andrew Hoberer and Leah Gonzalez
debugged by: Ammar Akif and Andrew Hoberer and Leah Gonzalez
tested by: Hussnain Yasir */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Grid, 
  Upload, 
  Bell, 
  Settings, 
  List, 
  BarChart3,
  ChevronRight,
  Users,
  LogOut,
  Clock,
  BookOpen,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { calendarService } from '@/services/calendarService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Logo from '@/components/ui-custom/Logo';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  course: string;
  priority: string;
  description?: string;
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, to, active, onClick }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
      active 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
    onClick={(e) => {
      if (to === "#" && onClick) {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </Link>
);

const Calendar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
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
    if (user && selectedDate) {
      loadEvents();
    }
  }, [user, selectedDate]);

  const loadEvents = async () => {
    if (!user || !selectedDate) return;
    
    try {
      setIsLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const events = await calendarService.getEventsByDate(user.uid, formattedDate);
      setEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      await calendarService.addEvent(user.uid, newEvent);
      toast.success('Event added successfully');
      setShowAddEventForm(false);
      setNewEvent({
        title: '',
        date: selectedDate.toISOString().split('T')[0],
        time: '00:00',
        category: '',
        course: '',
        priority: 'medium',
        description: ''
      });
      loadEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      await calendarService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setIsLoading(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() || '?';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-border hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarLink 
            icon={<Grid size={18} />} 
            label="Overview" 
            to="#" 
            active={activeTab === 'overview'} 
            onClick={() => {
              setActiveTab('overview');
              navigate('/dashboard', { state: { activeTab: 'overview' } });
            }}
          />
          <SidebarLink 
            icon={<CalendarIcon size={18} />} 
            label="Calendar" 
            to="#" 
            active={activeTab === 'calendar'} 
            onClick={() => {
              setActiveTab('calendar');
              navigate('/calendar');
            }}
          />
          <SidebarLink 
            icon={<List size={18} />} 
            label="Tasks" 
            to="#" 
            active={activeTab === 'tasks'} 
            onClick={() => {
              setActiveTab('tasks');
              navigate('/dashboard', { state: { activeTab: 'tasks' } });
            }}
          />
          <SidebarLink 
            icon={<Upload size={18} />} 
            label="Upload Documents" 
            to="#" 
            active={activeTab === 'upload'} 
            onClick={() => {
              setActiveTab('upload');
              navigate('/dashboard', { state: { activeTab: 'upload' } });
            }}
          />
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="text-sm font-medium">{userInitials}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.displayName || user?.email}</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 glass sticky top-0 z-10">
          <div className="md:hidden">
            <Logo />
          </div>
          
          <div className="flex items-center space-x-3 ml-auto">
            <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            
            <div className="relative">
              <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary md:hidden">
                <span className="text-sm font-medium">{userInitials}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Calendar Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            <header className="mb-8">
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <p className="text-muted-foreground">View and manage your schedule.</p>
            </header>
            
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="md:col-span-2 bg-card rounded-xl shadow-sm p-4 border border-border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      {selectedDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <Button onClick={handleAddEvent}>Add Event</Button>
                  </div>
                  <div className="w-full">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                
                {/* Events for selected date */}
                <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
                  </h2>
                  
                  {isLoading ? (
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
                          disabled={isLoading}
                        >
                          {isLoading ? 'Adding...' : 'Add Event'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
