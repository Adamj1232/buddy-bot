import buddyBotWebSocketService from './buddyBotWebSocketService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

class AuthService {
  private readonly API_URL = import.meta.env.VITE_API_SERVER_URL;
  private token: string | null = null;

  constructor() {
    // Try to restore token from sessionStorage on initialization
    this.token = sessionStorage.getItem('auth_token');
    
    // Setup WebSocket event listeners
    this.setupWebSocketEventListeners();
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.log(`Starting registration process for ${credentials.email}`);
    
    try {
      console.log(`Making POST request to ${this.API_URL}/auth/register`);
      const startTime = Date.now();
      
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      const requestTime = Date.now() - startTime;
      console.log(`API response received in ${requestTime}ms, status: ${response.status}`);

      if (!response.ok) {
        console.error(`Registration failed with status ${response.status}`);
        let errorMessage = 'Registration failed';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Registration successful, parsing response data');
      const rawResponseText = await response.text();
      console.log('Raw response:', rawResponseText);
      
      let data: AuthResponse;
      
      try {
        data = JSON.parse(rawResponseText);
        console.log('Parsed response:', data);
        
        // Ensure data has a proper structure for our app
        if (!data.user && data.token) {
          // Try to extract user info from JWT token, or create default
          try {
            // Most JWT tokens have user info encoded in them
            const tokenParts = data.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Extracted token payload:', payload);
              
              // Create user object from token payload
              data.user = {
                id: payload.sub || payload.id || 'unknown',
                email: payload.email || credentials.email,
                username: payload.username || credentials.username
              };
              
              console.log('Created user object from token:', data.user);
            }
          } catch (tokenError) {
            console.warn('Could not extract user info from token:', tokenError);
            
            // Create a default user object if extraction fails
            data.user = {
              id: 'unknown',
              email: credentials.email,
              username: credentials.username
            };
            
            console.log('Created default user object:', data.user);
          }
        }
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('No authentication token received');
      }
      
      console.log('Setting auth token and session state');
      this.setToken(data.token);
      
      console.log('Initializing WebSocket connection');
      await this.initializeWebSocket().catch(error => {
        // Don't block registration if WebSocket fails
        console.warn('WebSocket initialization failed, but continuing registration flow:', error);
      });

      console.log('Registration process completed successfully');
      return data;
    } catch (error) {
      console.error('Registration process failed:', error);
      throw error;
    }
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log(`Starting login process for ${credentials.email}`);
    
    try {
      console.log(`Making POST request to ${this.API_URL}/auth/login`);
      const startTime = Date.now();
      
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      const requestTime = Date.now() - startTime;
      console.log(`API response received in ${requestTime}ms, status: ${response.status}`);

      if (!response.ok) {
        console.error(`Login failed with status ${response.status}`);
        let errorMessage = 'Login failed';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      console.log('Login successful, parsing response data');
      const rawResponseText = await response.text();
      console.log('Raw response:', rawResponseText);
      
      let data: AuthResponse;
      
      try {
        data = JSON.parse(rawResponseText);
        console.log('Parsed response:', data);
        
        // Ensure data has a proper structure for our app
        if (!data.user && data.token) {
          // Try to extract user info from JWT token, or create default
          try {
            // Most JWT tokens have user info encoded in them
            const tokenParts = data.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Extracted token payload:', payload);
              
              // Create user object from token payload
              data.user = {
                id: payload.sub || payload.id || 'unknown',
                email: payload.email || credentials.email,
                username: payload.username || credentials.email.split('@')[0]
              };
              
              console.log('Created user object from token:', data.user);
            }
          } catch (tokenError) {
            console.warn('Could not extract user info from token:', tokenError);
            
            // Create a default user object if extraction fails
            data.user = {
              id: 'unknown',
              email: credentials.email,
              username: credentials.email.split('@')[0]
            };
            
            console.log('Created default user object:', data.user);
          }
        }
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('No authentication token received');
      }
      
      console.log('Setting auth token and session state');
      this.setToken(data.token);
      
      console.log('Initializing WebSocket connection');
      await this.initializeWebSocket().catch(error => {
        // Don't block login if WebSocket fails
        console.warn('WebSocket initialization failed, but continuing login flow:', error);
      });

      console.log('Login process completed successfully');
      return data;
    } catch (error) {
      console.error('Login process failed:', error);
      throw error;
    }
  }

  public logout(): void {
    try {
      // Clear token from memory
      this.token = null;
      
      // Clear token from storage
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('isLoggedIn');
      
      // Close WebSocket connection
      buddyBotWebSocketService.disconnect();
      
      // Optional: Call logout endpoint to invalidate token on server
      fetch(`${this.API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).catch(console.error);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private setToken(token: string): void {
    this.token = token;
    // Store token in sessionStorage (more secure than localStorage)
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('isLoggedIn', 'true');
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Setup WebSocket event listeners for authentication events
   */
  private setupWebSocketEventListeners(): void {
    // Handle WebSocket authentication success
    buddyBotWebSocketService.onAuthSuccess(() => {
      console.log('WebSocket authentication successful');
    });

    // Handle WebSocket authentication failure
    buddyBotWebSocketService.onAuthFailure((error) => {
      console.error('WebSocket authentication failed:', error);
    });
  }

  private async initializeWebSocket(): Promise<void> {
    if (!this.token) {
      console.log('No token available, skipping WebSocket initialization');
      return;
    }

    try {
      console.log('Initializing WebSocket connection');
      // Connect to WebSocket server
      await buddyBotWebSocketService.connect();
      
      // Authenticate WebSocket connection with token
      buddyBotWebSocketService.authenticate(this.token);
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      throw error;
    }
  }

  // Method to get authentication headers for API requests
  public getAuthHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}

// Export as singleton
export const authService = new AuthService(); 