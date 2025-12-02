import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from '../utils/constants';
import { Notification } from '@/types/notification';
import { getAccessToken } from '../api/client';

class NotificationHub {
    private connection: signalR.HubConnection | null = null;
    private onNotificationReceived: ((notification: Notification) => void) | null = null;
    private onNotificationRead: ((notificationId: string) => void) | null = null;

    /**
     * Initialize SignalR connection
     */
    async start(userId: string): Promise<void> {
        if (this.connection) {
            await this.stop(userId);
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(API_CONFIG.SIGNALR_HUB_URL, {
                accessTokenFactory: () => getAccessToken() || '',
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: () => {
                    // Exponential backoff: 2s, 4s, 8s, 16s, then 30s
                    return Math.min(30000, 2000 * Math.pow(2, this.connection?.state === signalR.HubConnectionState.Reconnecting ? 1 : 0));
                },
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Set up event handlers
        this.connection.on('ReceiveNotification', (notification: Notification) => {
            console.log('[SignalR] Notification received:', notification);
            if (this.onNotificationReceived) {
                this.onNotificationReceived(notification);
            }
        });

        this.connection.on('NotificationRead', (notificationId: string) => {
            console.log('[SignalR] Notification marked as read:', notificationId);
            if (this.onNotificationRead) {
                this.onNotificationRead(notificationId);
            }
        });

        // Handle reconnection events
        this.connection.onreconnecting((error) => {
            console.warn('[SignalR] Connection lost, reconnecting...', error);
        });

        this.connection.onreconnected((connectionId) => {
            console.log('[SignalR] Reconnected successfully. Connection ID:', connectionId);
            // Rejoin user group after reconnection
            if (this.connection) {
                this.connection.invoke('JoinUserGroup', userId).catch((err) => {
                    console.error('[SignalR] Failed to rejoin user group:', err);
                });
            }
        });

        this.connection.onclose((error) => {
            console.error('[SignalR] Connection closed:', error);
        });

        try {
            await this.connection.start();
            console.log('[SignalR] Connection started successfully');

            // Join user's notification group
            await this.connection.invoke('JoinUserGroup', userId);
            console.log(`[SignalR] Joined user group: ${userId}`);
        } catch (error) {
            console.error('[SignalR] Failed to start connection:', error);
            throw error;
        }
    }

    /**
     * Stop SignalR connection
     */
    async stop(userId: string): Promise<void> {
        if (this.connection) {
            try {
                // Leave user group before disconnecting
                await this.connection.invoke('LeaveUserGroup', userId);
                await this.connection.stop();
                console.log('[SignalR] Connection stopped');
            } catch (error) {
                console.error('[SignalR] Error stopping connection:', error);
            } finally {
                this.connection = null;
            }
        }
    }

    /**
     * Set callback for when a notification is received
     */
    setOnNotificationReceived(callback: (notification: Notification) => void): void {
        this.onNotificationReceived = callback;
    }

    /**
     * Set callback for when a notification is marked as read
     */
    setOnNotificationRead(callback: (notificationId: string) => void): void {
        this.onNotificationRead = callback;
    }

    /**
     * Get current connection state
     */
    getState(): signalR.HubConnectionState | null {
        return this.connection?.state || null;
    }

    /**
     * Check if connection is active
     */
    isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }
}

// Export singleton instance
export const notificationHub = new NotificationHub();
