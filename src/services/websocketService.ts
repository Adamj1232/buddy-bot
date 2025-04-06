type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
type MessageHandler = (data: any) => void;

interface WebSocketMessage {
  type: string;
  data: any;
  requestId?: string;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private status: WebSocketStatus = 'disconnected';
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private pendingRequests: Set<string> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url: string;

  constructor(url: string = import.meta.env.VITE_WS_SERVER_URL) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.status === 'connected') {
        resolve();
        return;
      }

      this.status = 'connecting';
      
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          this.status = 'connected';
          this.reconnectAttempts = 0;
          console.log('WebSocket connection established');
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            
            if (message.requestId && this.pendingRequests.has(message.requestId)) {
              this.pendingRequests.delete(message.requestId);
            }
            
            const handler = this.messageHandlers.get(message.type);
            if (handler) {
              handler(message.data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onclose = () => {
          this.status = 'disconnected';
          console.log('WebSocket connection closed');
          this.attemptReconnect();
        };
        
        this.socket.onerror = (error) => {
          this.status = 'error';
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        this.status = 'error';
        console.error('Error creating WebSocket:', error);
        this.attemptReconnect();
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.status !== 'connecting') {
      this.reconnectAttempts++;
      
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect().catch(() => {
          console.log('Reconnection failed');
        });
      }, delay);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.status = 'disconnected';
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
  }

  registerMessageHandler(type: string, handler: MessageHandler): void {
    this.messageHandlers.set(type, handler);
  }

  unregisterMessageHandler(type: string): void {
    this.messageHandlers.delete(type);
  }

  sendMessage(type: string, data: any, requestId?: string): boolean {
    if (!this.socket || this.status !== 'connected') {
      console.error('Cannot send message, WebSocket is not connected');
      return false;
    }
    
    // Don't allow new requests if we're already processing one
    if (this.pendingRequests.size > 0 && !requestId) {
      console.log('Request in progress, cannot send new request');
      return false;
    }
    
    const message: WebSocketMessage = {
      type,
      data
    };
    
    if (requestId) {
      message.requestId = requestId;
      this.pendingRequests.add(requestId);
    }
    
    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  hasPendingRequests(): boolean {
    return this.pendingRequests.size > 0;
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
