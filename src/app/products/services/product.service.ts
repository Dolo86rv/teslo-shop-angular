import { inject, Injectable } from '@angular/core';
import { Product, ProductResponse } from '../intefaces/product-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

  getProducts(options: Options): Observable<ProductResponse> {
    const { limit = 9, offset = 0, gender = ''} = options;
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
    );
  }

  getProductByIdSlug(id: string): Observable<Product> {
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap((response) => console.log('Product fetched:', response)),
    );
  }

}
