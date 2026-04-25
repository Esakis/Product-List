import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateProductRequest, PagedResult, Product, ProductQuery } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly productsUrl = `${environment.apiBaseUrl}/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  search(query: ProductQuery): Observable<PagedResult<Product>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize);
    const code = query.code.trim();
    const name = query.name.trim();
    if (code) {
      params = params.set('code', code);
    }
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get<PagedResult<Product>>(`${this.productsUrl}/search`, { params });
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, request);
  }
}
