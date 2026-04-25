export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  price: number;
}

export interface ProductQuery {
  code: string;
  name: string;
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
