
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// Define types for our context
type UserRole = 'attendee' | 'vendor' | 'organizer' | 'admin';

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data for demonstration
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://github.com/shadcn.png',
    role: 'attendee',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://github.com/shadcn.png',
    role: 'vendor',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    image: 'https://github.com/shadcn.png',
    role: 'organizer',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from localStorage in this example)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate a successful login with our sample users
      const foundUser = sampleUsers.find(u => u.email === email);
      
      if (foundUser) {
        // Update the user's role based on the selection
        const userWithSelectedRole = { ...foundUser, role };
        setUser(userWithSelectedRole);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithSelectedRole));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        // For demo purposes, create a new user if not found
        const newUser: User = {
          id: String(sampleUsers.length + 1),
          name: email.split('@')[0],
          email,
          role,
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast({
          title: "Login successful",
          description: `Welcome, ${newUser.name}!`,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // In a real app, this would be an API call to your backend
      const newUser: User = {
        id: String(sampleUsers.length + 1),
        name,
        email,
        role,
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Account created successfully",
        description: `Welcome to NED Events, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An error occurred during sign up. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out successfully",
      description: "You've been logged out of your account.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
