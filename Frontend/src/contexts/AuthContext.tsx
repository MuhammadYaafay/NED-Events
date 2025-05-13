import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type FC,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/utils/apiUtils";
import { removeAuthToken, setAuthToken, getAuthToken, type User } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";


interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  refreshUser: () => Promise<void>;
}

interface LoginResponse {
  token: string;
  user: User;
  success: boolean;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiRequest("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User refreshed:", response.user);
      setUser(response.user);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null); // Clear user state on error
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => {
    try {
      const response = (await apiRequest("/api/auth/register", {
        method: "POST",
        body: { 
          name, 
          email, 
          password, 
          role
        },
        headers: {
          "Content-Type": "application/json",
        },
      })) as LoginResponse;
      
      if (response.success) {
        toast({
          title: "Registration successful",
          description: "You have been registered successfully. Please login to continue.",
        });
        navigate("/login", { replace: true });
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration.",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = (await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email, password },
        headers: {
          "Content-Type": "application/json",
        },
      })) as LoginResponse;
      
      if (response.success) {
        setAuthToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        navigate("/");
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null); // Set user to null first
      await removeAuthToken();
      localStorage.removeItem("NEDevents-token");
      localStorage.removeItem("user");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
      navigate("/login", { replace: true }); // Use replace to prevent going back to authenticated state
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred while trying to log out.",
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        await refreshUser();
      } catch (error) {
        console.error("Error in checkAuth:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const isAuthenticated = () => {
    return !!getAuthToken();
  }


  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, setUser, register, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

