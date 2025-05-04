// written by: Ammar Akif and Leah Gonzalez
// debugged by: Ammar Akif and Leah Gonzalez
// tested by: Hussnain Yasir 
import React from 'react';
import Navbar from '@/components/ui-custom/Navbar';
import Hero from '@/components/ui-custom/Hero';
import Features from '@/components/ui-custom/Features';
import Footer from '@/components/ui-custom/Footer';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui-custom/Button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by Students and Faculty
              </h2>
              <p className="text-muted-foreground">
                Join thousands of students who have transformed their academic planning experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="The AI document parsing feature saved me hours of manual entry. Now all my deadlines are automatically in my calendar!"
                author="Leah G."
                role="Computer Science Student"
                delay={0}
              />
              <TestimonialCard 
                quote="As a professor, I appreciate how easily students can import my syllabus. It reduces confusion about assignment due dates."
                author="Dr. Ammar A."
                role="Assistant Professor"
                delay={100}
              />
              <TestimonialCard 
                quote="The task categorization is brilliant. It helps me balance my workload across all my courses so I'm never overwhelmed."
                author="Andrew H."
                role="Engineering Major"
                delay={200}
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Academic Planning?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join SmartCalendar today and experience the power of AI-assisted scheduling.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">
                  Get Started For Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, delay }) => {
  return (
    <div 
      className={`glass border border-border p-6 rounded-xl animate-scale-in animation-delay-${delay}`}
    >
      <div className="mb-4 text-primary">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6667 17.3333C9.2 17.3333 8 18.5333 8 20C8 21.4667 9.2 22.6667 10.6667 22.6667C12.1333 22.6667 13.3333 21.4667 13.3333 20C13.3333 13.7333 8.26667 8.66667 2 8.66667V12C6.4 12 10 15.6 10 20C10 21.4667 10.6667 17.3333 10.6667 17.3333ZM21.3333 17.3333C19.8667 17.3333 18.6667 18.5333 18.6667 20C18.6667 21.4667 19.8667 22.6667 21.3333 22.6667C22.8 22.6667 24 21.4667 24 20C24 13.7333 18.9333 8.66667 12.6667 8.66667V12C17.0667 12 20.6667 15.6 20.6667 20C20.6667 21.4667 21.3333 17.3333 21.3333 17.3333Z" fill="currentColor"/>
        </svg>
      </div>
      <p className="mb-6 text-foreground/90 italic">{quote}</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default Index;
