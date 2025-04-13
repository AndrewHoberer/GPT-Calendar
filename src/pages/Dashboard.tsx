import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui-custom/Logo';
import Button from '@/components/ui-custom/Button';
import UploadCard from '@/components/ui-custom/UploadCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file);
    // In a real app, you would process the file and extract dates here
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
          <SidebarLink 
            icon={<Bell size={18} />} 
            label="Notifications" 
            to="#" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          />
          <SidebarLink 
            icon={<Users size={18} />} 
            label="Collaboration" 
            to="#" 
            active={activeTab === 'collaboration'} 
            onClick={() => setActiveTab('collaboration')}
          />
          <SidebarLink 
            icon={<BarChart3 size={18} />} 
            label="Analytics" 
            to="#" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
          />
          <SidebarLink 
            icon={<Settings size={18} />} 
            label="Settings" 
            to="#" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
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
        
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <header className="mb-8">
                <h1 className="text-2xl font-semibold">Welcome back, {user?.displayName || 'there'}</h1>
                <p className="text-muted-foreground">Here's an overview of your schedule and upcoming deadlines.</p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardCard 
                  title="Upcoming Deadlines" 
                  value="5" 
                  description="Due this week" 
                  color="text-amber-500"
                  link="#"
                  linkText="View all deadlines"
                />
                <DashboardCard 
                  title="Completed Tasks" 
                  value="12" 
                  description="Last 7 days" 
                  color="text-green-500"
                  link="#"
                  linkText="Task history"
                />
                <DashboardCard 
                  title="Uploaded Documents" 
                  value="3" 
                  description="Total documents" 
                  color="text-blue-500"
                  link="#"
                  linkText="View documents"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border animate-scale-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">Upcoming Deadlines</h2>
                    <Button variant="link" size="sm" asChild>
                      <Link to="#">View Calendar</Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <DeadlineItem 
                      title="CS 3354: Requirements Document"
                      dueDate="Tomorrow, 11:59 PM"
                      category="Assignment"
                      priority="high"
                    />
                    <DeadlineItem 
                      title="MATH 2414: Quiz 3"
                      dueDate="Mar 12, 10:00 AM"
                      category="Quiz"
                      priority="medium"
                    />
                    <DeadlineItem 
                      title="HIST 1301: Research Paper Outline"
                      dueDate="Mar 15, 11:59 PM"
                      category="Assignment"
                      priority="medium"
                    />
                    <DeadlineItem 
                      title="PHIL 2306: Discussion Post"
                      dueDate="Mar 16, 11:59 PM"
                      category="Discussion"
                      priority="low"
                    />
                  </div>
                </div>
                
                <div className="glass rounded-xl p-6 border animate-scale-in animation-delay-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold">Quick Actions</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <UploadCard 
                      onFileUpload={handleFileUpload}
                      className="border-border"
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                <p className="text-muted-foreground">Upload syllabi or assignment sheets to extract deadlines automatically.</p>
              </header>
              
              <div className="max-w-2xl mx-auto">
                <UploadCard onFileUpload={handleFileUpload} />
              </div>
            </div>
          )}
          
          {/* Implement other tabs as needed */}
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
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, color, link, linkText }) => (
  <div className="glass rounded-xl p-6 border animate-scale-in">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className={cn("text-3xl font-semibold mt-2", color)}>{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
    <div className="mt-4">
      <Link to={link} className="text-sm text-primary hover:underline flex items-center">
        {linkText}
        <ChevronRight size={16} className="ml-1" />
      </Link>
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
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, to }) => (
  <Link to={to} className="p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all group">
    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Link>
);

export default Dashboard;
