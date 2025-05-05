/* written by: Ammar Akif and Leah Gonzalez
debugged by: Ammar Akif and Leah Gonzalez
tested by: Hussnain Yasir */
import React from 'react';
import { Calendar, Upload, BrainCircuit, Bell, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Designed for Productivity and Efficiency
          </h2>
          <p className="text-muted-foreground">
            Discover how our AI-powered calendar helps you stay organized, save time, and never miss a deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Upload />}
            title="Smart Document Upload"
            description="Upload syllabi, assignment sheets, and project briefs. Our AI automatically extracts deadlines and important dates."
            delay={0}
          />
          <FeatureCard 
            icon={<BrainCircuit />}
            title="AI Categorization"
            description="The system intelligently categorizes tasks based on urgency, type, and estimated workload for better organization."
            delay={100}
          />
          <FeatureCard 
            icon={<Bell />}
            title="Smart Reminders"
            description="Receive personalized notifications based on task priority, ensuring you never miss important deadlines."
            delay={200}
          />
          <FeatureCard 
            icon={<Calendar />}
            title="Intuitive Calendar"
            description="View your schedule in daily, weekly, or monthly formats with color-coded events for easy visualization."
            delay={300}
          />
          <FeatureCard 
            icon={<Users />}
            title="Seamless Collaboration"
            description="Share events and projects with classmates or team members for better coordination on group work."
            delay={400}
          />
          <FeatureCard 
            icon={<Zap />}
            title="Cross-Platform Sync"
            description="Synchronize with Google Calendar, Outlook, and other popular productivity tools you already use."
            delay={500}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className={cn(
        "glass group p-6 rounded-xl hover:shadow-xl transition-all duration-300 animate-scale-in border border-border",
        `animation-delay-${delay}`
      )}
    >
      <div className="w-12 h-12 mb-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Features;
