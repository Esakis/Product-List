import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationHostComponent } from './core/notifications/notification-host/notification-host.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
