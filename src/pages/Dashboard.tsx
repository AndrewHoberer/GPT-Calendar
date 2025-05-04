// written by: Ammar Akif and Andrew Hoberer
// debugged by: Ammar Akif and Andrew Hoberer
// tested by: Hussnain Yasir 
import React, { useState, useEffect } from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui-custom/Logo';
import Button from '@/components/ui-custom/Button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TasksList } from '@/components/TasksList';
import { calendarService, Event } from '@/services/calendarService';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    // Check if we have a tab in the location state
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    // Load statistics
    if (user) {
      loadStatistics();
    }
  }, [location.state, user]);

  const loadStatistics = async () => {
    if (!user) return;
    try {
      // Get upcoming deadlines (next 7 days)
      const allEvents = await calendarService.getEvents(user.uid);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const upcoming = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      }).sort((a, b) => {
        // First sort by date
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        // Then sort by time
        if (a.time !== b.time) {
          return a.time.localeCompare(b.time);
        }
        // Finally sort by priority (high to low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      });
      
      setUpcomingDeadlines(upcoming.length);
      setUpcomingEvents(upcoming.slice(0, 4)); // Get first 4 upcoming events

      // Get uploaded documents count by counting unique courses from Document Import events
      const documentImportEvents = allEvents.filter(event => event.category === 'Document Import');
      const uniqueCourses = new Set(documentImportEvents.map(event => event.course));
      setUploadedDocuments(uniqueCourses.size);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
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
      <div className="w-64 bg-sidebar border-r border-border hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-4 border-b border-border">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <SidebarLink 
            icon={<Grid size={18} />} 
            label="Overview" 
            to="#" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          />
          <SidebarLink 
            icon={<CalendarIcon size={18} />} 
            label="Calendar" 
            to="/calendar" 
            active={activeTab === 'calendar'} 
          />
          <SidebarLink 
            icon={<List size={18} />} 
            label="Tasks" 
            to="#" 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')}
          />
          <SidebarLink 
            icon={<Upload size={18} />} 
            label="Upload Documents" 
            to="#" 
            active={activeTab === 'upload'} 
            onClick={() => setActiveTab('upload')}
          />
        </nav>
        
        <div className="p-4 border-t border-border sticky bottom-0 bg-sidebar">
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
        
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <header className="mb-8">
                <h1 className="text-2xl font-semibold">Welcome back, {user?.displayName || 'there'}</h1>
                <p className="text-muted-foreground">Here's an overview of your schedule and upcoming deadlines.</p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DashboardCard 
                  title="Upcoming Deadlines" 
                  value={upcomingDeadlines.toString()} 
                  description="Due this week" 
                  color="text-amber-500"
                  link="#"
                  linkText="View all deadlines"
                  onClick={() => setActiveTab('tasks')}
                />
                <DashboardCard 
                  title="Uploaded Documents" 
                  value={uploadedDocuments.toString()} 
                  description="Total documents" 
                  color="text-blue-500"
                  link="#"
                  linkText="View documents"
                  onClick={() => setActiveTab('upload')}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border animate-scale-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">Upcoming Deadlines</h2>
                    <Button variant="link" size="sm" onClick={() => navigate('/calendar')}>
                      View Calendar
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <DeadlineItem 
                        key={event.id}
                        title={event.title}
                        dueDate={`${new Date(event.date).toLocaleDateString()} at ${event.time}`}
                        category={event.category}
                        priority={event.priority as 'low' | 'medium' | 'high'}
                      />
                    ))}
                    {upcomingDeadlines > 4 && (
                      <div className="pt-2">
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => setActiveTab('tasks')}
                          className="text-primary hover:text-primary/80"
                        >
                          View {upcomingDeadlines - 4} more deadlines...
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="glass rounded-xl p-6 border animate-scale-in animation-delay-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">Quick Actions</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <QuickActionCard 
                        icon={<Upload size={20} />}
                        title="Upload Documents"
                        description="Process syllabi and assignments"
                        to="#"
                        onClick={() => setActiveTab('upload')}
                      />
                      <QuickActionCard 
                        icon={<CalendarIcon size={20} />}
                        title="View Calendar"
                        description="See your full schedule"
                        to="/calendar"
                      />
                      <QuickActionCard 
                        icon={<List size={20} />}
                        title="Manage Tasks"
                        description="Add or update tasks"
                        to="#"
                        onClick={() => setActiveTab('tasks')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'upload' && (
            <div className="animate-fade-in">
              <header className="mb-8">
                <h1 className="text-2xl font-semibold">Upload Documents</h1>
                <p className="text-muted-foreground">Upload syllabi or assignment sheets to extract deadlines automatically. (WebGPU must be enabled)</p>
              </header>
              
              <div className="w-full">
                {/* Render DocumentUpload here */}
                <DocumentUpload />
              </div>
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <div className="animate-fade-in">
              <header className="mb-8">
                <h1 className="text-2xl font-semibold">Tasks</h1>
                <p className="text-muted-foreground">Manage your upcoming tasks and deadlines.</p>
              </header>
              
              <div className="w-full">
                <TasksList />
              </div>
            </div>
          )}
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
      if (to === "#") {
        e.preventDefault();
        if (onClick) onClick();
      }
    }}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </Link>
);

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
  link: string;
  linkText: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, color, link, linkText, onClick }) => (
  <div className="glass rounded-xl p-6 border animate-scale-in">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className={cn("text-3xl font-semibold mt-2", color)}>{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
    <div className="mt-4">
      <button 
        onClick={onClick}
        className="text-sm text-primary hover:underline flex items-center"
      >
        {linkText}
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  </div>
);

interface DeadlineItemProps {
  title: string;
  dueDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

const DeadlineItem: React.FC<DeadlineItemProps> = ({ title, dueDate, category, priority }) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };
  
  return (
    <div className="flex items-center py-3 px-4 hover:bg-secondary/50 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-muted-foreground">{dueDate}</p>
      </div>
      <div className="flex items-center ml-4 space-x-2">
        <span className="text-xs px-2 py-1 rounded-full bg-secondary/80">
          {category}
        </span>
        <span className={cn("text-xs px-2 py-1 rounded-full", priorityColors[priority])}>
          {priority}
        </span>
      </div>
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, to, onClick }) => (
  <Link 
    to={to} 
    onClick={(e) => {
      if (to === "#" && onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className="p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all group"
  >
    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Link>
);

export default Dashboard;
