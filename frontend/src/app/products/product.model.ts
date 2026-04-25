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
