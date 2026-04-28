// lib/ws.js - Native WebSocket Wrapper
import { nanoid } from 'nanoid';

class WSClient {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.callbacks = new Map();
        this.connected = false;
        this.connecting = false;
    }

    connect() {
        if (this.socket || this.connecting || this.connected) return;
        this.connecting = true;
        
        let wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/api/ws';
        
        // Append JWT token for authentication if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('meta_clash_token');
            if (token) {
                wsUrl += `?token=${token}`;
            }
        }
        
        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                this.connected = true;
                this.connecting = false;
                this._trigger('connect');
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    // Route to callback if ReqID exists
                    if (data.reqId && this.callbacks.has(data.reqId)) {
                        const cb = this.callbacks.get(data.reqId);
                        this.callbacks.delete(data.reqId);
                        cb({ ok: data.ok, err: data.error, ...data.payload });
                    }

                    // Always trigger generic event listeners
                    this._trigger(data.action, data.payload || data);
                } catch (e) {
                    console.error("WS Parse Error:", e);
                }
            };

            this.socket.onclose = () => {
                this.connected = false;
                this.connecting = false;
                this.socket = null;
                this._trigger('disconnect');
                // Reconnect loop MVP
                setTimeout(() => this.connect(), 2000);
            };

            this.socket.onerror = (error) => {
                this._trigger('connect_error', error);
            };
        } catch (e) {
            this.connecting = false;
            console.error("WS Connection setup failed", e);
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    emit(action, payload, callback) {
        let reqId = undefined;
        if (callback) {
            reqId = nanoid(8);
            this.callbacks.set(reqId, callback);
        }

        const msg = JSON.stringify({ action, reqId, payload });
        
        if (!this.connected) {
            // Queue simple MVP (if not connected, wait just a bit. production code would maintain a queue)
            setTimeout(() => {
                if (this.connected) this.socket.send(msg);
                else if (callback) callback({ ok: false, err: "Not connected" });
            }, 1000);
            return;
        }

        this.socket.send(msg);
    }

    _trigger(event, data) {
        if (this.listeners.has(event)) {
            for (const cb of this.listeners.get(event)) {
                cb(data);
            }
        }
    }
}

const wsClient = new WSClient();
export default wsClient;
