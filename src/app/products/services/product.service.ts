import { inject, Injectable } from '@angular/core';
import { Product, ProductResponse } from '../intefaces/product-response.interface';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, tap } from 'rxjs';
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

  getProductByIdSlug(id: string): Observable<Product> {
    if(this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      delay(2000),
      tap((producto) => this.productCache.set(id, producto)),
    )
  }

}
