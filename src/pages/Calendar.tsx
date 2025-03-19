
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  List,
  Upload,
  Bell,
  Settings,
  Users,
  BarChart3,
  Plus
} from 'lucide-react';
import { format, addMonths, subMonths, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui-custom/Logo';
import Button from '@/components/ui-custom/Button';

// Mock event data
const EVENTS = [
  {
    id: '1',
    title: 'CS 3354: Requirements Document',
    date: '2025-03-09',
    time: '23:59',
    category: 'assignment',
    course: 'CS 3354',
    priority: 'high',
  },
  {
    id: '2',
    title: 'MATH 2414: Quiz 3',
    date: '2025-03-12',
    time: '10:00',
    category: 'quiz',
    course: 'MATH 2414',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'HIST 1301: Research Paper Outline',
    date: '2025-03-15',
    time: '23:59',
    category: 'assignment',
    course: 'HIST 1301',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'PHIL 2306: Discussion Post',
    date: '2025-03-16',
    time: '23:59',
    category: 'discussion',
    course: 'PHIL 2306',
    priority: 'low',
  },
  {
    id: '5',
    title: 'CS 3354: Project Update Meeting',
    date: '2025-03-10',
    time: '15:00',
    category: 'meeting',
    course: 'CS 3354',
    priority: 'medium',
  },
  {
    id: '6',
    title: 'MATH 2414: Homework 5',
    date: '2025-03-14',
    time: '23:59',
    category: 'assignment',
    course: 'MATH 2414',
    priority: 'medium',
  },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  // Get all days in the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return EVENTS.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };
  
  // Count events for a specific date
  const getEventCountForDate = (date: Date) => {
    return getEventsForDate(date).length;
  };
  
  const getDayClassName = (day: Date) => {
    return cn(
      'relative h-14 border border-border p-2 transition-all hover:bg-secondary/30 cursor-pointer',
      {
        'bg-calendar-today': isToday(day),
        'text-muted-foreground': !isSameMonth(day, currentDate),
        'border-primary': selectedDate && isSameDay(day, selectedDate),
      }
    );
  };
  
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  
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
            to="/dashboard" 
            active={false}
          />
          <SidebarLink 
            icon={<CalendarIcon size={18} />} 
            label="Calendar" 
            to="/calendar" 
            active={true}
          />
          <SidebarLink 
            icon={<List size={18} />} 
            label="Tasks" 
            to="#" 
            active={false}
          />
          <SidebarLink 
            icon={<Upload size={18} />} 
            label="Upload Documents" 
            to="#" 
            active={false}
          />
          <SidebarLink 
            icon={<Bell size={18} />} 
            label="Notifications" 
            to="#" 
            active={false}
          />
          <SidebarLink 
            icon={<Users size={18} />} 
            label="Collaboration" 
            to="#" 
            active={false}
          />
          <SidebarLink 
            icon={<BarChart3 size={18} />} 
            label="Analytics" 
            to="#" 
            active={false}
          />
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Settings" 
            to="#" 
            active={false}
          />
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="text-sm font-medium">LG</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Leah Gonzalez</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
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
                <span className="text-sm font-medium">LG</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Calendar Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-semibold">Calendar</h1>
                <p className="text-muted-foreground">Manage your schedule and deadlines</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex items-center rounded-lg border border-border overflow-hidden">
                  <button 
                    className="p-2 hover:bg-secondary transition-colors"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="px-3 py-1 font-medium">
                    {format(currentDate, 'MMMM yyyy')}
                  </div>
                  <button 
                    className="p-2 hover:bg-secondary transition-colors"
                    onClick={goToNextMonth}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="flex items-center rounded-lg border border-border overflow-hidden">
                  <button 
                    className={cn("px-3 py-1 text-sm transition-colors", view === 'month' ? 'bg-primary text-white' : 'hover:bg-secondary')}
                    onClick={() => setView('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={cn("px-3 py-1 text-sm transition-colors", view === 'week' ? 'bg-primary text-white' : 'hover:bg-secondary')}
                    onClick={() => setView('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={cn("px-3 py-1 text-sm transition-colors", view === 'day' ? 'bg-primary text-white' : 'hover:bg-secondary')}
                    onClick={() => setView('day')}
                  >
                    Day
                  </button>
                </div>
              </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              {/* Calendar View */}
              <div className="md:col-span-5">
                <div className="bg-card rounded-xl border animate-scale-in">
                  <div className="grid grid-cols-7 bg-secondary/50 rounded-t-xl">
                    {days.map((day) => (
                      <div key={day} className="py-3 text-center text-sm font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, i) => (
                      <div
                        key={i}
                        className={getDayClassName(day)}
                        onClick={() => handleDateClick(day)}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm">{format(day, 'd')}</span>
                          {getEventCountForDate(day) > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                              {getEventCountForDate(day)}
                            </span>
                          )}
                        </div>
                        
                        {getEventCountForDate(day) > 0 && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-muted-foreground">High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-muted-foreground">Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">Low Priority</span>
                  </div>
                </div>
              </div>
              
              {/* Events for Selected Date */}
              <div className="md:col-span-2">
                <div className="bg-card rounded-xl border p-4 animate-scale-in animation-delay-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium">
                      {selectedDate 
                        ? format(selectedDate, 'MMMM d, yyyy') 
                        : 'Select a date'}
                    </h2>
                    <Button size="sm" variant="outline">
                      <Plus size={16} className="mr-1" /> Add Event
                    </Button>
                  </div>
                  
                  {selectedDate ? (
                    <>
                      {getEventsForDate(selectedDate).length > 0 ? (
                        <div className="space-y-3">
                          {getEventsForDate(selectedDate).map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <CalendarIcon className="mx-auto h-12 w-12 text-muted" />
                          <p className="mt-2 text-muted-foreground">No events for this day</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <CalendarIcon className="mx-auto h-12 w-12 text-muted" />
                      <p className="mt-2 text-muted-foreground">Select a date to view events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
      active 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </Link>
);

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  course: string;
  priority: 'low' | 'medium' | 'high';
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const categoryColors = {
    assignment: "bg-blue-100 text-blue-800",
    quiz: "bg-purple-100 text-purple-800",
    discussion: "bg-teal-100 text-teal-800",
    meeting: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border",
      priorityColors[event.priority]
    )}>
      <div className="flex items-start justify-between">
        <h3 className="font-medium truncate">{event.title}</h3>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm">{event.time}</div>
        <div className="flex space-x-2">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            // @ts-ignore
            categoryColors[event.category]
          )}>
            {event.category}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">
            {event.course}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
