import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { LockKeyhole, Mail, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Check if login is disabled via environment variable
const isLoginDisabled = import.meta.env.VITE_DISABLE_LOGIN === 'true';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isLoggedIn, login, register, updateLoginStatus } = useAuth();

  // Check if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      console.log('User already logged in, redirecting to home');
      setRedirectToHome(true);
    }
  }, [isLoggedIn]);

  // If login is disabled or user is already logged in, redirect to main page
  if (isLoginDisabled || redirectToHome) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Form submitted');

    // Reduce the timeout to 3 seconds for a better user experience
    const loginTimeout = setTimeout(() => {
      console.log('Login timeout reached, forcing completion');
      setIsLoading(false);
      toast({
        title: "Login Processing",
        description: "Backend responded but UI may be slow. You can proceed to the homepage.",
        variant: "default"
      });
      
      // Set isLoggedIn in AuthContext manually and then navigate
      // This helps when there's a race condition between the API response and navigation
      updateLoginStatus(true);
      
      // Short delay before navigation to ensure context updates
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }, 3000); // 3 seconds timeout

    try {
      // Simple validation
      if (!email || !password || (!isLogin && !username)) {
        console.log('Validation failed: Missing fields');
        clearTimeout(loginTimeout);
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        console.log('Attempting login with AuthContext');
        const response = await login(email, password);
        console.log('Login successful, received response:', response);
        
        // Clear the timeout as we got a successful response
        clearTimeout(loginTimeout);
        
        // Get username from either the response user object or from the email
        const displayName = response.user?.username || email.split('@')[0] || 'user';
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${displayName}!`,
          variant: "default"
        });
        
        // Ensure context update before navigation
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } else {
        console.log('Attempting registration with AuthContext');
        const response = await register(email, password, username);
        console.log('Registration successful, received response:', response);
        
        // Clear the timeout as we got a successful response
        clearTimeout(loginTimeout);
        
        // Get username from either the response user object or from input
        const displayName = response.user?.username || username || email.split('@')[0] || 'user';
        
        toast({
          title: "Registration Successful",
          description: `Welcome, ${displayName}!`,
          variant: "default"
        });
        
        // Explicit navigate instead of relying on redirectToHome
        navigate('/', { replace: true });
      }
    } catch (error) {
      // Clear the timeout as we got an error response
      clearTimeout(loginTimeout);
      
      console.error('Authentication error:', error);
      toast({
        title: isLogin ? "Login Error" : "Registration Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive"
      });
    } finally {
      console.log('Resetting loading state in finally block');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-robot-dark">
      {/* Animated background gears */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="steampunk-cog w-64 h-64 top-10 -left-20 opacity-10 animate-radar-scan absolute"></div>
        <div className="steampunk-cog w-48 h-48 bottom-10 -right-10 opacity-10 animate-radar-scan-reverse absolute"></div>
        <div className="steampunk-cog w-96 h-96 -bottom-32 -left-32 opacity-5 animate-radar-scan-slow absolute"></div>
        <div className="steampunk-cog w-80 h-80 -top-20 right-0 opacity-5 animate-radar-scan-reverse-slow absolute"></div>
      </div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-robot-dark/90 pointer-events-none"></div>
      
      {/* Card with glow effect */}
      <Card className="w-[90%] max-w-md relative neo-blur neo-glow border-robot-metal/40 bg-robot-dark/80 backdrop-blur-lg overflow-hidden">
        {/* Scanning line effect */}
        <div className="absolute h-px w-full bg-robot-blue/50 top-0 animate-scanning-eye"></div>
        
        <CardHeader className="space-y-1 text-center relative">
          <div className="absolute left-4 top-0 w-16 h-px bg-gradient-to-r from-transparent via-robot-blue to-transparent"></div>
          <div className="absolute right-4 top-0 w-16 h-px bg-gradient-to-r from-robot-blue via-transparent to-transparent"></div>
          
          <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'} steampunk-title font-bold`}>
            Robo-Access Portal
          </CardTitle>
          <CardDescription className="text-robot-light/80">
            {isLogin ? "Log in to continue your journey" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-robot-light">Username</Label>
                <div className="cyber-input-container relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-robot-blue">
                    <User size={18} />
                  </div>
                  <Input 
                    id="username"
                    placeholder="Enter username" 
                    className="cyber-input pl-8 border-robot-metal/30 focus:border-robot-blue bg-robot-dark/70"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-robot-light">Email</Label>
              <div className="cyber-input-container relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-robot-blue">
                  <Mail size={18} />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  className="cyber-input pl-8 border-robot-metal/30 focus:border-robot-blue bg-robot-dark/70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-robot-light">Password</Label>
              <div className="cyber-input-container relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-robot-blue">
                  <LockKeyhole size={18} />
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="cyber-input pl-8 border-robot-metal/30 focus:border-robot-blue bg-robot-dark/70"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full build-finish-btn relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? "Login" : "Sign Up"
              )}
            </Button>
            
            <p className="text-center text-sm text-robot-light/80">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button 
                variant="link" 
                className="text-robot-blue hover:text-robot-purple p-0 ml-1" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(!isLogin);
                }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
