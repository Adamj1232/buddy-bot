import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import buddyBotWebSocketService from "@/services/buddyBotWebSocketService";
import { authService } from "@/services/authService";

const queryClient = new QueryClient();

// Check if login is disabled via environment variable
const isLoginDisabled = import.meta.env.VITE_DISABLE_LOGIN === 'true';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in from session storage
    const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus || isLoginDisabled);
    
    // Log the authentication status
    console.log('User login status:', loggedInStatus ? 'Logged in' : 'Not logged in');
    console.log('Login disabled:', isLoginDisabled);
    
    // If logged in, try to connect WebSocket
    if (loggedInStatus) {
      const token = authService.getToken();
      console.log('User has token:', !!token);
      
      if (token) {
        // Connect WebSocket
        buddyBotWebSocketService.connect()
          .then(() => {
            console.log('WebSocket connected in App component');
            buddyBotWebSocketService.authenticate(token);
          })
          .catch(error => {
            console.error('WebSocket connection failed in App component:', error);
          });
      }
    }
    
    // Cleanup function to disconnect WebSocket when component unmounts
    return () => {
      console.log('App component unmounting, cleaning up WebSocket');
      buddyBotWebSocketService.disconnect();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn && !isLoginDisabled) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
