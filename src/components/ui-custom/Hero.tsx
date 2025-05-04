// written by: Ammar Akif and Leah Gonzalez
// debugged by: Ammar Akif and Leah Gonzalez
// tested by: Hussnain Yasir 
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium animate-fade-in">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Calendar Management
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
                Smart Calendar for <span className="text-primary">GPT</span> Scheduling
              </h1>
              <p className="text-lg text-foreground/80 mt-4 max-w-lg animation-delay-100 animate-slide-up">
                Revolutionize your time management with AI-powered document parsing, 
                intelligent task categorization, and seamless collaboration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animation-delay-200 animate-slide-up">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/features">Learn More</Link>
              </Button>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animation-delay-300 animate-slide-up">
              <FeatureBadge icon={<Calendar className="h-4 w-4" />} text="Sync Across Devices" />
              <FeatureBadge icon={<Clock className="h-4 w-4" />} text="Smart Reminders" />
              <FeatureBadge icon={<BookOpen className="h-4 w-4" />} text="Document Parsing" />
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative animation-delay-300 animate-fade-in">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/30 glass">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-white/5 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Calendar App Interface" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureBadgeProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-foreground/80">
    <div className="p-1.5 rounded-full bg-primary/10 text-primary">{icon}</div>
    <span>{text}</span>
  </div>
);

export default Hero;
