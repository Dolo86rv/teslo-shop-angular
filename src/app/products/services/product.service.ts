import { inject, Injectable } from '@angular/core';
import { Product, ProductResponse } from '../intefaces/product-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({providedIn: 'root'})

export class ProductResponseService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = ''} = options;

    const key = `${limit}-${offset}-${gender}`;
    if(this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductResponse>(`${baseUrl}/products`,
    {
      params: {
        limit,
        offset,
        gender,
      }
    }
    )
    .pipe(
      tap((response) => console.log('Products fetched:', response)),
      tap((response) => this.productsCache.set(key, response)),
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if(this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap((producto) => this.productCache.set(idSlug, producto)),
    )
  }

  getProductById(id: string): Observable<Product> {
    if(this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((producto) => this.productCache.set(id, producto)),
    )
  }

  updateProduct(productLike: Partial<Product>, id: string): Observable<Product> {
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
      tap((product) => {
        this.updateProductCache(product);
        console.log('Cache actualizado', product);
      }),
    )
  }

  updateProductCache(product: Product) {
    const id = product.id;

    this.productCache.set(id, product);

    this.productsCache.forEach( productResponse => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === id
                ? product
                : currentProduct;
      })
    })

  }


}
