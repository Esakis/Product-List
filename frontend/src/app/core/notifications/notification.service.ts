import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error';

export interface Notification {
  id: number;
  kind: NotificationKind;
  message: string;
}

const AUTO_DISMISS_MS = 4000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  readonly notifications = signal<Notification[]>([]);

  success(message: string): void {
    this.publish('success', message);
  }

  error(message: string): void {
    this.publish('error', message);
  }

  dismiss(id: number): void {
    this.notifications.update(items => items.filter(item => item.id !== id));
  }

  private publish(kind: NotificationKind, message: string): void {
    const notification: Notification = { id: this.nextId++, kind, message };
    this.notifications.update(items => [...items, notification]);
    setTimeout(() => this.dismiss(notification.id), AUTO_DISMISS_MS);
  }
}
