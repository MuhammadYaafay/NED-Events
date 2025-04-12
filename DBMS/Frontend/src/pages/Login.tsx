
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, User, Store, LayoutDashboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'attendee' | 'vendor' | 'organizer'>('attendee');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

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
      await login(email, password, userRole);
      
      toast({
        title: "Success",
        description: `Logged in successfully as ${userRole}`,
      });
      
      // Redirect based on user role
      if (userRole === 'vendor') {
        navigate('/vendor-profile');
      } else if (userRole === 'organizer') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
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
              
              <div className="space-y-2">
                <Label>Login as</Label>
                <RadioGroup 
                  value={userRole} 
                  onValueChange={(value) => setUserRole(value as 'attendee' | 'vendor' | 'organizer')}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem 
                      value="attendee" 
                      id="attendee" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="attendee"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <User className="mb-2 h-5 w-5" />
                      Attendee
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="vendor" 
                      id="vendor" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="vendor"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Store className="mb-2 h-5 w-5" />
                      Vendor
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="organizer" 
                      id="organizer" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="organizer"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <LayoutDashboard className="mb-2 h-5 w-5" />
                      Organizer
                    </Label>
                  </div>
                </RadioGroup>
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
