
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Upload, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui-custom/Logo';
import Button from '@/components/ui-custom/Button';
import { toast } from 'sonner';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Basic info, Step 2: Additional info
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.name) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.email) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.password) {
      toast.error('Please enter a password');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real app, you would register with a backend service here
      console.log('Register with:', formData);
      
      toast.success('Registration successful! Welcome to SmartCalendar.');
      
      // Redirect to dashboard (in a real app)
      // navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
        </div>
        
        <div className="glass p-8 rounded-xl shadow-xl shadow-primary/5 border border-white/20 relative animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-white/5 rounded-xl pointer-events-none" />
          
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {step === 1 ? 'Create Your Account' : 'Complete Your Profile'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-background/50",
                        )}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-background/50",
                        )}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={cn(
                          "w-full pl-10 pr-10 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-background/50",
                        )}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={cn(
                          "w-full pl-10 pr-10 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-background/50",
                        )}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    fullWidth 
                    onClick={nextStep} 
                    className="mt-6"
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        <h3 className="text-sm font-medium">Connect Calendar</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Connect your Google or Outlook calendar to sync events automatically.
                      </p>
                      <div className="flex space-x-3 mt-3">
                        <Button variant="outline" size="sm" className="text-xs flex items-center w-full justify-center">
                          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Google Calendar
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs flex items-center w-full justify-center">
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.52,7.25h-15c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2v-10C21.52,8.15,20.62,7.25,19.52,7.25z M12.52,17.5l-5-3.1v-6.12l5,2.5l5-2.5v6.12L12.52,17.5z M12.52,10.9L5.52,7.25h14L12.52,10.9z" />
                          </svg>
                          Outlook
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Upload className="h-5 w-5 text-primary mr-2" />
                        <h3 className="text-sm font-medium">Upload Syllabus</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload your course syllabi to automatically extract deadlines and assignments.
                      </p>
                      <Button variant="subtle" size="sm" className="text-xs w-full mt-3">
                        Upload Files Later
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <Button variant="outline" type="button" onClick={prevStep} fullWidth>
                      Back
                    </Button>
                    <Button type="submit" isLoading={isLoading} fullWidth>
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 1 && (
                <>
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-border w-full absolute"></div>
                    <div className="relative bg-card px-4 text-xs text-muted-foreground">
                      OR SIGN UP WITH
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" fullWidth>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" type="button" fullWidth>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </>
              )}
            </form>
            
            {step === 1 && (
              <div className="text-center mt-6 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
