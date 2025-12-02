import * as signalR from '@microsoft/signalr';

type NotificationHandler = (notification: any) => void;

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private notificationHandlers: NotificationHandler[] = [];

    public startConnection(token: string) {
        if (this.connection) return;

        const hubUrl = process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'http://localhost:5003/notificationHub';

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        this.connection.start()
            .then(() => {
                console.log('SignalR Connected');
                this.registerHandlers();
            })
            .catch(err => console.error('SignalR Connection Error: ', err));
    }

    public stopConnection() {
        if (this.connection) {
            this.connection.stop();
            this.connection = null;
        }
    }

    public onNotification(handler: NotificationHandler) {
        this.notificationHandlers.push(handler);
        return () => {
            this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
        };
    }

    private registerHandlers() {
        if (!this.connection) return;

        this.connection.on('ReceiveNotification', (notification) => {
            this.notificationHandlers.forEach(handler => handler(notification));
        });
    }
}

export const signalRService = new SignalRService();
