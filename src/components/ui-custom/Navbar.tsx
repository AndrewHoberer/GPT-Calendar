
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when navigating
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-8',
        isScrolled ? 'glass shadow-sm' : 'bg-transparent',
        isOpen ? 'bg-background' : ''
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="z-50">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="space-x-6">
            <NavLink to="/" active={isActiveLink('/')}>Home</NavLink>
            <NavLink to="/features" active={isActiveLink('/features')}>Features</NavLink>
            <NavLink to="/about" active={isActiveLink('/about')}>About</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="subtle" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="z-50 md:hidden focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={24} className="text-foreground" />
          ) : (
            <Menu size={24} className="text-foreground" />
          )}
        </button>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center space-y-6">
              <MobileNavLink to="/" active={isActiveLink('/')}>Home</MobileNavLink>
              <MobileNavLink to="/features" active={isActiveLink('/features')}>Features</MobileNavLink>
              <MobileNavLink to="/about" active={isActiveLink('/about')}>About</MobileNavLink>
            </div>
            <div className="flex flex-col items-center space-y-4 pt-4 w-full">
              <Button variant="subtle" size="md" asChild fullWidth className="max-w-[200px]">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="md" asChild fullWidth className="max-w-[200px]">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link 
    to={to} 
    className={cn(
      "inline-block text-sm font-medium transition-colors hover:text-primary relative py-1",
      active ? "text-primary" : "text-foreground/80"
    )}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
    )}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
  <Link 
    to={to} 
    className={cn(
      "text-lg font-medium transition-colors hover:text-primary",
      active ? "text-primary" : "text-foreground/80"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
