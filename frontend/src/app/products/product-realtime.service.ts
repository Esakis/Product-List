import { DestroyRef, Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from './product.model';

const PRODUCT_ADDED_EVENT = 'productAdded';
const HUB_PATH = '/hubs/products';

@Injectable({ providedIn: 'root' })
export class ProductRealtimeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productAddedSubject = new Subject<Product>();
  private connection: HubConnection | null = null;

  readonly productAdded$: Observable<Product> = this.productAddedSubject.asObservable();

  constructor() {
    this.connect();
    this.destroyRef.onDestroy(() => this.disconnect());
  }

  private connect(): void {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}${HUB_PATH}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on(PRODUCT_ADDED_EVENT, (product: Product) => {
      this.productAddedSubject.next(product);
    });

    this.connection.start().catch(() => undefined);
  }

  private disconnect(): void {
    if (this.connection && this.connection.state !== HubConnectionState.Disconnected) {
      void this.connection.stop();
    }
    this.connection = null;
  }
}
