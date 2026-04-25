import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateProductRequest, Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly productsUrl = `${environment.apiBaseUrl}/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, request);
  }
}
