/**
 * BuddyBot WebSocket Client
 * 
 * A TypeScript client for connecting to the BuddyBot WebSocket server.
 * This client handles authentication, heartbeat, and message exchanges.
 */

interface AuthPayload {
  token: string;
}

interface QueryPayload {
  text: string;
}

// Client message types that can be sent to the server
type ClientMessage = 
  | { type: 'auth', payload: AuthPayload }
  | { type: 'query', payload: QueryPayload }
  | { type: 'ping' }
  | { type: 'pong' };

// Server message types that can be received from the server
type ServerMessage = 
  | { type: 'auth_result', payload: { success: boolean, error?: string } }
  | { type: 'response', payload: { text: string } }
  | { type: 'error', payload: { message: string } }
  | { type: 'ping' }
  | { type: 'pong' };

export type WebSocketStatus = 'connecting' | 'connected' | 'authenticated' | 'disconnected' | 'error';

class BuddyBotWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token?: string;
  private heartbeatInterval?: number;
  private reconnectInterval?: number;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeoutMs: number = 3000;
  private heartbeatTimeoutMs: number = 30000; // 30 seconds
  private authenticated: boolean = false;
  private status: WebSocketStatus = 'disconnected';

  private onOpenCallbacks: (() => void)[] = [];
  private onCloseCallbacks: ((event: CloseEvent) => void)[] = [];
  private onErrorCallbacks: ((event: Event) => void)[] = [];
  private onMessageCallbacks: ((message: ServerMessage) => void)[] = [];
  private onAuthSuccessCallbacks: (() => void)[] = [];
  private onAuthFailureCallbacks: ((error?: string) => void)[] = [];
  private onResponseCallbacks: ((text: string) => void)[] = [];
  private onStatusChangeCallbacks: ((status: WebSocketStatus) => void)[] = [];

  constructor(url: string = import.meta.env.VITE_WS_SERVER_URL) {
    this.url = url;
    console.log(`WebSocket client initialized with URL: ${this.url}`);
    
    // Log every event for debugging
    this.onOpen(() => console.log('WebSocket connection established'));
    this.onClose((event) => console.log('WebSocket connection closed:', event));
    this.onError((event) => console.error('WebSocket error:', event));
    this.onMessage((message) => console.log('Received message:', message));
    this.onAuthSuccess(() => console.log('Authentication successful'));
    this.onAuthFailure((error) => console.error('Authentication failed:', error));
    this.onStatusChange((status) => console.log('WebSocket status changed:', status));
  }

  /**
   * Connect to the WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.status === 'connected') {
        resolve();
        return;
      }

      this.updateStatus('connecting');
      console.log(`Connecting to WebSocket at ${this.url}`);
      
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connection opened');
          this.reconnectAttempts = 0;
          this.updateStatus('connected');
          this.startHeartbeat();
          this.onOpenCallbacks.forEach(callback => callback());
          
          // If we have a token, automatically authenticate
          if (this.token) {
            this.authenticate(this.token);
          }
          
          resolve();
        };
        
        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event);
          this.stopHeartbeat();
          this.authenticated = false;
          this.updateStatus('disconnected');
          this.onCloseCallbacks.forEach(callback => callback(event));
          
          // Attempt to reconnect if not closed cleanly
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };
        
        this.ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          this.updateStatus('error');
          this.onErrorCallbacks.forEach(callback => callback(event));
          reject(event);
        };
        
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as ServerMessage;
            console.log('Received message:', message);
            
            // Handle specific message types
            switch (message.type) {
              case 'auth_result':
                if (message.payload.success) {
                  this.authenticated = true;
                  this.updateStatus('authenticated');
                  this.onAuthSuccessCallbacks.forEach(callback => callback());
                } else {
                  this.authenticated = false;
                  this.onAuthFailureCallbacks.forEach(callback => 
                    callback(message.payload.error)
                  );
                }
                break;
              
              case 'response':
                this.onResponseCallbacks.forEach(callback => 
                  callback(message.payload.text)
                );
                break;
              
              case 'ping':
                this.sendMessage({ type: 'pong' });
                break;
              
              case 'pong':
                // Heartbeat response received, nothing to do
                break;
            }
            
            // Notify all general message handlers
            this.onMessageCallbacks.forEach(callback => callback(message));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        this.updateStatus('error');
        this.scheduleReconnect();
        reject(error);
      }
    });
  }

  /**
   * Update the WebSocket status and notify listeners
   */
  private updateStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.onStatusChangeCallbacks.forEach(callback => callback(status));
    }
  }

  /**
   * Authenticate with the server using a JWT token
   */
  public authenticate(token: string): void {
    this.token = token;
    console.log('Setting authentication token', token ? '[TOKEN PRESENT]' : '[NO TOKEN]');
    
    if (this.isConnected()) {
      console.log('Sending authentication message');
      this.sendMessage({
        type: 'auth',
        payload: { token }
      });
    } else {
      console.log('Not connected, cannot authenticate');
    }
  }

  /**
   * Send a query to the server
   */
  public sendQuery(text: string): void {
    if (!this.authenticated) {
      console.error('Cannot send query - not authenticated');
      return;
    }
    
    console.log('Sending query:', text);
    this.sendMessage({
      type: 'query',
      payload: { text }
    });
  }

  /**
   * Send a WebSocket message to the server
   */
  private sendMessage(message: ClientMessage): boolean {
    if (!this.isConnected()) {
      console.error('Cannot send message - WebSocket not connected');
      return false;
    }
    
    try {
      this.ws?.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  /**
   * Start the heartbeat to keep the connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    console.log('Starting heartbeat with interval:', this.heartbeatTimeoutMs);
    this.heartbeatInterval = window.setInterval(() => {
      if (this.isConnected()) {
        console.log('Sending heartbeat ping');
        this.sendMessage({ type: 'ping' });
      }
    }, this.heartbeatTimeoutMs);
  }

  /**
   * Stop the heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
      console.log('Stopped heartbeat');
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
    
    console.log(`Scheduling reconnect in ${this.reconnectTimeoutMs}ms`);
    this.reconnectInterval = window.setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      this.reconnectAttempts++;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectTimeoutMs);
  }

  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    console.log('Disconnecting WebSocket');
    this.stopHeartbeat();
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = undefined;
    }
    
    if (this.isConnected()) {
      this.ws?.close();
    }
    
    this.ws = null;
    this.authenticated = false;
    this.updateStatus('disconnected');
  }

  /**
   * Check if the WebSocket is connected
   */
  public isConnected(): boolean {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Check if the client is authenticated
   */
  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  /**
   * Get the current WebSocket status
   */
  public getStatus(): WebSocketStatus {
    return this.status;
  }

  // Event listeners
  public onOpen(callback: () => void): void {
    this.onOpenCallbacks.push(callback);
  }

  public onClose(callback: (event: CloseEvent) => void): void {
    this.onCloseCallbacks.push(callback);
  }

  public onError(callback: (event: Event) => void): void {
    this.onErrorCallbacks.push(callback);
  }

  public onMessage(callback: (message: ServerMessage) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  public onAuthSuccess(callback: () => void): void {
    this.onAuthSuccessCallbacks.push(callback);
  }

  public onAuthFailure(callback: (error?: string) => void): void {
    this.onAuthFailureCallbacks.push(callback);
  }

  public onResponse(callback: (text: string) => void): void {
    this.onResponseCallbacks.push(callback);
  }

  public onStatusChange(callback: (status: WebSocketStatus) => void): void {
    this.onStatusChangeCallbacks.push(callback);
  }
}

// Create a singleton instance
const buddyBotWebSocketService = new BuddyBotWebSocketClient();

export default buddyBotWebSocketService; 