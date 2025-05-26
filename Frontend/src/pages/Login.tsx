import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Store, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import { apiRequest } from '@/utils/apiUtils';
import { setAuthToken, type User } from '@/utils/authUtils';

interface LoginResponse {
  token: string;
  user: User;
}

const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Save token for authenticated routes
  setAuthToken(response.token);
  return response;
}

const Login = () => {
  const { setUser } = useAuth(); // Get setUser from auth context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user } = await login(email, password);
      
      // Update user in auth context
      if (setUser) {
        
        setUser(user);

        localStorage.setItem("role", user.role);
      }
      
      toast({
        title: "Success",
        description: `Logged in successfully as ${user.role}`,
      });
      
      
      // Redirect based on user role
      if (user.role === 'vendor') {
        navigate('/vendor-profile');
      } else if (user.role === 'organizer') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container max-w-md mx-auto py-16 px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
